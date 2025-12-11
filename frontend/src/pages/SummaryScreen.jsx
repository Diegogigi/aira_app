
import React, { useState, useEffect } from 'react'
import { TrendingUp, Flame, Target, Calendar, Award, Heart } from 'lucide-react'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

export default function SummaryScreen() {
  const { getSummaryMessage, refreshData } = useAira()
  const [airaMessage, setAiraMessage] = useState(null)
  const [stats, setStats] = useState({
    weeklyAdherence: 0,
    currentStreak: 0,
    totalLogs: 0,
    thisWeekLogs: 0,
    lastWeekLogs: 0
  })

  useEffect(() => {
    calculateStats()
    
    // Generar mensaje de Aira
    refreshData()
    const message = getSummaryMessage()
    setAiraMessage(message)
  }, [])

  const calculateStats = () => {
    const logs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
    const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0')
    
    // Calcular logs de esta semana
    const now = Date.now()
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000)
    
    const thisWeekLogs = logs.filter(log => log.timestamp >= oneWeekAgo).length
    const lastWeekLogs = logs.filter(log => 
      log.timestamp >= twoWeeksAgo && log.timestamp < oneWeekAgo
    ).length

    // Calcular adherencia semanal (asumiendo 3 dosis diarias = 21 por semana)
    const expectedWeekly = 21
    const adherence = Math.min(100, Math.round((thisWeekLogs / expectedWeekly) * 100))

    setStats({
      weeklyAdherence: adherence,
      currentStreak,
      totalLogs: logs.length,
      thisWeekLogs,
      lastWeekLogs
    })
  }

  const getMotivationalMessage = () => {
    const { weeklyAdherence, currentStreak } = stats

    if (weeklyAdherence >= 90) {
      return {
        message: "¡Excelente trabajo! Estás siguiendo tu tratamiento de manera constante. Tu médico estará muy contento con tu progreso. 🎉",
        color: "#22c55e",
        icon: <Award size={24} />
      }
    } else if (weeklyAdherence >= 70) {
      return {
        message: "Vas muy bien. Llevas un buen ritmo con tus registros. Sigue así y cada día será más fácil. 💚",
        color: "#0ea5e9",
        icon: <Heart size={24} />
      }
    } else if (weeklyAdherence >= 40) {
      return {
        message: "Has hecho varios registros esta semana, ¡eso es genial! Paso a paso, cada registro cuenta. 👏",
        color: "#f59e0b",
        icon: <Target size={24} />
      }
    } else {
      return {
        message: "Te extrañamos. ¿Quieres retomar desde hoy? Puedes empezar de nuevo sin problema, no es necesario completar días anteriores. 😊",
        color: "#8b5cf6",
        icon: <Calendar size={24} />
      }
    }
  }

  const motivational = getMotivationalMessage()

  return (
    <div>
      {/* Mensaje de Aira interpretando datos */}
      {airaMessage && (
        <AiraMessage 
          message={airaMessage.message}
          type={airaMessage.type}
          showAvatar={true}
          size="medium"
        />
      )}

      {/* Estadísticas principales */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12
      }}>
        {/* Adherencia semanal */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: `conic-gradient(#0ea5e9 ${stats.weeklyAdherence * 3.6}deg, #e5e7eb 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#0ea5e9'
            }}>
              {stats.weeklyAdherence}%
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
            Esta semana
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Dosis registradas
          </div>
        </div>

        {/* Racha actual */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: stats.currentStreak > 0 ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' : '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Flame size={36} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {stats.currentStreak}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {stats.currentStreak === 1 ? 'día de racha' : 'días de racha'}
          </div>
        </div>

        {/* Total de registros */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Calendar size={36} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {stats.totalLogs}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Registros totales
          </div>
        </div>
      </div>

      {/* Comparación semanal */}
      <div className="card">
        <div className="card-title">Comparación semanal</div>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 6
            }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Esta semana</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0ea5e9' }}>
                {stats.thisWeekLogs} registros
              </span>
            </div>
            <div style={{ 
              height: 8, 
              background: '#e5e7eb', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (stats.thisWeekLogs / 21) * 100)}%`,
                background: '#0ea5e9',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 6
            }}>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Semana pasada</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#9ca3af' }}>
                {stats.lastWeekLogs} registros
              </span>
            </div>
            <div style={{ 
              height: 8, 
              background: '#e5e7eb', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (stats.lastWeekLogs / 21) * 100)}%`,
                background: '#9ca3af',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {stats.thisWeekLogs > stats.lastWeekLogs ? (
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            background: '#f0fdf4',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <TrendingUp size={18} color="#22c55e" />
            <span style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>
              ¡Mejoraste respecto a la semana pasada!
            </span>
          </div>
        ) : stats.thisWeekLogs === stats.lastWeekLogs && stats.thisWeekLogs > 0 ? (
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            background: '#eff6ff',
            borderRadius: 8,
            fontSize: 13, 
            color: '#1e40af'
          }}>
            Mantienes el mismo ritmo de la semana pasada
          </div>
        ) : null}
      </div>

      {/* Recordatorio médico de Aira */}
      <AiraMessage 
        message="Estos datos pueden ayudarte en tu próxima consulta. Mientras más constante seas con tus registros, mejor podrá tu médico entender cómo está funcionando tu tratamiento."
        type="educational"
        showAvatar={false}
        size="small"
      />
    </div>
  )
}
