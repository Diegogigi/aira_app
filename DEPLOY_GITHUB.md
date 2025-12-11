# 📤 Subir AeroPro a GitHub

## 🎯 Paso a Paso

### **1️⃣ Preparar el Proyecto**

#### **A. Verificar que tienes Git instalado**

```bash
git --version
```

Si no está instalado, descárgalo de: https://git-scm.com/

#### **B. Crear archivo `.env` para backend**

En `backend/`, crea `.env` (este NO se subirá a GitHub):

```bash
DATABASE_URL=sqlite:///./aeropro.db
SECRET_KEY=tu_secreto_super_seguro_aqui_cambiar_en_produccion
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

#### **C. Crear archivo `.env` para frontend**

En `frontend/`, crea `.env` (este NO se subirá a GitHub):

```bash
VITE_API_URL=http://localhost:8000
```

---

### **2️⃣ Inicializar Git en el Proyecto**

Abre terminal en la carpeta raíz del proyecto (`aeropro_app/`):

```bash
# Ir a la carpeta del proyecto
cd c:\Users\hp\Desktop\aeropro_app

# Inicializar Git
git init

# Verificar archivos
git status
```

---

### **3️⃣ Hacer el Primer Commit**

```bash
# Agregar todos los archivos (excepto los del .gitignore)
git add .

# Verificar qué se va a subir
git status

# Hacer el primer commit
git commit -m "Initial commit: AeroPro v1.0 con Aira integrada"
```

---

### **4️⃣ Crear Repositorio en GitHub**

#### **A. Ir a GitHub**
- Entra a https://github.com
- Inicia sesión (o crea una cuenta si no tienes)

#### **B. Crear nuevo repositorio**
1. Click en el botón **"+"** arriba a la derecha
2. Selecciona **"New repository"**
3. Llena los datos:
   - **Repository name**: `aeropro-app`
   - **Description**: "AeroPro - Plataforma de seguimiento respiratorio con Aira (copiloto IA)"
   - **Visibility**: Private o Public (tu elección)
   - **NO marques** "Add a README file" (ya lo tienes)
   - **NO marques** "Add .gitignore" (ya lo tienes)
4. Click en **"Create repository"**

---

### **5️⃣ Conectar con GitHub y Subir**

GitHub te mostrará comandos. Usa estos:

```bash
# Agregar el repositorio remoto (CAMBIA <tu-usuario>)
git remote add origin https://github.com/<tu-usuario>/aeropro-app.git

# Cambiar nombre de rama a main
git branch -M main

# Subir el código
git push -u origin main
```

**Ejemplo con tu usuario:**
```bash
git remote add origin https://github.com/tu-usuario/aeropro-app.git
git branch -M main
git push -u origin main
```

---

### **6️⃣ Verificar en GitHub**

1. Refresca tu página en GitHub
2. Deberías ver todos tus archivos
3. Verifica que **NO** estén los archivos `.env`, `node_modules/`, `__pycache__/`, etc.

---

## ✅ ¡Listo! Proyecto en GitHub

Tu proyecto ya está en GitHub y listo para desplegarse en Railway.

---

## 📝 Comandos Útiles para el Futuro

### **Subir cambios nuevos:**
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### **Ver estado:**
```bash
git status
```

### **Ver historial:**
```bash
git log --oneline
```

### **Crear una nueva rama:**
```bash
git checkout -b nombre-rama
```

---

## 🔒 Archivos que NO se Suben

Estos archivos están protegidos por `.gitignore`:

- ❌ `.env` (secretos y configuración local)
- ❌ `node_modules/` (dependencias de Node)
- ❌ `__pycache__/` (cache de Python)
- ❌ `venv/` (entorno virtual de Python)
- ❌ `*.db` (base de datos local)
- ❌ `.DS_Store` (archivos de macOS)

---

## 🚨 Importante

**NUNCA subas:**
- Archivos `.env` con secretos
- Tokens o claves API
- Contraseñas
- Datos sensibles

Si accidentalmente subes un archivo con secretos:
1. Cambia inmediatamente todas las claves
2. Elimina el archivo del historial de Git
3. Sube los cambios

---

## 📞 Problemas Comunes

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/<tu-usuario>/aeropro-app.git
```

### **Error: "permission denied"**
Configura tu token de GitHub:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### **Error: "failed to push"**
```bash
git pull origin main --rebase
git push origin main
```

---

## ✨ Siguiente Paso

Una vez subido a GitHub, ve a: **`DEPLOY_RAILWAY.md`**

Para desplegar en Railway y configurar la base de datos.

