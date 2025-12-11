
import React, { useState, useEffect } from 'react'
import { Plus, CheckCircle2, Clock } from 'lucide-react'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

export default function LogScreen() {
  const { getLogMessage } = useAira()
  const [logs, setLogs] = useState([])
  const [showDetailedForm, setShowDetailedForm] = useState(false)
  const [lastLogMessage, setLastLogMessage] = useState(null)
  const [form, setForm] = useState({
    medication_name: '',
    puffs: 1,
    used_chamber: true,
    notes: ''
  })

  // Medicamentos frecuentes - quick log
  const quickMedications = [
    { name: 'Salbutamol', puffs: 2, color: '#0ea5e9' },
    { name: 'Budesonida', puffs: 1, color: '#8b5cf6' },
    { name: 'Bromuro de Ipratropio', puffs: 2, color: '#06b6d4' }
  ]

  // Cargar logs desde localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('inhalationLogs')
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Quick log - un solo tap
  const quickLog = (medication) => {
    const newLog = {
      id: Date.now(),
      medication_name: medication.name,
      puffs: medication.puffs,
      used_chamber: true,
      notes: '',
      created_at: new Date().toLocaleString('es-CL'),
      timestamp: Date.now()
    }
    const updatedLogs = [newLog, ...logs]
    setLogs(updatedLogs)
    localStorage.setItem('inhalationLogs', JSON.stringify(updatedLogs))
    
    // Generar mensaje de Aira
    const airaMsg = getLogMessage(medication.name, medication.puffs)
    setLastLogMessage(airaMsg)
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setLastLogMessage(null), 5000)
  }

  // Log detallado
  const addDetailedLog = () => {
    if (!form.medication_name.trim()) {
      alert('Por favor ingresa el nombre del medicamento')
      return
    }

    const newLog = {
      ...form,
      id: Date.now(),
      created_at: new Date().toLocaleString('es-CL'),
      timestamp: Date.now()
    }
    const updatedLogs = [newLog, ...logs]
    setLogs(updatedLogs)
    localStorage.setItem('inhalationLogs', JSON.stringify(updatedLogs))
    
    // Generar mensaje de Aira
    const airaMsg = getLogMessage(form.medication_name, form.puffs)
    setLastLogMessage(airaMsg)
    
    // Resetear formulario
    setForm({
      medication_name: '',
      puffs: 1,
      used_chamber: true,
      notes: ''
    })
    setShowDetailedForm(false)
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => setLastLogMessage(null), 5000)
  }

  return (
    <div>
      {/* Mensaje de Aira tras registrar */}
      {lastLogMessage && (
        <AiraMessage 
          message={lastLogMessage.message}
          type={lastLogMessage.type}
          showAvatar={true}
          size="medium"
        />
      )}

      {/* Mensaje introductorio de Aira */}
      {logs.length === 0 && (
        <AiraMessage 
          message="¡Hola! Cada vez que registres una inhalación, te daré feedback. Así podrás entender mejor tu tratamiento."
          type="educational"
          showAvatar={true}
          size="medium"
        />
      )}

      {/* Quick Log con chips */}
      <div className="card">
        <div className="card-title">Registro rápido</div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          Toca un medicamento para registrar tu inhalación al instante
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {quickMedications.map((med, index) => (
            <button
              key={index}
              onClick={() => quickLog(med)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'white',
                border: `2px solid ${med.color}`,
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 14,
                fontWeight: 500
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = med.color
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.color = '#111827'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: med.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700
                }}>
                  {med.puffs}
                </div>
                <span>{med.name}</span>
              </div>
              <Plus size={20} />
            </button>
          ))}
        </div>

        <button 
          className="btn-secondary"
          onClick={() => setShowDetailedForm(!showDetailedForm)}
          style={{ marginTop: 16, width: '100%' }}
        >
          {showDetailedForm ? 'Ocultar formulario completo' : 'Agregar otro medicamento'}
        </button>
      </div>

      {/* Formulario detallado (opcional) */}
      {showDetailedForm && (
        <div className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <div className="card-title">Registro detallado</div>

          <div className="form-group">
            <label className="form-label">Medicamento</label>
            <input
              className="form-input"
              name="medication_name"
              value={form.medication_name}
              onChange={handleChange}
              placeholder="Copia aquí lo que dice tu receta"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Número de puffs</label>
            <input
              className="form-input"
              type="number"
              name="puffs"
              value={form.puffs}
              onChange={handleChange}
              min={1}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="used_chamber"
              type="checkbox"
              name="used_chamber"
              checked={form.used_chamber}
              onChange={handleChange}
            />
            <label htmlFor="used_chamber" className="form-label" style={{ marginBottom: 0 }}>
              Usé mi aerocámara Aira
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Notas (opcional)</label>
            <textarea
              className="form-input"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Ej: Me sentí mejor después..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button className="btn-primary" onClick={addDetailedLog}>
            Guardar registro completo
          </button>
        </div>
      )}

      {/* Historial */}
      <div className="card">
        <div className="card-title">Historial de inhalaciones</div>
        {logs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Clock size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Aún no has registrado inhalaciones.
            </p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              Usa los botones de arriba para empezar
            </p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {logs.map((log) => (
            <div 
              key={log.id} 
              style={{ 
                padding: 14,
                background: '#f9fafb',
                borderRadius: 10,
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 6
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                  {log.medication_name || 'Sin nombre'}
                </div>
                <CheckCircle2 size={16} color="#22c55e" />
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                {log.puffs} {log.puffs === 1 ? 'puff' : 'puffs'} · 
                {log.used_chamber ? ' Con Aira' : ' Sin Aira'} · 
                {log.created_at}
              </div>
              {log.notes && (
                <div style={{ 
                  marginTop: 8, 
                  fontSize: 12, 
                  color: '#4b5563',
                  fontStyle: 'italic',
                  padding: '6px 10px',
                  background: 'white',
                  borderRadius: 6
                }}>
                  "{log.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
