/**
 * Servicio de API para conectar con el backend de AeroPro
 * 
 * Este archivo centraliza todas las llamadas HTTP al backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene el token de autenticación del localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

/**
 * Guarda el token de autenticación en localStorage
 */
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token)
}

/**
 * Elimina el token de autenticación
 */
const removeAuthToken = () => {
  localStorage.removeItem('authToken')
}

/**
 * Realiza una petición HTTP con manejo de errores
 */
const fetchAPI = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Si la respuesta es 401, el token expiró
    if (response.status === 401) {
      removeAuthToken()
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    // Si no es exitoso, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Error: ${response.statusText}`)
    }

    // Si es 204 (No Content), retornar null
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ============================================
// AUTENTICACIÓN
// ============================================

/**
 * Registra un nuevo usuario
 */
export const registerUser = async (userData) => {
  const response = await fetchAPI('/users/', {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      full_name: userData.name,
    }),
  })
  return response
}

/**
 * Inicia sesión y obtiene un token
 */
export const login = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append('username', email) // FastAPI OAuth2 usa 'username'
  formData.append('password', password)

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Credenciales incorrectas')
  }

  const data = await response.json()
  setAuthToken(data.access_token)
  return data
}

/**
 * Cierra sesión
 */
export const logout = () => {
  removeAuthToken()
}

/**
 * Obtiene los datos del usuario actual
 */
export const getCurrentUser = async () => {
  return await fetchAPI('/users/me')
}

// ============================================
// PERFILES
// ============================================

/**
 * Crea un nuevo perfil
 */
export const createProfile = async (profileData) => {
  return await fetchAPI('/profiles/', {
    method: 'POST',
    body: JSON.stringify(profileData),
  })
}

/**
 * Obtiene todos los perfiles del usuario
 */
export const getProfiles = async () => {
  return await fetchAPI('/profiles/')
}

// ============================================
// INHALACIONES (LOGS)
// ============================================

/**
 * Registra una nueva inhalación
 */
export const createInhalation = async (inhalationData) => {
  return await fetchAPI('/inhalations/', {
    method: 'POST',
    body: JSON.stringify(inhalationData),
  })
}

/**
 * Obtiene todas las inhalaciones de un perfil
 */
export const getInhalations = async (profileId) => {
  return await fetchAPI(`/inhalations/?profile_id=${profileId}`)
}

// ============================================
// SÍNTOMAS
// ============================================

/**
 * Registra un nuevo síntoma
 */
export const createSymptom = async (symptomData) => {
  return await fetchAPI('/symptoms/', {
    method: 'POST',
    body: JSON.stringify(symptomData),
  })
}

/**
 * Obtiene todos los síntomas de un perfil
 */
export const getSymptoms = async (profileId) => {
  return await fetchAPI(`/symptoms/?profile_id=${profileId}`)
}

// ============================================
// TRATAMIENTOS
// ============================================

/**
 * Crea un nuevo plan de tratamiento
 */
export const createTreatment = async (treatmentData) => {
  return await fetchAPI('/treatments/', {
    method: 'POST',
    body: JSON.stringify(treatmentData),
  })
}

/**
 * Obtiene todos los tratamientos de un perfil
 */
export const getTreatments = async (profileId) => {
  return await fetchAPI(`/treatments/?profile_id=${profileId}`)
}

// ============================================
// EVENTOS
// ============================================

/**
 * Crea un nuevo evento
 */
export const createEvent = async (eventData) => {
  return await fetchAPI('/events/', {
    method: 'POST',
    body: JSON.stringify(eventData),
  })
}

/**
 * Obtiene todos los eventos de un perfil
 */
export const getEvents = async (profileId) => {
  return await fetchAPI(`/events/?profile_id=${profileId}`)
}

// ============================================
// RESUMEN Y ESTADÍSTICAS
// ============================================

/**
 * Obtiene el resumen de un perfil
 */
export const getSummary = async (profileId) => {
  return await fetchAPI(`/summary/?profile_id=${profileId}`)
}

// ============================================
// REPORTE MÉDICO PDF
// ============================================

/**
 * Genera un reporte médico en PDF (con autenticación)
 */
export const generateReportPDF = async (reportData) => {
  const token = getAuthToken()
  
  const response = await fetch(`${API_BASE_URL}/report/pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(reportData),
  })

  if (!response.ok) {
    throw new Error('Error al generar el reporte')
  }

  // Obtener el blob del PDF
  const blob = await response.blob()
  return blob
}

/**
 * Genera un reporte médico en PDF (sin autenticación - para uso offline)
 */
export const generateReportPDFPublic = async (reportData) => {
  const response = await fetch(`${API_BASE_URL}/report/pdf/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reportData),
  })

  if (!response.ok) {
    throw new Error('Error al generar el reporte')
  }

  // Obtener el blob del PDF
  const blob = await response.blob()
  return blob
}

/**
 * Descarga un PDF blob como archivo
 */
export const downloadPDF = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Verifica que el backend está funcionando
 */
export const healthCheck = async () => {
  return await fetchAPI('/health')
}

// ============================================
// EXPORTAR FUNCIONES AUXILIARES
// ============================================

export const api = {
  // Auth
  register: registerUser,
  login,
  logout,
  getCurrentUser,
  getAuthToken,
  
  // Profiles
  createProfile,
  getProfiles,
  
  // Inhalations
  createInhalation,
  getInhalations,
  
  // Symptoms
  createSymptom,
  getSymptoms,
  
  // Treatments
  createTreatment,
  getTreatments,
  
  // Events
  createEvent,
  getEvents,
  
  // Summary
  getSummary,
  
  // Reports
  generateReportPDF,
  generateReportPDFPublic,
  downloadPDF,
  
  // Health
  healthCheck,
}

export default api

