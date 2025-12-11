
# Backend Aeropro Companion

## Cómo ejecutar

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

La API quedará disponible en `http://localhost:8000` y la documentación automática en `http://localhost:8000/docs`.
