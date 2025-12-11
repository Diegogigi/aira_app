import React, { useState } from 'react'
import { Wind, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Simular login exitoso
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        isNewUser: !isLogin
      }
      
      onLoginSuccess(userData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo y Header */}
        <div className="login-header">
          <div className="login-logo">
            <img 
              src="/logo_aira.png" 
              alt="Aira Logo" 
              style={{ 
                width: '180px', 
                height: 'auto',
                marginBottom: '16px'
              }} 
            />
          </div>
          <p className="login-subtitle">
            {isLogin 
              ? 'Ingresa a tu cuenta' 
              : 'Crea tu cuenta y comienza tu seguimiento respiratorio'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={18} />
                <span>Nombre completo</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Juan Pérez"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={18} />
              <span>Correo electrónico</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={18} />
              <span>Contraseña</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={18} />
                <span>Confirmar contraseña</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          {isLogin && (
            <div className="form-options">
              <button type="button" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Toggle entre Login y Registro */}
        <div className="login-footer">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            {' '}
            <button
              type="button"
              className="toggle-mode"
              onClick={() => {
                setIsLogin(!isLogin)
                setErrors({})
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
              }}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="login-background">
        <div className="login-bg-circle circle-1"></div>
        <div className="login-bg-circle circle-2"></div>
        <div className="login-bg-circle circle-3"></div>
      </div>
    </div>
  )
}

