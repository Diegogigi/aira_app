
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    name: str
    diagnosis: Optional[str] = None
    role: Optional[str] = "user"


class ProfileCreate(ProfileBase):
    pass


class Profile(ProfileBase):
    id: int

    class Config:
        from_attributes = True


class TreatmentPlanBase(BaseModel):
    medication_name: str
    medication_type: Optional[str] = None
    puffs_per_dose: int = 1
    times_per_day: int = 1
    schedule_json: Optional[str] = None
    active: bool = True


class TreatmentPlanCreate(TreatmentPlanBase):
    profile_id: int


class TreatmentPlan(TreatmentPlanBase):
    id: int
    profile_id: int

    class Config:
        from_attributes = True


class InhalationLogBase(BaseModel):
    profile_id: int
    treatment_id: Optional[int] = None
    medication_name: str
    puffs: int = 1
    used_chamber: bool = True


class InhalationLogCreate(InhalationLogBase):
    pass


class InhalationLog(InhalationLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SymptomLogBase(BaseModel):
    profile_id: int
    level: int
    notes: Optional[str] = None
    triggers: Optional[str] = None


class SymptomLogCreate(SymptomLogBase):
    pass


class SymptomLog(SymptomLogBase):
    id: int
    day: datetime

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    profile_id: int
    event_type: str
    description: Optional[str] = None


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: int
    occurred_at: datetime

    class Config:
        from_attributes = True


class Summary(BaseModel):
    profile_id: int
    total_inhalations_last_7_days: int
    adherence_estimate: float
    average_symptom_level_last_7_days: float
    message: str


class ReportRequest(BaseModel):
    profile_id: int
    days: int = 7


class ReportDataRequest(BaseModel):
    profile: dict
    logs: List[dict]
    symptoms: List[dict]
    days: int = 7
