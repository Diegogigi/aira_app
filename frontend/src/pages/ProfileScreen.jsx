
import React, { useState, useEffect } from 'react'
import { User, Heart, Settings, HelpCircle, Camera, Save, LogOut, Mail, Phone, Calendar, Pill, AlertCircle, Wind, Sparkles } from 'lucide-react'
import AiraMessage from '../components/AiraMessage'

export default function ProfileScreen({ user, onLogout }) {
  const [saved, setSaved] = useState(false)

  const userType = user?.userType === 'patient' ? 'Paciente' : 'Cuidador'
  const diagnosisLabels = {
    'asthma': 'Asma',
    'copd': 'EPOC',
    'bronchitis': 'Bronquitis Crónica',
    'emphysema': 'Enfisema',
    'other': 'Otra condición'
  }

  const genderLabels = {
    'male': 'Masculino',
    'female': 'Femenino',
    'other': 'Otro',
    'prefer-not-say': 'Prefiero no decir'
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      onLogout()
    }
  }

  return (
    <div>
      {/* Encabezado de Perfil */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <User size={36} strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>
              {user?.name || 'Usuario'}
            </div>
            <div style={{ fontSize: 14, opacity: 0.95, fontWeight: 500 }}>
              {userType}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 13, opacity: 0.9, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div className="card">
        <div className="card-title">Información Personal</div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 8 }}>
            <Phone size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Teléfono</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{user?.phone || 'No especificado'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'start', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 8 }}>
            <Calendar size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Edad</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                {user?.birthDate ? `${calculateAge(user.birthDate)} años` : 'No especificado'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'start', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 8 }}>
            <User size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Género</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                {user?.gender ? genderLabels[user.gender] : 'No especificado'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información Médica */}
      <div className="card">
        <div className="card-title">Información Médica</div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8, border: '1px solid #fde047' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Heart size={18} style={{ color: '#ca8a04' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#713f12' }}>Diagnóstico</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#854d0e' }}>
              {user?.diagnosis ? diagnosisLabels[user.diagnosis] || user.diagnosis : 'No especificado'}
            </div>
            {user?.diagnosisDate && (
              <div style={{ fontSize: 13, color: '#a16207', marginTop: 6 }}>
                Desde {new Date(user.diagnosisDate + '-01').toLocaleDateString('es', { month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {user?.allergies && (
            <div style={{ padding: 14, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertCircle size={16} style={{ color: '#dc2626' }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b' }}>Alergias</div>
              </div>
              <div style={{ fontSize: 14, color: '#7f1d1d', lineHeight: 1.5 }}>
                {user.allergies}
              </div>
            </div>
          )}

          {user?.otherConditions && (
            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                Otras condiciones
              </div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                {user.otherConditions}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medicamentos */}
      {user?.medications && user.medications.length > 0 && (
        <div className="card">
          <div className="card-title">Medicamentos</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {user.medications.map((med, index) => (
              <div key={index} style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                  <Pill size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#166534', marginBottom: 6 }}>
                      {med.name}
                    </div>
                    {med.dose && (
                      <div style={{ fontSize: 14, color: '#15803d', marginBottom: 4 }}>
                        Dosis: {med.dose}
                      </div>
                    )}
                    {med.frequency && (
                      <div style={{ fontSize: 13, color: '#16a34a' }}>
                        Frecuencia: {med.frequency}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacto de Emergencia */}
      {user?.emergencyContact && user.emergencyContact.name && (
        <div className="card">
          <div className="card-title">Contacto de Emergencia</div>
          <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>
              {user.emergencyContact.name}
            </div>
            {user.emergencyContact.relationship && (
              <div style={{ fontSize: 14, color: '#1e3a8a', marginBottom: 6 }}>
                Relación: {user.emergencyContact.relationship}
              </div>
            )}
            {user.emergencyContact.phone && (
              <div style={{ fontSize: 14, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={16} />
                {user.emergencyContact.phone}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensaje personalizado de Aira */}
      <AiraMessage 
        message={`Hola ${user?.name?.split(' ')[0] || 'usuario'}! Estoy aquí para acompañarte en cada paso de tu tratamiento. Puedes encontrarme en todas las secciones de la app.`}
        type="motivational"
        showAvatar={true}
        size="medium"
      />

      {/* Info sobre la app y Aira */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Wind size={20} style={{ color: '#0ea5e9' }} />
          <div className="card-title" style={{ marginBottom: 0 }}>Sobre Aira</div>
          <Sparkles size={16} style={{ color: '#0ea5e9' }} />
        </div>
        
        <div style={{ padding: 16, background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0369a1', marginBottom: 8 }}>
            🌬️ Tu Copiloto Respiratorio
          </div>
          <p style={{ fontSize: 14, color: '#075985', lineHeight: 1.6, marginBottom: 0 }}>
            Aira analiza tus registros, identifica patrones y te acompaña con mensajes personalizados. 
            Encuentra insights sobre tu adherencia y síntomas para compartir con tu médico.
          </p>
        </div>

        <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>
          <strong style={{ color: '#475569' }}>¿Qué hace Aira?</strong>
        </div>
        <ul style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
          <li>Analiza tu adherencia al tratamiento</li>
          <li>Detecta patrones en tus síntomas</li>
          <li>Te motiva a mantener tu constancia</li>
          <li>Identifica posibles gatillantes (triggers)</li>
          <li>Prepara datos útiles para tu médico</li>
        </ul>

        <div style={{ padding: 14, background: '#fef3c7', borderRadius: 10, marginTop: 12 }}>
          <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6, marginBottom: 0 }}>
            <strong style={{ color: '#92400e' }}>Importante:</strong> Aira no diagnostica ni reemplaza la consulta médica. 
            Es una herramienta de apoyo para tu seguimiento respiratorio.
          </p>
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Cuenta creada el {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es') : 'N/A'}
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
            Tus datos se guardan localmente en tu dispositivo de forma segura
          </div>
        </div>
      </div>

      {/* Botón Cerrar Sesión */}
      <button 
        className="btn-secondary" 
        onClick={handleLogout}
        style={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '16px 20px',
          background: '#fef2f2',
          border: '1.5px solid #fecaca',
          color: '#dc2626',
          fontWeight: 700,
          fontSize: '15px'
        }}
      >
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </div>
  )
}
