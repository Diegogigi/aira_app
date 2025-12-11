
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from . import models, schemas
from .database import engine, Base, get_db
from .pdf_generator import PDFReport

from jose import JWTError, jwt
from passlib.context import CryptContext
import os

Base.metadata.create_all(bind=engine)

SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="Aeropro Respiratory Companion API")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


@app.post("/users/", response_model=schemas.User)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_pw,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/profiles/", response_model=schemas.Profile)
def create_profile(
    profile_in: schemas.ProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_profile = models.Profile(
        name=profile_in.name,
        diagnosis=profile_in.diagnosis,
        role=profile_in.role,
        owner_id=current_user.id,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@app.get("/profiles/", response_model=List[schemas.Profile])
def list_profiles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profiles = db.query(models.Profile).filter(models.Profile.owner_id == current_user.id).all()
    return profiles


@app.post("/treatments/", response_model=schemas.TreatmentPlan)
def create_treatment(
    treatment_in: schemas.TreatmentPlanCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.Profile).filter(
        models.Profile.id == treatment_in.profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db_treatment = models.TreatmentPlan(**treatment_in.model_dump())
    db.add(db_treatment)
    db.commit()
    db.refresh(db_treatment)
    return db_treatment


@app.get("/treatments/", response_model=List[schemas.TreatmentPlan])
def list_treatments(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    treatments = (
        db.query(models.TreatmentPlan)
        .join(models.Profile)
        .filter(
            models.Profile.owner_id == current_user.id,
            models.TreatmentPlan.profile_id == profile_id,
        )
        .all()
    )
    return treatments


@app.post("/inhalations/", response_model=schemas.InhalationLog)
def create_inhalation(
    inhalation_in: schemas.InhalationLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.Profile).filter(
        models.Profile.id == inhalation_in.profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if inhalation_in.treatment_id:
        treatment = db.query(models.TreatmentPlan).filter(
            models.TreatmentPlan.id == inhalation_in.treatment_id,
            models.TreatmentPlan.profile_id == profile.id,
        ).first()
        if not treatment:
            raise HTTPException(status_code=404, detail="Treatment not found")

    db_log = models.InhalationLog(**inhalation_in.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@app.get("/inhalations/", response_model=List[schemas.InhalationLog])
def list_inhalations(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    logs = (
        db.query(models.InhalationLog)
        .join(models.Profile)
        .filter(
            models.Profile.owner_id == current_user.id,
            models.InhalationLog.profile_id == profile_id,
        )
        .order_by(models.InhalationLog.created_at.desc())
        .all()
    )
    return logs


@app.post("/symptoms/", response_model=schemas.SymptomLog)
def create_symptom_log(
    symptom_in: schemas.SymptomLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.Profile).filter(
        models.Profile.id == symptom_in.profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db_log = models.SymptomLog(**symptom_in.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@app.get("/symptoms/", response_model=List[schemas.SymptomLog])
def list_symptoms(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    logs = (
        db.query(models.SymptomLog)
        .join(models.Profile)
        .filter(
            models.Profile.owner_id == current_user.id,
            models.SymptomLog.profile_id == profile_id,
        )
        .order_by(models.SymptomLog.day.desc())
        .all()
    )
    return logs


@app.post("/events/", response_model=schemas.Event)
def create_event(
    event_in: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    profile = db.query(models.Profile).filter(
        models.Profile.id == event_in.profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db_event = models.Event(**event_in.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@app.get("/events/", response_model=List[schemas.Event])
def list_events(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    events = (
        db.query(models.Event)
        .join(models.Profile)
        .filter(
            models.Profile.owner_id == current_user.id,
            models.Event.profile_id == profile_id,
        )
        .order_by(models.Event.occurred_at.desc())
        .all()
    )
    return events


@app.get("/summary/", response_model=schemas.Summary)
def get_summary(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    from datetime import timedelta

    profile = db.query(models.Profile).filter(
        models.Profile.id == profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)

    inhalations = (
        db.query(models.InhalationLog)
        .filter(
            models.InhalationLog.profile_id == profile_id,
            models.InhalationLog.created_at >= week_ago,
        )
        .all()
    )
    symptoms = (
        db.query(models.SymptomLog)
        .filter(
            models.SymptomLog.profile_id == profile_id,
            models.SymptomLog.day >= week_ago,
        )
        .all()
    )

    total_inhalations = len(inhalations)
    avg_symptom = sum(s.level for s in symptoms) / len(symptoms) if symptoms else 0.0

    if avg_symptom <= 1 and total_inhalations >= 7:
        msg = "Tus registros muestran buena adherencia y síntomas estables. Mantén el plan indicado por tu profesional de salud."
    elif avg_symptom > 2:
        msg = "Tus síntomas han sido frecuentes o intensos en los últimos días. Esta app no reemplaza a tu médico; sería recomendable revisar tu tratamiento con un profesional."
    else:
        msg = "Se observan algunas variaciones en tus síntomas o adherencia. Mantén tus registros y comenta estos datos en tu próxima consulta."

    expected_doses = 7 * 2
    adherence = float(total_inhalations) / expected_doses if expected_doses else 0.0
    if adherence > 1:
        adherence = 1.0

    return schemas.Summary(
        profile_id=profile_id,
        total_inhalations_last_7_days=total_inhalations,
        adherence_estimate=adherence,
        average_symptom_level_last_7_days=avg_symptom,
        message=msg,
    )


@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/report/pdf")
def generate_pdf_report(
    report_request: schemas.ReportRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Genera un reporte médico en formato PDF (requiere autenticación)"""
    
    # Verificar que el perfil pertenece al usuario
    profile = db.query(models.Profile).filter(
        models.Profile.id == report_request.profile_id,
        models.Profile.owner_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Obtener datos del período especificado
    days = report_request.days
    now = datetime.utcnow()
    cutoff_date = now - timedelta(days=days)
    
    # Obtener logs de inhalaciones
    inhalations = (
        db.query(models.InhalationLog)
        .filter(
            models.InhalationLog.profile_id == report_request.profile_id,
            models.InhalationLog.created_at >= cutoff_date,
        )
        .all()
    )
    
    # Obtener logs de síntomas
    symptoms = (
        db.query(models.SymptomLog)
        .filter(
            models.SymptomLog.profile_id == report_request.profile_id,
            models.SymptomLog.day >= cutoff_date,
        )
        .order_by(models.SymptomLog.day.desc())
        .all()
    )
    
    # Calcular estadísticas
    expected_doses = days * 3  # Asumiendo 3 dosis diarias
    actual_doses = len(inhalations)
    adherence = min(100, round((actual_doses / expected_doses) * 100)) if expected_doses > 0 else 0
    
    avg_symptom_level = sum(s.level for s in symptoms) / len(symptoms) if symptoms else 0
    days_with_good_control = len([s for s in symptoms if s.level == 0])
    
    # Medicamentos más usados
    med_counts = {}
    for log in inhalations:
        med_counts[log.medication_name] = med_counts.get(log.medication_name, 0) + 1
    
    stats = {
        'adherence': adherence,
        'totalDoses': actual_doses,
        'expectedDoses': expected_doses,
        'avgSymptomLevel': avg_symptom_level,
        'daysWithGoodControl': days_with_good_control,
        'totalSymptomDays': len(symptoms),
        'medications': med_counts,
        'days': days,
    }
    
    # Preparar datos del perfil
    profile_data = {
        'name': profile.name,
        'diagnosis': profile.diagnosis,
    }
    
    # Preparar datos de síntomas para el PDF
    symptom_data = []
    for s in symptoms:
        symptom_data.append({
            'day': s.day,
            'level': s.level,
            'notes': s.notes,
        })
    
    # Generar el PDF
    pdf_generator = PDFReport()
    pdf_content = pdf_generator.generate_report(profile_data, stats, inhalations, symptom_data)
    
    # Preparar nombre del archivo
    filename = f"reporte_aeropro_{profile.name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    # Retornar el PDF como respuesta
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@app.post("/report/pdf/generate")
def generate_pdf_report_public(report_data: schemas.ReportDataRequest):
    """Genera un reporte médico en formato PDF (sin autenticación, para uso offline)"""
    
    # Obtener datos del request
    profile_data = report_data.profile
    logs = report_data.logs
    symptoms = report_data.symptoms
    days = report_data.days
    
    # Calcular estadísticas
    expected_doses = days * 3  # Asumiendo 3 dosis diarias
    actual_doses = len(logs)
    adherence = min(100, round((actual_doses / expected_doses) * 100)) if expected_doses > 0 else 0
    
    avg_symptom_level = sum(s.get('level', 0) for s in symptoms) / len(symptoms) if symptoms else 0
    days_with_good_control = len([s for s in symptoms if s.get('level', 0) == 0])
    
    # Medicamentos más usados
    med_counts = {}
    for log in logs:
        med_name = log.get('medication_name', 'Medicamento no especificado')
        med_counts[med_name] = med_counts.get(med_name, 0) + 1
    
    stats = {
        'adherence': adherence,
        'totalDoses': actual_doses,
        'expectedDoses': expected_doses,
        'avgSymptomLevel': avg_symptom_level,
        'daysWithGoodControl': days_with_good_control,
        'totalSymptomDays': len(symptoms),
        'medications': med_counts,
        'days': days,
    }
    
    # Generar el PDF
    pdf_generator = PDFReport()
    pdf_content = pdf_generator.generate_report(profile_data, stats, logs, symptoms)
    
    # Preparar nombre del archivo
    patient_name = profile_data.get('name', 'paciente').replace(' ', '_')
    filename = f"reporte_aeropro_{patient_name}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    # Retornar el PDF como respuesta
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )
