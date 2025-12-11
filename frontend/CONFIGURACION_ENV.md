# ⚙️ Configuración de Variables de Entorno

## 📝 Crear archivo `.env`

Crea un archivo llamado `.env` en la carpeta `frontend/` con el siguiente contenido:

```bash
# URL del backend API
VITE_API_URL=http://localhost:8000
```

## 🚀 Para Desarrollo Local

```bash
VITE_API_URL=http://localhost:8000
```

## 🌐 Para Producción

```bash
VITE_API_URL=https://tu-dominio.com
```

## ✅ Verificar

Después de crear el archivo, reinicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación debería poder conectarse al backend.

---

**Nota**: El archivo `.env` NO debe subirse a git (ya está en `.gitignore`)

