
import React, { useState } from 'react'
import { QrCode, Wind, FileText, ChevronRight, Gamepad2 } from 'lucide-react'
import QRScanner from '../components/QRScanner'
import BreathingGame from '../components/BreathingGame'
import MedicalReport from '../components/MedicalReport'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

export default function ExtrasScreen() {
  const { getExtrasMessage } = useAira()
  const [activeSection, setActiveSection] = useState(null)

  const sections = [
    {
      id: 'qr',
      title: 'Activar Aerocámara',
      description: 'Escanea el código QR de tu dispositivo',
      icon: QrCode,
      color: '#0ea5e9',
      component: <QRScanner onScanSuccess={(data) => console.log('Escaneado:', data)} />
    },
    {
      id: 'game',
      title: 'Ejercicio Respiratorio',
      description: 'Practica respiración con un juego interactivo',
      icon: Gamepad2,
      color: '#8b5cf6',
      component: <BreathingGame />
    },
    {
      id: 'report',
      title: 'Reporte para Médico',
      description: 'Genera un PDF con tu progreso',
      icon: FileText,
      color: '#22c55e',
      component: <MedicalReport />
    }
  ]

  if (activeSection) {
    const section = sections.find(s => s.id === activeSection)
    const airaMsg = getExtrasMessage(activeSection)
    
    return (
      <div>
        <button
          onClick={() => setActiveSection(null)}
          style={{
            padding: '12px 16px',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#6b7280'
          }}
        >
          ← Volver a extras
        </button>

        {/* Mensaje de Aira para la sección */}
        <AiraMessage 
          message={airaMsg.message}
          type={airaMsg.type}
          showAvatar={true}
          size="medium"
        />

        <div className="card" style={{ borderTop: `4px solid ${section.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: section.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <section.icon size={24} color="white" />
            </div>
            <div>
              <div className="card-title" style={{ marginBottom: 4 }}>
                {section.title}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {section.description}
              </div>
            </div>
          </div>
        </div>

        {section.component}
      </div>
    )
  }

  return (
    <div>
      {/* Mensaje introductorio de Aira */}
      <AiraMessage 
        message="Aquí encontrarás herramientas especiales: activa tu aerocámara, practica ejercicios de respiración o genera un reporte para tu médico."
        type="motivational"
        showAvatar={true}
        size="medium"
      />

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="card-title" style={{ color: 'white', marginBottom: 8 }}>
          Funciones Extras
        </div>
        <p style={{ fontSize: 14, opacity: 0.9 }}>
          Descubre herramientas adicionales para mejorar tu experiencia con Aira
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20,
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = section.color
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${section.color}dd 0%, ${section.color} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={28} color="white" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                  {section.title}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  {section.description}
                </div>
              </div>

              <ChevronRight size={24} color="#9ca3af" />
            </button>
          )
        })}
      </div>

      {/* Tip de Aira */}
      <AiraMessage 
        message="El ejercicio respiratorio es especialmente útil en momentos de estrés o antes de dormir. ¡Pruébalo!"
        type="educational"
        showAvatar={false}
        size="small"
      />
    </div>
  )
}



