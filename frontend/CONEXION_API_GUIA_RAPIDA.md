# 🚀 Guía Rápida: Conectar Frontend con Backend

## ✅ Pasos para Conectar

### 1️⃣ **Configurar Variables de Entorno**

Crea un archivo `.env` en `frontend/`:

```bash
VITE_API_URL=http://localhost:8000
```

---

### 2️⃣ **Iniciar el Backend**

```bash
cd backend
python start_server.py
```

El backend estará en: http://localhost:8000

---

### 3️⃣ **Iniciar el Frontend**

```bash
cd frontend
npm run dev
```

El frontend estará en: http://localhost:5173

---

### 4️⃣ **Verificar Conexión**

Abre la consola del navegador y ejecuta:

```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend conectado:', d))
  .catch(e => console.error('❌ Error:', e))
```

---

## 📚 Uso en Componentes

### **Importar el hook:**

```jsx
import useAPI from '../hooks/useAPI'
```

### **Ejemplo básico:**

```jsx
function MiComponente() {
  const { createInhalation, loading, error } = useAPI()

  const handleSubmit = async () => {
    const result = await createInhalation({
      profile_id: 1,
      medication_name: 'Salbutamol',
      puffs: 2,
      used_chamber: true
    })

    if (result.success) {
      console.log('✅ Guardado:', result.data)
    } else {
      console.error('❌ Error:', result.error)
    }
  }

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Guardando...' : 'Registrar'}
    </button>
  )
}
```

---

## 🔗 Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/users/` | POST | Crear usuario |
| `/token` | POST | Login |
| `/profiles/` | GET/POST | Perfiles |
| `/inhalations/` | GET/POST | Inhalaciones |
| `/symptoms/` | GET/POST | Síntomas |
| `/summary/` | GET | Estadísticas |
| `/report/pdf` | POST | Generar PDF |

---

## 📖 Documentación Completa

Ver: `API_DOCUMENTATION.md`

---

## ✨ ¡Listo!

Ahora puedes usar la API en todos tus componentes con el hook `useAPI`.

