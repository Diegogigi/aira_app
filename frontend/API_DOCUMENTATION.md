# 📡 Documentación de API - AeroPro Frontend ↔ Backend

## 🚀 Configuración Inicial

### 1. **Variables de Entorno**

Crea un archivo `.env` en la carpeta `frontend/`:

```bash
VITE_API_URL=http://localhost:8000
```

### 2. **Instalar Dependencias**

```bash
cd frontend
npm install
```

### 3. **Iniciar Backend**

```bash
cd backend
python start_server.py
```

El backend estará disponible en: `http://localhost:8000`

### 4. **Iniciar Frontend**

```bash
cd frontend
npm run dev
```

---

## 📚 Uso del Hook `useAPI`

El hook `useAPI` proporciona acceso fácil a todas las funciones del backend.

### **Ejemplo Básico**

```jsx
import useAPI from '../hooks/useAPI'

function MyComponent() {
  const { createInhalation, loading, error } = useAPI()

  const handleSubmit = async () => {
    const result = await createInhalation({
      profile_id: 1,
      medication_name: 'Salbutamol',
      puffs: 2,
      used_chamber: true,
      notes: 'Me sentí mejor'
    })

    if (result.success) {
      console.log('Inhalación registrada:', result.data)
    } else {
      console.error('Error:', result.error)
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando...' : 'Registrar Inhalación'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
```

---

## 🔐 Autenticación

### **1. Registro de Usuario**

```jsx
const { register } = useAPI()

const handleRegister = async () => {
  const result = await register({
    name: 'Diego González',
    email: 'diego@example.com',
    password: 'miPassword123'
  })

  if (result.success) {
    console.log('Usuario creado:', result.data)
  }
}
```

### **2. Inicio de Sesión**

```jsx
const { login } = useAPI()

const handleLogin = async () => {
  const result = await login('diego@example.com', 'miPassword123')

  if (result.success) {
    console.log('Sesión iniciada:', result.data)
    // El token se guarda automáticamente
  }
}
```

### **3. Obtener Usuario Actual**

```jsx
const { getCurrentUser } = useAPI()

useEffect(() => {
  const loadUser = async () => {
    const result = await getCurrentUser()
    if (result.success) {
      console.log('Usuario actual:', result.data)
    }
  }
  loadUser()
}, [])
```

### **4. Cerrar Sesión**

```jsx
const { logout } = useAPI()

const handleLogout = () => {
  logout()
  // El token se elimina automáticamente
  window.location.href = '/login'
}
```

---

## 👤 Perfiles

### **1. Crear Perfil**

```jsx
const { createProfile } = useAPI()

const handleCreateProfile = async () => {
  const result = await createProfile({
    name: 'Diego González',
    diagnosis: 'asthma',
    role: 'patient'
  })

  if (result.success) {
    console.log('Perfil creado:', result.data)
  }
}
```

### **2. Obtener Perfiles**

```jsx
const { getProfiles } = useAPI()

useEffect(() => {
  const loadProfiles = async () => {
    const result = await getProfiles()
    if (result.success) {
      console.log('Perfiles:', result.data)
    }
  }
  loadProfiles()
}, [])
```

---

## 💨 Inhalaciones

### **1. Registrar Inhalación**

```jsx
const { createInhalation } = useAPI()

const handleRegisterInhalation = async () => {
  const result = await createInhalation({
    profile_id: 1,
    medication_name: 'Salbutamol',
    puffs: 2,
    used_chamber: true,
    notes: 'Respiración mejorada después de 5 minutos',
    treatment_id: null // Opcional
  })

  if (result.success) {
    console.log('Inhalación registrada:', result.data)
  }
}
```

### **2. Obtener Inhalaciones**

```jsx
const { getInhalations } = useAPI()

useEffect(() => {
  const loadInhalations = async () => {
    const result = await getInhalations(1) // profile_id
    if (result.success) {
      console.log('Inhalaciones:', result.data)
    }
  }
  loadInhalations()
}, [])
```

---

## 💔 Síntomas

### **1. Registrar Síntoma**

```jsx
const { createSymptom } = useAPI()

const handleRegisterSymptom = async () => {
  const result = await createSymptom({
    profile_id: 1,
    level: 1, // 0=controlado, 1=leve, 2=moderado, 3=grave
    notes: 'Tos leve en la mañana',
    triggers: ['cold', 'exercise'] // Opcional
  })

  if (result.success) {
    console.log('Síntoma registrado:', result.data)
  }
}
```

### **2. Obtener Síntomas**

```jsx
const { getSymptoms } = useAPI()

useEffect(() => {
  const loadSymptoms = async () => {
    const result = await getSymptoms(1) // profile_id
    if (result.success) {
      console.log('Síntomas:', result.data)
    }
  }
  loadSymptoms()
}, [])
```

---

## 📊 Estadísticas

### **Obtener Resumen**

```jsx
const { getSummary } = useAPI()

useEffect(() => {
  const loadSummary = async () => {
    const result = await getSummary(1) // profile_id
    if (result.success) {
      console.log('Resumen:', result.data)
      // result.data contiene:
      // - total_inhalations_last_7_days
      // - adherence_estimate
      // - average_symptom_level_last_7_days
      // - message
    }
  }
  loadSummary()
}, [])
```

---

## 📄 Generación de PDF

### **1. Generar PDF con Autenticación**

```jsx
const { generateReportPDF } = useAPI()

const handleGeneratePDF = async () => {
  const result = await generateReportPDF({
    profile_id: 1,
    days: 30 // Últimos 30 días
  })

  if (result.success) {
    console.log('PDF descargado')
  }
}
```

### **2. Generar PDF sin Autenticación (Offline)**

