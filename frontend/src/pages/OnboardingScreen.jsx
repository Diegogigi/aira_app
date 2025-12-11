import React, { useState } from 'react'
import { 
  User, Heart, Stethoscope, Pill, Phone, Calendar, 
  MapPin, Users, ChevronRight, ChevronLeft, Check, 
  Home, Activity, Wind, AlertCircle, Clock
} from 'lucide-react'
import AiraMessage from '../components/AiraMessage'
import useAira from '../hooks/useAira'

export default function OnboardingScreen({ userData, onComplete }) {
  const { getOnboardingMessage } = useAira()
  const [step, setStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    // Paso 1: Tipo de usuario
    userType: '',
    
    // Paso 2: Datos personales
    birthDate: '',
    gender: '',
    phone: '',
    address: '',
    
    // Paso 3: Información médica
    diagnosis: '',
    diagnosisDate: '',
    allergies: '',
    otherConditions: '',
    
    // Paso 4: Medicamentos
    medications: [{ name: '', dose: '', frequency: '' }],
    emergencyInhaler: '',
    
    // Paso 5: Contacto de emergencia (solo si es paciente)
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    
    // Paso 6: Preferencias
    notificationsEnabled: true,
    reminderTime: '09:00',
    language: 'es'
  })

  const totalSteps = onboardingData.userType === 'patient' ? 6 : 5

  const handleChange = (field, value) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }))
  }

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...onboardingData.medications]
    newMedications[index][field] = value
    setOnboardingData(prev => ({ ...prev, medications: newMedications }))
  }

  const addMedication = () => {
    setOnboardingData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dose: '', frequency: '' }]
    }))
  }

  const removeMedication = (index) => {
    setOnboardingData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return onboardingData.userType !== ''
      case 2:
        return onboardingData.birthDate && onboardingData.gender && onboardingData.phone
      case 3:
        return onboardingData.diagnosis && onboardingData.diagnosisDate
      case 4:
        return onboardingData.medications[0].name !== ''
      case 5:
        if (onboardingData.userType === 'patient') {
          return onboardingData.emergencyContact.name && onboardingData.emergencyContact.phone
        }
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      if (step === totalSteps) {
        // Guardar datos en localStorage
        const completeData = {
          ...userData,
          ...onboardingData,
          onboardingCompleted: true,
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('airaUser', JSON.stringify(completeData))
        onComplete(completeData)
      } else {
        setStep(step + 1)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderProgressBar = () => (
    <div className="onboarding-progress">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
      <div className="progress-text">
        Paso {step} de {totalSteps}
      </div>
    </div>
  )

  const renderStep = () => {
    const airaMessage = getOnboardingMessage(step)
    
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <AiraMessage 
              message={airaMessage.message}
              type={airaMessage.type}
              size="medium"
            />
            
            <div className="step-icon">
              <Users size={48} />
            </div>
            <h2 className="step-title">¿Quién va a usar esta aplicación?</h2>
            <p className="step-description">
              Esto nos ayudará a personalizar tu experiencia
            </p>
            
            <div className="user-type-options">
              <button
                className={`user-type-card ${onboardingData.userType === 'patient' ? 'selected' : ''}`}
                onClick={() => handleChange('userType', 'patient')}
              >
                <User size={32} />
                <h3>Soy Paciente</h3>
                <p>Voy a registrar mi propio seguimiento respiratorio</p>
              </button>
              
              <button
                className={`user-type-card ${onboardingData.userType === 'caregiver' ? 'selected' : ''}`}
                onClick={() => handleChange('userType', 'caregiver')}
              >
                <Heart size={32} />
                <h3>Soy Cuidador</h3>
                <p>Voy a ayudar a otra persona con su seguimiento</p>
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="onboarding-step">
            <AiraMessage 
              message={airaMessage.message}
              type={airaMessage.type}
              size="small"
            />
            
            <div className="step-icon">
              <User size={48} />
            </div>
            <h2 className="step-title">Información Personal</h2>
            <p className="step-description">
              {onboardingData.userType === 'patient' 
                ? 'Cuéntanos sobre ti' 
                : 'Información de la persona que cuidas'}
            </p>
            
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={18} />
                  <span>Fecha de nacimiento</span>
                </label>
                <input
                  type="date"
                  value={onboardingData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="form-input"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  <span>Género</span>
                </label>
                <select
                  value={onboardingData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecciona...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                  <option value="prefer-not-say">Prefiero no decir</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={18} />
                  <span>Teléfono</span>
                </label>
                <input
                  type="tel"
                  value={onboardingData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="form-input"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} />
                  <span>Dirección (opcional)</span>
                </label>
                <input
                  type="text"
                  value={onboardingData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="form-input"
                  placeholder="Calle, ciudad, región"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="onboarding-step">
            <AiraMessage 
              message={airaMessage.message}
              type={airaMessage.type}
              size="small"
            />
            
            <div className="step-icon">
              <Stethoscope size={48} />
            </div>
            <h2 className="step-title">Información Médica</h2>
            <p className="step-description">
              Información importante sobre la condición respiratoria
            </p>
            
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">
                  <Activity size={18} />
                  <span>Diagnóstico principal</span>
                </label>
                <select
                  value={onboardingData.diagnosis}
                  onChange={(e) => handleChange('diagnosis', e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecciona...</option>
                  <option value="asthma">Asma</option>
                  <option value="copd">EPOC</option>
                  <option value="bronchitis">Bronquitis Crónica</option>
                  <option value="emphysema">Enfisema</option>
                  <option value="other">Otra condición</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={18} />
                  <span>Fecha de diagnóstico</span>
                </label>
                <input
                  type="month"
                  value={onboardingData.diagnosisDate}
                  onChange={(e) => handleChange('diagnosisDate', e.target.value)}
                  className="form-input"
                  max={new Date().toISOString().split('T')[0].slice(0, 7)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <AlertCircle size={18} />
                  <span>Alergias conocidas</span>
                </label>
                <textarea
                  value={onboardingData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                  className="form-input form-textarea"
                  placeholder="Polen, ácaros, medicamentos, etc."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Heart size={18} />
                  <span>Otras condiciones médicas (opcional)</span>
                </label>
                <textarea
                  value={onboardingData.otherConditions}
                  onChange={(e) => handleChange('otherConditions', e.target.value)}
                  className="form-input form-textarea"
                  placeholder="Diabetes, hipertensión, etc."
                  rows="3"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="onboarding-step">
            <AiraMessage 
              message={airaMessage.message}
              type={airaMessage.type}
              size="small"
            />
            
            <div className="step-icon">
              <Pill size={48} />
            </div>
            <h2 className="step-title">Medicamentos</h2>
            <p className="step-description">
              Registra los medicamentos que usas regularmente
            </p>
            
            <div className="form-fields">
              {onboardingData.medications.map((med, index) => (
                <div key={index} className="medication-group">
                  <div className="medication-header">
                    <span className="medication-number">Medicamento {index + 1}</span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-medication"
                        onClick={() => removeMedication(index)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      className="form-input"
                      placeholder="Nombre del medicamento"
                    />
                  </div>
                  
                  <div className="medication-details">
                    <div className="form-group">
                      <input
                        type="text"
                        value={med.dose}
                        onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                        className="form-input"
                        placeholder="Dosis (ej: 2 puffs)"
                      />
                    </div>
                    
                    <div className="form-group">
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Frecuencia</option>
                        <option value="daily">Diario</option>
                        <option value="twice-daily">2 veces al día</option>
                        <option value="three-times">3 veces al día</option>
                        <option value="as-needed">Según necesidad</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-medication"
                onClick={addMedication}
              >
                + Agregar otro medicamento
              </button>

              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label">
                  <Wind size={18} />
                  <span>¿Usas inhalador de emergencia?</span>
                </label>
                <select
                  value={onboardingData.emergencyInhaler}
                  onChange={(e) => handleChange('emergencyInhaler', e.target.value)}
                  className="form-input"
                >
                  <option value="">Selecciona...</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 5:
        if (onboardingData.userType === 'patient') {
          return (
            <div className="onboarding-step">
              <AiraMessage 
                message={airaMessage.message}
                type={airaMessage.type}
                size="small"
              />
              
              <div className="step-icon">
                <Phone size={48} />
              </div>
              <h2 className="step-title">Contacto de Emergencia</h2>
              <p className="step-description">
                Persona a contactar en caso de emergencia
              </p>
              
              <div className="form-fields">
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    <span>Nombre completo</span>
                  </label>
                  <input
                    type="text"
                    value={onboardingData.emergencyContact.name}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    className="form-input"
                    placeholder="María González"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Users size={18} />
                    <span>Relación</span>
                  </label>
                  <select
                    value={onboardingData.emergencyContact.relationship}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Selecciona...</option>
                    <option value="parent">Padre/Madre</option>
                    <option value="spouse">Cónyuge</option>
                    <option value="sibling">Hermano/a</option>
                    <option value="child">Hijo/a</option>
                    <option value="friend">Amigo/a</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={18} />
                    <span>Teléfono</span>
                  </label>
                  <input
                    type="tel"
                    value={onboardingData.emergencyContact.phone}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    className="form-input"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
            </div>
          )
        } else {
          return renderStep6()
        }

      case 6:
        return renderStep6()

      default:
        return null
    }
  }

  const renderStep6 = () => {
    const airaMessage = getOnboardingMessage(6)
    
    return (
      <div className="onboarding-step">
        <AiraMessage 
          message={airaMessage.message}
          type={airaMessage.type}
          size="medium"
        />
        
        <div className="step-icon">
          <Check size={48} />
        </div>
        <h2 className="step-title">¡Casi listo!</h2>
        <p className="step-description">
          Configura tus preferencias de notificaciones
        </p>
      
      <div className="form-fields">
        <div className="form-group-toggle">
          <div className="toggle-label">
            <AlertCircle size={20} />
            <div>
              <div className="toggle-title">Notificaciones de recordatorio</div>
              <div className="toggle-description">Recordatorios para tomar medicamentos</div>
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={onboardingData.notificationsEnabled}
              onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {onboardingData.notificationsEnabled && (
          <div className="form-group">
            <label className="form-label">
              <Clock size={18} />
              <span>Hora preferida para recordatorios</span>
            </label>
            <input
              type="time"
              value={onboardingData.reminderTime}
              onChange={(e) => handleChange('reminderTime', e.target.value)}
              className="form-input"
            />
          </div>
        )}

        <div className="completion-message">
          <div className="completion-icon">
            <Check size={32} />
          </div>
          <h3>Todo está listo</h3>
          <p>
            Hemos configurado tu perfil. Puedes modificar esta información más tarde desde tu perfil.
          </p>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {renderProgressBar()}
        
        <div className="onboarding-content">
          {renderStep()}
        </div>

        <div className="onboarding-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
            >
              <ChevronLeft size={20} />
              Atrás
            </button>
          )}
          
          <button
            type="button"
            className="btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === totalSteps ? 'Comenzar' : 'Continuar'}
            {step === totalSteps ? <Check size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="onboarding-background">
        <div className="onboarding-bg-shape shape-1"></div>
        <div className="onboarding-bg-shape shape-2"></div>
      </div>
    </div>
  )
}

