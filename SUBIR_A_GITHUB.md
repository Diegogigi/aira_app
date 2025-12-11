# 🚀 Subir AeroPro a GitHub

## ✅ Pasos Rápidos

### **1️⃣ Abrir Terminal en el Proyecto**

Abre PowerShell o CMD en la carpeta del proyecto:

```powershell
cd C:\Users\hp\Desktop\aeropro_app
```

---

### **2️⃣ Verificar Git**

```powershell
git --version
```

Si no tienes Git, descárgalo de: https://git-scm.com/

---

### **3️⃣ Configurar Git (solo la primera vez)**

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

---

### **4️⃣ Inicializar Git**

```powershell
git init
```

---

### **5️⃣ Agregar Archivos**

```powershell
git add .
```

---

### **6️⃣ Hacer el Primer Commit**

```powershell
git commit -m "Initial commit: AeroPro con Aira v1.0"
```

---

### **7️⃣ Crear Repositorio en GitHub**

1. Ve a: https://github.com
2. Inicia sesión
3. Click en **"+"** → **"New repository"**
4. Configuración:
   - **Repository name**: `aira_app`
   - **Description**: "AeroPro - Plataforma respiratoria con Aira (IA)"
   - **Visibility**: Private o Public (tu elección)
   - ❌ NO marques "Add README"
   - ❌ NO marques ".gitignore"
5. Click **"Create repository"**

---

### **8️⃣ Conectar y Subir**

**Copia estos comandos (REEMPLAZA <tu-usuario>):**

```powershell
git remote add origin https://github.com/<tu-usuario>/aira_app.git
git branch -M main
git push -u origin main
```

**Ejemplo:**
```powershell
git remote add origin https://github.com/diego123/aira_app.git
git branch -M main
git push -u origin main
```

---

## ✅ ¡Listo!

Tu proyecto está en GitHub: `https://github.com/<tu-usuario>/aira_app`

---

## 🔄 Para Subir Cambios Futuros

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 🚨 Si Hay Errores

### **Error: "remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/<tu-usuario>/aira_app.git
```

### **Error: "permission denied"**
GitHub ahora usa tokens personales. Necesitas:
1. Ir a GitHub → Settings → Developer settings → Personal access tokens
2. Generar nuevo token
3. Usarlo como contraseña al hacer push

---

## 📁 Archivos Protegidos (NO se suben)

El `.gitignore` ya protege:
- ✅ `.env` (secretos)
- ✅ `node_modules/`
- ✅ `venv/`
- ✅ `__pycache__/`
- ✅ `*.db` (base de datos)

---

## ✨ Siguiente Paso

Una vez en GitHub, continúa con el despliegue en Railway.

