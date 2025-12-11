
import React, { useState, useEffect } from 'react'
import { AlertCircle, Wind, Droplets, Activity, CheckCircle2, ThermometerSun } from 'lucide-react'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

// Sistema de semáforo para síntomas
const levels = [
  { 
    value: 0, 
    label: 'Bien controlado', 
    color: '#22c55e',
    bgColor: '#f0fdf4',
    description: 'Respiración normal, sin molestias',
    icon: CheckCircle2
  },
  { 
    value: 1, 
    label: 'Leve', 
    color: '#eab308',
    bgColor: '#fefce8',
    description: 'Molestias leves, puedo hacer actividades normales',
    icon: Activity
  },
  { 
    value: 2, 
    label: 'Moderado', 
    color: '#f97316',
    bgColor: '#fff7ed',
    description: 'Molestias que limitan algunas actividades',
    icon: Wind
  },
  { 
    value: 3, 
    label: 'Grave', 
    color: '#ef4444',
    bgColor: '#fef2f2',
    description: 'Dificultad importante, necesito atención',
    icon: AlertCircle
  },
]

// Triggers comunes
const commonTriggers = [
  { id: 'exercise', label: 'Ejercicio', icon: Activity },
  { id: 'cold', label: 'Frío', icon: ThermometerSun },
  { id: 'humidity', label: 'Humedad', icon: Droplets },
  { id: 'smoke', label: 'Humo', icon: Wind },
]

export default function SymptomsScreen() {
  const { getSymptomsMessage, refreshData } = useAira()
  const [selected, setSelected] = useState(0)
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState([])
  const [selectedTriggers, setSelectedTriggers] = useState([])
  const [airaMessage, setAiraMessage] = useState(null)

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('symptomEntries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
    
    // Generar mensaje de Aira
    refreshData()
    const message = getSymptomsMessage()
    setAiraMessage(message)
  }, [])

  const toggleTrigger = (triggerId) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(t => t !== triggerId)
        : [...prev, triggerId]
    )
  }

  const save = () => {
    const newEntry = {
      id: Date.now(),
      timestamp: Date.now(),
      day: new Date().toLocaleString('es-CL'),
      level: selected,
      triggers: selectedTriggers,
      notes,
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('symptomEntries', JSON.stringify(updated))
    
    // Actualizar mensaje de Aira
    refreshData()
    const message = getSymptomsMessage()
    setAiraMessage(message)
    
    // Reset
    setNotes('')
    setSelectedTriggers([])
  }

  const getLevelInfo = (value) => levels.find(l => l.value === value)

  return (
    <div>
      {/* Mensaje de Aira con análisis de patrones */}
      {airaMessage && (
        <AiraMessage 
          message={airaMessage.message}
          type={airaMessage.type}
          showAvatar={true}
          size="medium"
        />
      )}

      {/* Semáforo de síntomas */}
      <div className="card">
        <div className="card-title">¿Cómo está tu respiración hoy?</div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          Selecciona el nivel que mejor describe cómo te sientes ahora
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {levels.map((lvl) => {
            const Icon = lvl.icon
            const isSelected = selected === lvl.value
            return (
              <button
                key={lvl.value}
                onClick={() => setSelected(lvl.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  border: isSelected ? `3px solid ${lvl.color}` : '2px solid #e5e7eb',
                  borderRadius: 12,
                  background: isSelected ? lvl.bgColor : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: lvl.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: isSelected ? lvl.color : '#111827',
                    marginBottom: 4
                  }}>
                    {lvl.label}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {lvl.description}
                  </div>
                </div>
                {isSelected && (
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: lvl.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={16} color="white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Alerta si es grave */}
        {selected === 3 && (
          <div style={{
            marginTop: 16,
            padding: 16,
            background: '#fef2f2',
            border: '2px solid #ef4444',
            borderRadius: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <AlertCircle size={24} color="#ef4444" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#991b1b', marginBottom: 4 }}>
                  Atención
                </div>
                <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>
                  Si tienes dificultad importante para respirar, considera consultar a tu médico o acudir a urgencias.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Triggers comunes */}
      <div className="card">
        <div className="card-title">¿Qué pudo desencadenar los síntomas?</div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          Selecciona uno o más factores (opcional)
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {commonTriggers.map((trigger) => {
            const Icon = trigger.icon
            const isSelected = selectedTriggers.includes(trigger.id)
            return (
              <button
                key={trigger.id}
                onClick={() => toggleTrigger(trigger.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: 16,
                  border: isSelected ? '2px solid #0ea5e9' : '2px solid #e5e7eb',
                  borderRadius: 12,
                  background: isSelected ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isSelected ? '#0ea5e9' : '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={isSelected ? 'white' : '#6b7280'} />
                </div>
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#0ea5e9' : '#374151'
                }}>
                  {trigger.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Notas adicionales */}
      <div className="card">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notas adicionales (opcional)</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: tos nocturna, silbidos al respirar, dolor en el pecho..."
            rows={3}
          />
        </div>

        <button className="btn-primary" onClick={save}>
          Guardar registro de síntomas
        </button>
      </div>

      {/* Historial con semáforo */}
      <div className="card">
        <div className="card-title">Historial reciente</div>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Activity size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Aún no has registrado síntomas
            </p>
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.slice(0, 10).map((entry) => {
            const lvl = getLevelInfo(entry.level)
            const Icon = lvl.icon
            return (
              <div 
                key={entry.id}
                style={{
                  padding: 14,
                  background: lvl.bgColor,
                  borderLeft: `4px solid ${lvl.color}`,
                  borderRadius: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: lvl.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                      {lvl.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {entry.day}
                    </div>
                  </div>
                </div>
                
                {entry.triggers && entry.triggers.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 6, 
                    flexWrap: 'wrap',
                    marginTop: 8
                  }}>
                    {entry.triggers.map(tid => {
                      const trigger = commonTriggers.find(t => t.id === tid)
                      return trigger ? (
                        <span 
                          key={tid}
                          style={{
                            fontSize: 11,
                            padding: '4px 8px',
                            background: 'white',
                            borderRadius: 6,
                            color: '#6b7280',
                            fontWeight: 500
                          }}
                        >
                          {trigger.label}
                        </span>
                      ) : null
                    })}
                  </div>
                )}
                
                {entry.notes && (
                  <div style={{ 
                    marginTop: 8,
                    fontSize: 12,
                    color: '#4b5563',
                    fontStyle: 'italic'
                  }}>
                    "{entry.notes}"
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
