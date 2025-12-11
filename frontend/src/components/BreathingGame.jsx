
import React, { useState, useEffect } from 'react'
import { Wind, Star, Trophy, Play, Pause } from 'lucide-react'

export default function BreathingGame() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [timer, setTimer] = useState(4)
  const [showReward, setShowReward] = useState(false)

  // Ciclo de respiración: Inhala (4s) -> Aguanta (4s) -> Exhala (6s)
  const breathingCycle = {
    1: { inhale: 3, hold: 2, exhale: 4 },
    2: { inhale: 4, hold: 3, exhale: 5 },
    3: { inhale: 4, hold: 4, exhale: 6 },
  }

  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Cambiar de fase
            if (phase === 'inhale') {
              setPhase('hold')
              return breathingCycle[level].hold
            } else if (phase === 'hold') {
              setPhase('exhale')
              return breathingCycle[level].exhale
            } else {
              // Completó un ciclo
              setPhase('inhale')
              setScore(prev => prev + 10)
              
              // Subir de nivel cada 3 ciclos
              if ((score + 10) % 30 === 0 && level < 3) {
                setLevel(prev => prev + 1)
                setShowReward(true)
                setTimeout(() => setShowReward(false), 2000)
              }
              
              return breathingCycle[level].inhale
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, phase, level, score])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setTimer(breathingCycle[level].inhale)
      setPhase('inhale')
    }
  }

  const reset = () => {
    setIsPlaying(false)
    setPhase('inhale')
    setScore(0)
    setLevel(1)
    setTimer(breathingCycle[1].inhale)
  }

  const getPhaseInfo = () => {
    switch(phase) {
      case 'inhale':
        return { 
          text: 'Inhala por la nariz', 
          color: '#0ea5e9',
          emoji: '👃',
          scale: 1.5
        }
      case 'hold':
        return { 
          text: 'Aguanta la respiración', 
          color: '#8b5cf6',
          emoji: '⏸️',
          scale: 1.3
        }
      case 'exhale':
        return { 
          text: 'Exhala por la boca', 
          color: '#22c55e',
          emoji: '😮',
          scale: 0.7
        }
      default:
        return { text: '', color: '#6b7280', emoji: '', scale: 1 }
    }
  }

  const phaseInfo = getPhaseInfo()

  return (
    <div>
      {/* Información del juego */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        color: 'white',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Nivel</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{level}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Puntos</div>
            <div style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={20} fill="white" />
              {score}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>Ciclos</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.floor(score / 10)}</div>
          </div>
        </div>
      </div>

      {/* Círculo de respiración animado */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: 16,
        marginBottom: 16
      }}>
        {/* Círculo animado */}
        <div style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: phaseInfo.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${isPlaying ? phaseInfo.scale : 1})`,
          transition: 'all 1s ease-in-out',
          boxShadow: `0 0 40px ${phaseInfo.color}`,
          marginBottom: 20
        }}>
          <div style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {phaseInfo.emoji}
            </div>
            <div style={{ 
              fontSize: 36, 
              fontWeight: 700, 
              color: phaseInfo.color 
            }}>
              {timer}
            </div>
          </div>
        </div>

        {/* Texto de instrucción */}
        <div style={{
          fontSize: 18,
          fontWeight: 600,
          color: phaseInfo.color,
          textAlign: 'center'
        }}>
          {phaseInfo.text}
        </div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={togglePlay}
          style={{
            flex: 1,
            padding: 16,
            background: isPlaying ? '#f59e0b' : '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease'
          }}
        >
          {isPlaying ? (
            <>
              <Pause size={20} />
              Pausar
            </>
          ) : (
            <>
              <Play size={20} />
              Comenzar
            </>
          )}
        </button>

        <button
          onClick={reset}
          style={{
            padding: 16,
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: 100,
            transition: 'all 0.2s ease'
          }}
        >
          Reiniciar
        </button>
      </div>

      {/* Recompensa al subir de nivel */}
      {showReward && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: 32,
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Trophy size={64} color="#f59e0b" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            ¡Nivel {level}!
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            ¡Sigue respirando!
          </div>
        </div>
      )}

      {/* Información del juego */}
      <div style={{
        marginTop: 16,
        padding: 16,
        background: '#fef3c7',
        borderRadius: 12,
        borderLeft: '4px solid #f59e0b'
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>
          <Wind size={18} style={{ display: 'inline', marginRight: 6 }} />
          Ejercicio de respiración
        </div>
        <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6 }}>
          Este juego te ayuda a practicar respiración controlada. Sigue las instrucciones y relájate. 
          Cada ciclo completo suma 10 puntos. ¡Intenta llegar al nivel 3!
        </div>
      </div>
    </div>
  )
}





