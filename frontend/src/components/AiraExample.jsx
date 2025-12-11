/**
 * ARCHIVO DE EJEMPLO - No se usa en producción
 * 
 * Este archivo muestra cómo usar Aira en nuevos componentes
 */

import React from 'react'
import AiraMessage from './AiraMessage'
import useAira from '../hooks/useAira'

export default function AiraExample() {
  const { getHomeMessage, getLogMessage, refreshData } = useAira()

  // Ejemplo 1: Mensaje simple
  const SimpleExample = () => (
    <AiraMessage 
      message="¡Hola! Este es un mensaje simple de Aira."
      type="motivational"
      showAvatar={true}
      size="medium"
    />
  )

  // Ejemplo 2: Mensaje sin avatar (más compacto)
  const CompactExample = () => (
    <AiraMessage 
      message="Tip: Registra tus dosis justo después de tomarlas para no olvidar."
      type="educational"
      showAvatar={false}
      size="small"
    />
  )

  // Ejemplo 3: Mensaje de advertencia
  const WarningExample = () => (
    <AiraMessage 
      message="Si tienes dificultad importante para respirar, consulta a tu médico."
      type="warning"
      showAvatar={true}
      size="medium"
    />
  )

  // Ejemplo 4: Mensaje de éxito
  const SuccessExample = () => (
    <AiraMessage 
      message="¡Excelente! Completaste todas tus dosis de hoy."
      type="success"
      showAvatar={true}
      size="large"
    />
  )

  // Ejemplo 5: Mensaje de insight (análisis)
  const InsightExample = () => (
    <AiraMessage 
      message="He notado que usas más tu inhalador por las mañanas. Esto puede ser útil para tu médico."
      type="insight"
      showAvatar={true}
      size="medium"
    />
  )

  // Ejemplo 6: Usando el hook useAira
  const DynamicExample = () => {
    // Obtener mensaje basado en datos reales
    const homeMessage = getHomeMessage()
    
    return homeMessage ? (
      <AiraMessage 
        message={homeMessage.message}
        type={homeMessage.type}
        showAvatar={true}
        size="medium"
      />
    ) : null
  }

  // Ejemplo 7: Mensaje tras una acción
  const ActionExample = () => {
    const handleAction = () => {
      // Actualizar datos de Aira
      refreshData()
      
      // Obtener mensaje específico
      const message = getLogMessage('Salbutamol', 2)
      
      // Mostrar mensaje (puedes guardarlo en estado)
      console.log(message)
    }

    return (
      <button onClick={handleAction}>
        Registrar inhalación
      </button>
    )
  }

  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2>Ejemplos de Uso de Aira</h2>
      
      <div>
        <h3>1. Mensaje Simple</h3>
        <SimpleExample />
      </div>

      <div>
        <h3>2. Mensaje Compacto (sin avatar)</h3>
        <CompactExample />
      </div>

      <div>
        <h3>3. Mensaje de Advertencia</h3>
        <WarningExample />
      </div>

      <div>
        <h3>4. Mensaje de Éxito</h3>
        <SuccessExample />
      </div>

      <div>
        <h3>5. Mensaje de Insight</h3>
        <InsightExample />
      </div>

      <div>
        <h3>6. Mensaje Dinámico (usando hook)</h3>
        <DynamicExample />
      </div>

      <div>
        <h3>Tipos de mensajes disponibles:</h3>
        <ul>
          <li><strong>motivational</strong> - Azul, para motivar</li>
          <li><strong>educational</strong> - Amarillo, para educar</li>
          <li><strong>insight</strong> - Morado, para análisis</li>
          <li><strong>warning</strong> - Rojo, para advertencias</li>
          <li><strong>success</strong> - Verde, para éxitos</li>
        </ul>
      </div>

      <div>
        <h3>Tamaños disponibles:</h3>
        <ul>
          <li><strong>small</strong> - Mensajes cortos y tips</li>
          <li><strong>medium</strong> - Uso general (por defecto)</li>
          <li><strong>large</strong> - Mensajes importantes</li>
        </ul>
      </div>
    </div>
  )
}

