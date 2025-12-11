
import React, { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Sun, Sunset, Moon, Flame } from 'lucide-react'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

export default function HomeScreen() {
  const { getHomeMessage, refreshData } = useAira()
  const [airaMessage, setAiraMessage] = useState(null)
  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Estado para el plan del día
  const [dailyPlan, setDailyPlan] = useState([])
  const [streak, setStreak] = useState(0)

  // Cargar plan del día desde localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('dailyPlan')
    if (savedPlan) {
      setDailyPlan(JSON.parse(savedPlan))
    } else {
      // Plan inicial de ejemplo
      const defaultPlan = [
        { id: 'morning', time: 'Mañana', medication: 'Salbutamol', puffs: 2, taken: false, icon: 'sun' },
        { id: 'afternoon', time: 'Tarde', medication: 'Budesonida', puffs: 1, taken: false, icon: 'sunset' },
        { id: 'night', time: 'Noche', medication: 'Salbutamol', puffs: 2, taken: false, icon: 'moon' }
      ]
      setDailyPlan(defaultPlan)
      localStorage.setItem('dailyPlan', JSON.stringify(defaultPlan))
    }

    // Cargar racha
    const savedStreak = localStorage.getItem('currentStreak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }

    // Cargar mensaje de Aira
    refreshData()
    const message = getHomeMessage()
    setAiraMessage(message)
  }, [])

  // Marcar dosis como tomada
  const markAsTaken = (id) => {
    const updatedPlan = dailyPlan.map(dose => {
      if (dose.id === id) {
        return { ...dose, taken: true }
      }
      return dose
    })
    setDailyPlan(updatedPlan)
    localStorage.setItem('dailyPlan', JSON.stringify(updatedPlan))

    // Guardar en historial de registros
    const dose = dailyPlan.find(d => d.id === id)
    const logs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
    logs.unshift({
      id: Date.now(),
      medication_name: dose.medication,
      puffs: dose.puffs,
      used_chamber: true,
      created_at: new Date().toLocaleString('es-CL'),
      timestamp: Date.now()
    })
    localStorage.setItem('inhalationLogs', JSON.stringify(logs))

    // Actualizar racha
    checkAndUpdateStreak(updatedPlan)
  }

  const checkAndUpdateStreak = (plan) => {
    const allTaken = plan.every(dose => dose.taken)
    if (allTaken) {
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('currentStreak', newStreak.toString())
    }
  }

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'sun': return <Sun size={20} />
      case 'sunset': return <Sunset size={20} />
      case 'moon': return <Moon size={20} />
      default: return <Sun size={20} />
    }
  }

  const completedToday = dailyPlan.filter(d => d.taken).length
  const totalToday = dailyPlan.length

  return (
    <div>
      {/* Mensaje de Aira */}
      {airaMessage && (
        <AiraMessage 
          message={airaMessage.message}
          type={airaMessage.type}
          showAvatar={true}
          size="medium"
        />
      )}

      {/* Encabezado con fecha y racha */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white' }}>
        <div className="card-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>Hoy</div>
        <div className="card-title" style={{ textTransform: 'capitalize', color: 'white' }}>
          {today}
        </div>
        {streak > 0 && (
          <div style={{ 
            marginTop: 12, 
            padding: '8px 12px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Flame size={18} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              ¡Llevas {streak} {streak === 1 ? 'día' : 'días'} registrando todas tus dosis!
            </span>
          </div>
        )}
      </div>

      {/* Plan del día */}
      <div className="card">
        <div className="card-title">Tu plan de hoy</div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          {completedToday === totalToday 
            ? '¡Completaste todas tus dosis del día! 🎉' 
            : `Has completado ${completedToday} de ${totalToday} dosis`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dailyPlan.map((dose) => (
            <div 
              key={dose.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                background: dose.taken ? '#f0fdf4' : '#f9fafb',
                borderRadius: 12,
                border: dose.taken ? '2px solid #22c55e' : '2px solid #e5e7eb',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  padding: 8, 
                  background: dose.taken ? '#22c55e' : '#0ea5e9', 
                  borderRadius: 8,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getIcon(dose.icon)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                    {dose.time}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {dose.medication} · {dose.puffs} {dose.puffs === 1 ? 'puff' : 'puffs'}
                  </div>
                </div>
              </div>

              {dose.taken ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
                  <CheckCircle2 size={20} />
                  <span>Tomada</span>
                </div>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={() => markAsTaken(dose.id)}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: 13,
                    minWidth: 120
                  }}
                >
                  Marcar tomada
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tip educativo */}
      <AiraMessage 
        message="Mientras más registres tus dosis, mejor podrás mostrarle tu progreso a tu médico en la próxima consulta. ¡Cada registro cuenta!"
        type="educational"
        showAvatar={false}
        size="small"
      />
    </div>
  )
}
