import React from 'react'
import { Wind, Sparkles } from 'lucide-react'

/**
 * Componente AiraMessage - Muestra mensajes contextuales de Aira
 * 
 * @param {string} message - El mensaje que Aira dirá
 * @param {string} type - Tipo de mensaje: 'motivational', 'educational', 'insight', 'warning', 'success'
 * @param {boolean} showAvatar - Si debe mostrar el avatar de Aira (por defecto: true)
 * @param {string} size - Tamaño: 'small', 'medium', 'large' (por defecto: 'medium')
 */
export default function AiraMessage({ 
  message, 
  type = 'motivational', 
  showAvatar = true,
  size = 'medium' 
}) {
  
  const getTypeStyles = () => {
    switch (type) {
      case 'motivational':
        return {
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
          border: '#0ea5e9',
          iconColor: '#0ea5e9'
        }
      case 'educational':
        return {
          bg: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
          border: '#f59e0b',
          iconColor: '#f59e0b'
        }
      case 'insight':
        return {
          bg: 'linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%)',
          border: '#8b5cf6',
          iconColor: '#8b5cf6'
        }
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          border: '#ef4444',
          iconColor: '#ef4444'
        }
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          border: '#22c55e',
          iconColor: '#22c55e'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
          border: '#0ea5e9',
          iconColor: '#0ea5e9'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '12px',
          fontSize: '13px',
          avatarSize: 36,
          iconSize: 16
        }
      case 'large':
        return {
          padding: '20px',
          fontSize: '15px',
          avatarSize: 56,
          iconSize: 24
        }
      default: // medium
        return {
          padding: '16px',
          fontSize: '14px',
          avatarSize: 48,
          iconSize: 20
        }
    }
  }

  const typeStyles = getTypeStyles()
  const sizeStyles = getSizeStyles()

  return (
    <div 
      className="aira-message"
      style={{
        background: typeStyles.bg,
        border: `2px solid ${typeStyles.border}`,
        borderRadius: 16,
        padding: sizeStyles.padding,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 16,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {showAvatar && (
        <div 
          className="aira-avatar"
          style={{
            width: sizeStyles.avatarSize,
            height: sizeStyles.avatarSize,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${typeStyles.iconColor}dd 0%, ${typeStyles.iconColor} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Wind size={sizeStyles.iconSize} color="white" />
        </div>
      )}
      
      <div style={{ flex: 1 }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6
          }}
        >
          <span 
            style={{
              fontSize: sizeStyles.fontSize,
              fontWeight: 700,
              color: typeStyles.iconColor
            }}
          >
            Aira
          </span>
          <Sparkles size={14} color={typeStyles.iconColor} />
        </div>
        
        <p 
          style={{
            fontSize: sizeStyles.fontSize,
            color: '#374151',
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {message}
        </p>
      </div>
    </div>
  )
}

