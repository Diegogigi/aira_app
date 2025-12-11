"""
Script para iniciar el servidor de Aeropro desde cualquier ubicación
"""
import os
import sys

# Asegurar que estamos en el directorio correcto
current_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(current_dir)

# Agregar el directorio actual al path
sys.path.insert(0, current_dir)

# Iniciar uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)




