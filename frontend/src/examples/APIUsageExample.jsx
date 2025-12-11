/**
 * ARCHIVO DE EJEMPLO - Uso de la API
 * 
 * Este archivo muestra ejemplos prácticos de cómo usar useAPI en componentes
 */

import React, { useState, useEffect } from 'react'
import useAPI from '../hooks/useAPI'

// ============================================
// EJEMPLO 1: Login y Registro
// ============================================

export function LoginExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, register, loading, error } = useAPI()

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    
    if (result.success) {
      alert('¡Sesión iniciada!')
      window.location.href = '/home'
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const result = await register({
      name: 'Usuario Nuevo',
      email,
      password
    })
    
    if (result.success) {
      alert('¡Usuario creado! Ahora puedes iniciar sesión')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Registro</h2>
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: 10, padding: 8 }}
        />
        <div>
          <button type="submit" disabled={loading} style={{ margin: 5 }}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          <button type="button" onClick={handleRegister} disabled={loading} style={{ margin: 5 }}>
            Registrarse
          </button>
        </div>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

// ============================================
// EJEMPLO 2: Registrar Inhalación
// ============================================

export function InhalationLogExample() {
  const [medication, setMedication] = useState('Salbutamol')
  const [puffs, setPuffs] = useState(2)
  const [logs, setLogs] = useState([])
  const { createInhalation, getInhalations, loading, error } = useAPI()
  const profileId = 1 // En producción, obtener del contexto/estado global

  // Cargar logs al montar
  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    const result = await getInhalations(profileId)
    if (result.success) {
      setLogs(result.data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await createInhalation({
      profile_id: profileId,
      medication_name: medication,
      puffs: parseInt(puffs),
      used_chamber: true,
      notes: ''
    })

    if (result.success) {
      alert('¡Inhalación registrada!')
      loadLogs() // Recargar lista
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Registrar Inhalación</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Medicamento:</label>
          <input
            type="text"
            value={medication}
            onChange={(e) => setMedication(e.target.value)}
            style={{ margin: 10, padding: 8 }}
          />
        </div>
        <div>
          <label>Puffs:</label>
          <input
            type="number"
            value={puffs}
            onChange={(e) => setPuffs(e.target.value)}
            min="1"
            style={{ margin: 10, padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Últimas Inhalaciones:</h3>
      {logs.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              {log.medication_name} - {log.puffs} puffs - {new Date(log.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// EJEMPLO 3: Registrar Síntomas
// ============================================

export function SymptomLogExample() {
  const [level, setLevel] = useState(0)
  const [notes, setNotes] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const { createSymptom, getSymptoms, loading, error } = useAPI()
  const profileId = 1

  useEffect(() => {
    loadSymptoms()
  }, [])

  const loadSymptoms = async () => {
    const result = await getSymptoms(profileId)
    if (result.success) {
      setSymptoms(result.data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await createSymptom({
      profile_id: profileId,
      level: parseInt(level),
      notes,
      triggers: []
    })

    if (result.success) {
      alert('¡Síntoma registrado!')
      setNotes('')
      loadSymptoms()
    }
  }

  const levelLabels = ['Controlado', 'Leve', 'Moderado', 'Grave']

  return (
    <div style={{ padding: 20 }}>
      <h2>Registrar Síntomas</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nivel:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ margin: 10, padding: 8 }}>
            <option value={0}>Controlado</option>
            <option value={1}>Leve</option>
            <option value={2}>Moderado</option>
            <option value={3}>Grave</option>
          </select>
        </div>
        <div>
          <label>Notas:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe cómo te sientes..."
            style={{ margin: 10, padding: 8, width: 300 }}
            rows={3}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Registrar'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Últimos Síntomas:</h3>
      {symptoms.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <ul>
          {symptoms.map(symptom => (
            <li key={symptom.id}>
              <strong>{levelLabels[symptom.level]}</strong> - {symptom.notes} - {new Date(symptom.day).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// EJEMPLO 4: Resumen y Estadísticas
// ============================================

export function SummaryExample() {
  const [summary, setSummary] = useState(null)
  const { getSummary, loading, error } = useAPI()
  const profileId = 1

  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    const result = await getSummary(profileId)
    if (result.success) {
      setSummary(result.data)
    }
  }

  if (loading) return <div>Cargando resumen...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (!summary) return <div>No hay datos disponibles</div>

  return (
    <div style={{ padding: 20 }}>
      <h2>Resumen de la Semana</h2>
      
      <div style={{ background: '#f0f0f0', padding: 20, borderRadius: 10 }}>
        <p><strong>Inhalaciones últimos 7 días:</strong> {summary.total_inhalations_last_7_days}</p>
        <p><strong>Adherencia estimada:</strong> {(summary.adherence_estimate * 100).toFixed(0)}%</p>
        <p><strong>Nivel promedio de síntomas:</strong> {summary.average_symptom_level_last_7_days.toFixed(1)}</p>
        
        <div style={{ marginTop: 20, padding: 15, background: '#e3f2fd', borderRadius: 8 }}>
          <h3>Mensaje de Aira:</h3>
          <p>{summary.message}</p>
        </div>
      </div>

      <button onClick={loadSummary} style={{ marginTop: 20 }}>
        Actualizar
      </button>
    </div>
  )
}

// ============================================
// EJEMPLO 5: Generar PDF
// ============================================

export function PDFGeneratorExample() {
  const { generateReportPDF, loading, error } = useAPI()
  const profileId = 1

  const handleGeneratePDF = async () => {
    const result = await generateReportPDF({
      profile_id: profileId,
      days: 30
    })

    if (result.success) {
      alert('¡PDF generado y descargado!')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Generar Reporte PDF</h2>
      
      <p>Genera un reporte médico con tus datos de los últimos 30 días</p>
      
      <button onClick={handleGeneratePDF} disabled={loading} style={{ padding: 10, fontSize: 16 }}>
        {loading ? 'Generando PDF...' : 'Descargar Reporte'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

// ============================================
// EJEMPLO 6: Health Check
// ============================================

export function HealthCheckExample() {
  const [status, setStatus] = useState(null)
  const { checkHealth, loading } = useAPI()

  useEffect(() => {
    check()
  }, [])

  const check = async () => {
    const result = await checkHealth()
    if (result.success) {
      setStatus('✅ Backend conectado')
    } else {
      setStatus('❌ Backend no disponible')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Estado del Backend</h2>
      {loading ? <p>Verificando...</p> : <p style={{ fontSize: 18 }}>{status}</p>}
      <button onClick={check}>Verificar Conexión</button>
    </div>
  )
}

// ============================================
// COMPONENTE DEMO COMPLETO
// ============================================

export default function APIUsageDemo() {
  const [activeExample, setActiveExample] = useState('login')

  const examples = {
    login: { component: LoginExample, title: 'Login y Registro' },
    inhalation: { component: InhalationLogExample, title: 'Registrar Inhalación' },
    symptom: { component: SymptomLogExample, title: 'Registrar Síntomas' },
    summary: { component: SummaryExample, title: 'Resumen y Estadísticas' },
    pdf: { component: PDFGeneratorExample, title: 'Generar PDF' },
    health: { component: HealthCheckExample, title: 'Health Check' },
  }

  const ActiveComponent = examples[activeExample].component

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>🚀 Ejemplos de Uso de API</h1>
      
      <div style={{ marginBottom: 20 }}>
        <strong>Selecciona un ejemplo:</strong>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          {Object.keys(examples).map(key => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              style={{
                padding: '10px 15px',
                background: activeExample === key ? '#0ea5e9' : '#f0f0f0',
                color: activeExample === key ? 'white' : 'black',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              {examples[key].title}
            </button>
          ))}
        </div>
      </div>

      <div style={{ border: '2px solid #e0e0e0', borderRadius: 12, padding: 20 }}>
        <ActiveComponent />
      </div>

      <div style={{ marginTop: 30, padding: 20, background: '#fef3c7', borderRadius: 10 }}>
        <h3>💡 Nota Importante</h3>
        <p>
          Estos ejemplos muestran cómo usar el hook <code>useAPI</code> en tus componentes.
          El backend debe estar corriendo en <code>http://localhost:8000</code>
        </p>
        <p>
          Para más detalles, consulta <code>API_DOCUMENTATION.md</code>
        </p>
      </div>
    </div>
  )
}