```jsx
const { generateReportPDFPublic } = useAPI()

const handleGeneratePDFPublic = async () => {
  const result = await generateReportPDFPublic({
    profile: {
      name: 'Diego González',
      diagnosis: 'Asma'
    },
    logs: [
      {
        medication_name: 'Salbutamol',
        puffs: 2,
        created_at: '2025-12-10',
        used_chamber: true
      }
    ],
    symptoms: [
      {
        level: 1,
        day: '2025-12-10',
        notes: 'Leve'
      }
    ],
    days: 30
  })

  if (result.success) {
    console.log('PDF descargado')
  }
}
```

---

## 🔄 Migración de localStorage a API

### **Ejemplo de Componente Híbrido**

Este componente funciona con localStorage Y con API:

```jsx
import { useState, useEffect } from 'react'
import useAPI from '../hooks/useAPI'

function HybridComponent() {
  const [logs, setLogs] = useState([])
  const { getInhalations, createInhalation, loading } = useAPI()
  const profileId = 1 // Obtener del contexto

  // Cargar datos
  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    // Intentar cargar desde API
    const result = await getInhalations(profileId)
    
    if (result.success && result.data.length > 0) {
      // Si hay datos en API, usarlos
      setLogs(result.data)
      // Guardar en localStorage como backup
      localStorage.setItem('inhalationLogs', JSON.stringify(result.data))
    } else {
      // Si no hay datos en API, cargar desde localStorage
      const localLogs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
      setLogs(localLogs)
    }
  }

  const addLog = async (logData) => {
    // Intentar guardar en API
    const result = await createInhalation({
      profile_id: profileId,
      ...logData
    })

    if (result.success) {
      // Si se guardó en API, actualizar estado
      setLogs([result.data, ...logs])
      // También guardar en localStorage como backup
      const updatedLogs = [result.data, ...logs]
      localStorage.setItem('inhalationLogs', JSON.stringify(updatedLogs))
    } else {
      // Si falló API, guardar solo en localStorage
      const newLog = {
        id: Date.now(),
        ...logData,
        created_at: new Date().toISOString()
      }
      const updatedLogs = [newLog, ...logs]
      setLogs(updatedLogs)
      localStorage.setItem('inhalationLogs', JSON.stringify(updatedLogs))
    }
  }

  return (
    <div>
      <button onClick={() => addLog({ medication_name: 'Salbutamol', puffs: 2 })}>
        {loading ? 'Guardando...' : 'Registrar'}
      </button>
      {logs.map(log => (
        <div key={log.id}>{log.medication_name}</div>
      ))}
    </div>
  )
}
```

---

## 🛠️ Manejo de Errores

El hook `useAPI` proporciona manejo automático de errores:

```jsx
const { createInhalation, loading, error, clearError } = useAPI()

// error contiene el mensaje de error si algo falló
// loading indica si hay una operación en curso
// clearError() limpia el error actual

useEffect(() => {
  if (error) {
    // Mostrar notificación de error
    alert(error)
    // Limpiar error después de 3 segundos
    setTimeout(() => clearError(), 3000)
  }
}, [error])
```

---

## 📋 Endpoints Disponibles

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| **POST** | `/users/` | Crear usuario | ❌ |
| **POST** | `/token` | Login | ❌ |
| **GET** | `/users/me` | Usuario actual | ✅ |
| **POST** | `/profiles/` | Crear perfil | ✅ |
| **GET** | `/profiles/` | Listar perfiles | ✅ |
| **POST** | `/inhalations/` | Registrar inhalación | ✅ |
| **GET** | `/inhalations/` | Listar inhalaciones | ✅ |
| **POST** | `/symptoms/` | Registrar síntoma | ✅ |
| **GET** | `/symptoms/` | Listar síntomas | ✅ |
| **POST** | `/treatments/` | Crear tratamiento | ✅ |
| **GET** | `/treatments/` | Listar tratamientos | ✅ |
| **POST** | `/events/` | Crear evento | ✅ |
| **GET** | `/events/` | Listar eventos | ✅ |
| **GET** | `/summary/` | Obtener resumen | ✅ |
| **POST** | `/report/pdf` | Generar PDF | ✅ |
| **POST** | `/report/pdf/generate` | Generar PDF público | ❌ |
| **GET** | `/health` | Health check | ❌ |

✅ = Requiere autenticación  
❌ = No requiere autenticación

---

## 🔗 URL del Backend

La URL del backend se configura en el archivo `.env`:

```bash
# Desarrollo local
VITE_API_URL=http://localhost:8000

# Producción
VITE_API_URL=https://api.aeropro.com
```

---

## ✅ Verificar Conexión

```jsx
import useAPI from '../hooks/useAPI'

function HealthCheck() {
  const { checkHealth } = useAPI()

  useEffect(() => {
    const check = async () => {
      const result = await checkHealth()
      if (result.success) {
        console.log('✅ Backend conectado:', result.data)
      } else {
        console.error('❌ Backend no disponible:', result.error)
      }
    }
    check()
  }, [])

  return <div>Verificando conexión...</div>
}
```

---

## 🚀 Próximos Pasos

1. ✅ Configurar `.env` con la URL del backend
2. ✅ Iniciar el backend
3. ✅ Probar endpoints con el health check
4. ✅ Migrar componentes de localStorage a API
5. ✅ Mantener localStorage como fallback

---

## 💡 Consejos

- **Siempre maneja errores**: Usa el `error` del hook
- **Muestra estados de carga**: Usa el `loading` del hook
- **Mantén fallback**: Guarda en localStorage si falla la API
- **Token automático**: El hook maneja el token automáticamente
- **CORS**: El backend ya tiene CORS configurado

---

**¡La API está lista para usar!** 🎉

