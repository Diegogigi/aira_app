# 🚀 Desplegar Frontend en Vercel

## ✅ Backend Ya Está Desplegado

**URL Backend:** https://web-production-f684d.up.railway.app

---

## 📦 Opción 1: Desplegar en Vercel (Recomendado)

### **Paso 1: Crear cuenta en Vercel**

1. Ve a: https://vercel.com
2. Haz clic en **"Sign Up"**
3. Conéctate con tu cuenta de GitHub

---

### **Paso 2: Importar Proyecto**

1. En Vercel, haz clic en **"Add New..."** → **"Project"**
2. Busca tu repositorio: **`aira_app`**
3. Haz clic en **"Import"**

---

### **Paso 3: Configurar el Proyecto**

En la pantalla de configuración:

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

---

### **Paso 4: Variables de Entorno**

Agrega estas variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://web-production-f684d.up.railway.app` |
| `VITE_APP_NAME` | `AeroPro` |

---

### **Paso 5: Deploy**

Haz clic en **"Deploy"**

Vercel desplegará tu frontend y te dará una URL como:
```
https://aira-app.vercel.app
```

---

## 🔗 Conectar Backend con Frontend

### **En Railway (Backend):**

1. Ve a tu servicio backend
2. Click en **"Variables"**
3. Edita `CORS_ORIGINS` o agrégala:

```
CORS_ORIGINS=https://aira-app.vercel.app,https://aira-app-tu-usuario.vercel.app
```

4. Re-deploya el backend

---

## 📦 Opción 2: Desplegar en Netlify

### **Paso 1:** Ve a https://netlify.com y conecta con GitHub

### **Paso 2:** Importa tu repositorio

### **Paso 3:** Configuración:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### **Paso 4:** Variables de entorno:

```
VITE_API_URL=https://web-production-f684d.up.railway.app
```

### **Paso 5:** Deploy

---

## 🗄️ Agregar Base de Datos PostgreSQL

Una vez que el frontend esté desplegado:

1. En Railway, ve a tu proyecto
2. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Railway automáticamente conectará `DATABASE_URL`

---

## ✅ Checklist Final

- [ ] Backend desplegado en Railway ✅ (Ya está)
- [ ] Frontend desplegado en Vercel/Netlify
- [ ] Variables de entorno configuradas en frontend
- [ ] CORS configurado en backend
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables `SECRET_KEY` agregada en Railway

---

## 🎉 Una vez completado:

Tendrás:
- ✅ Frontend funcionando en Vercel
- ✅ Backend funcionando en Railway
- ✅ Base de datos PostgreSQL
- ✅ Todo conectado y funcionando

---

## 💡 Alternativa Rápida:

También puedo ayudarte a configurar el backend para que sirva el frontend (todo en Railway).
¿Prefieres eso o desplegar el frontend en Vercel?

