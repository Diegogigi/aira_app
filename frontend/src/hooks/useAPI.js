/**
 * Hook personalizado para manejar llamadas a la API
 * 
 * Este hook proporciona una interfaz fácil de usar para todos los endpoints
 * con manejo de estado de carga y errores.
 */

import { useState } from 'react'
import api from '../services/api'

export default function useAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Ejecuta una función de API con manejo de estado
   */
  const execute = async (apiFunction, ...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction(...args)
      setLoading(false)
      return { success: true, data: result }
    } catch (err) {
      setError(err.message || 'Error desconocido')
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  // ============================================
  // AUTENTICACIÓN
  // ============================================

  const register = async (userData) => {
    return await execute(api.register, userData)
  }

  const login = async (email, password) => {
    return await execute(api.login, email, password)
  }

  const getCurrentUser = async () => {
    return await execute(api.getCurrentUser)
  }

  // ============================================
  // PERFILES
  // ============================================

  const createProfile = async (profileData) => {
    return await execute(api.createProfile, profileData)
  }

  const getProfiles = async () => {
    return await execute(api.getProfiles)
  }

  // ============================================
  // INHALACIONES
  // ============================================

  const createInhalation = async (inhalationData) => {
    return await execute(api.createInhalation, inhalationData)
  }

  const getInhalations = async (profileId) => {
    return await execute(api.getInhalations, profileId)
  }

  // ============================================
  // SÍNTOMAS
  // ============================================

  const createSymptom = async (symptomData) => {
    return await execute(api.createSymptom, symptomData)
  }

  const getSymptoms = async (profileId) => {
    return await execute(api.getSymptoms, profileId)
  }

  // ============================================
  // TRATAMIENTOS
  // ============================================

  const createTreatment = async (treatmentData) => {
    return await execute(api.createTreatment, treatmentData)
  }

  const getTreatments = async (profileId) => {
    return await execute(api.getTreatments, profileId)
  }

  // ============================================
  // EVENTOS
  // ============================================

  const createEvent = async (eventData) => {
    return await execute(api.createEvent, eventData)
  }

  const getEvents = async (profileId) => {
    return await execute(api.getEvents, profileId)
  }

  // ============================================
  // RESUMEN
  // ============================================

  const getSummary = async (profileId) => {
    return await execute(api.getSummary, profileId)
  }

  // ============================================
  // REPORTES
  // ============================================

  const generateReportPDF = async (reportData) => {
    setLoading(true)
    setError(null)
    
    try {
      const blob = await api.generateReportPDF(reportData)
      const filename = `reporte_aeropro_${new Date().toISOString().split('T')[0]}.pdf`
      api.downloadPDF(blob, filename)
      setLoading(false)
      return { success: true }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const generateReportPDFPublic = async (reportData) => {
    setLoading(true)
    setError(null)
    
    try {
      const blob = await api.generateReportPDFPublic(reportData)
      const filename = `reporte_aeropro_${new Date().toISOString().split('T')[0]}.pdf`
      api.downloadPDF(blob, filename)
      setLoading(false)
      return { success: true }
    } catch (err) {
      setError(err.message)
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  // ============================================
  // HEALTH CHECK
  // ============================================

  const checkHealth = async () => {
    return await execute(api.healthCheck)
  }

  return {
    // Estado
    loading,
    error,
    
    // Autenticación
    register,
    login,
    logout: api.logout,
    getCurrentUser,
    
    // Perfiles
    createProfile,
    getProfiles,
    
    // Inhalaciones
    createInhalation,
    getInhalations,
    
    // Síntomas
    createSymptom,
    getSymptoms,
    
    // Tratamientos
    createTreatment,
    getTreatments,
    
    // Eventos
    createEvent,
    getEvents,
    
    // Resumen
    getSummary,
    
    // Reportes
    generateReportPDF,
    generateReportPDFPublic,
    
    // Health
    checkHealth,
    
    // Utilidades
    clearError: () => setError(null),
  }
}

