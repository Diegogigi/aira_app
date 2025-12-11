# 🌬️ AIRA v1.0 - Copiloto Respiratorio

## Implementación Completada

Aira ha sido integrada como un copiloto contextual en toda la plataforma AeroPro. Aparece en momentos clave, habla según lo que el usuario registra, interpreta patrones y acompaña emocionalmente.

---

## 📋 Arquitectura de Aira

### Componentes Creados

#### 1. **AiraMessage.jsx** (`frontend/src/components/AiraMessage.jsx`)

Componente visual para mostrar mensajes de Aira con diferentes estilos:

- **Tipos de mensajes**: `motivational`, `educational`, `insight`, `warning`, `success`
- **Tamaños**: `small`, `medium`, `large`
- **Avatar configurable**: Puede mostrarse u ocultarse
- **Animaciones**: Entrada suave con efecto slide-in

**Uso:**

```jsx
<AiraMessage
  message="¡Hola! Soy Aira, tu copiloto respiratorio."
  type="motivational"
  showAvatar={true}
  size="medium"
/>
```

#### 2. **useAira.js** (`frontend/src/hooks/useAira.js`)

Hook personalizado que contiene toda la lógica de Aira:

- Análisis de adherencia al tratamiento
- Detección de patrones en síntomas
- Generación de mensajes contextuales
- Cálculo de estadísticas

**Funciones principales:**

- `getHomeMessage()` - Mensajes para la pantalla de inicio
- `getLogMessage(medicationName, puffs)` - Feedback tras registrar inhalaciones
- `getSymptomsMessage()` - Análisis de patrones de síntomas
- `getSummaryMessage()` - Interpretación de estadísticas
- `getExtrasMessage(section)` - Guías para funcionalidades extra
- `getOnboardingMessage(step)` - Mensajes durante el onboarding
- `refreshData()` - Recalcula todos los datos

---

## 🎯 Integración por Pantalla

### 1. **OnboardingScreen** ✅

**Ubicación**: Cada paso del onboarding

**Funcionalidad**:

- Aira se presenta en el primer paso
- Acompaña al usuario en cada paso explicando el propósito
- Mensaje de éxito al completar el onboarding

**Mensajes por paso**:

- Paso 1: Presentación de Aira
- Paso 2: Explicación sobre datos personales
- Paso 3: Contexto sobre información médica
- Paso 4: Importancia de registrar medicamentos
- Paso 5: Seguridad con contacto de emergencia
- Paso 6: Felicitación por completar el proceso

---

### 2. **HomeScreen** ✅

**Ubicación**: Parte superior de la pantalla de inicio

**Funcionalidad**:

- Saludo personalizado según hora del día
- Mensajes motivacionales basados en adherencia
- Reconocimiento de rachas y logros
- Tip educativo al final

**Tipos de mensajes**:

- Adherencia ≥90%: Felicitación por excelencia
- Racha activa: Reconocimiento de constancia
- Registros semanales: Motivación positiva
- Sin registros: Invitación a retomar

---

### 3. **LogScreen** ✅

**Ubicación**: Aparece después de registrar una inhalación

**Funcionalidad**:

- Feedback inmediato tras registrar
- Preguntas sobre cómo se sintió el usuario
- Recordatorios sobre la importancia del registro
- Se oculta automáticamente después de 5 segundos

**Ejemplos de mensajes**:

- "Perfecto, registré 2 puffs de Salbutamol. ¿Cómo te sentiste después?"
- "¡Bien hecho! La constancia es clave en tu tratamiento."
- "Cada registro ayuda a tu médico a entender tu progreso."

---

### 4. **SymptomsScreen** ✅

**Ubicación**: Parte superior, antes del formulario de síntomas

**Funcionalidad**:

- Análisis de patrones de síntomas
- Detección de tendencias (mejorando, empeorando, estable)
- Identificación de triggers comunes
- Recomendaciones sin diagnosticar

**Análisis que realiza**:

- Nivel promedio de síntomas en 7 días
- Tendencia general (mejora, empeora, estable)
- Trigger más frecuente
- Cantidad de registros recientes

**Ejemplos de insights**:

- "Tus síntomas han mejorado en los últimos registros. ¡Sigue así!"
- "He detectado que el ejercicio aparece frecuentemente. Coméntalo con tu médico."
- "Has registrado síntomas leves 3 días seguidos. Esto puede indicar variabilidad."

---

### 5. **SummaryScreen** ✅

**Ubicación**: Parte superior de estadísticas

**Funcionalidad**:

- Interpretación de adherencia semanal
- Comparación con semanas anteriores
- Mensajes personalizados según nivel de adherencia
- Recordatorio sobre el valor de los datos para el médico

**Niveles de adherencia**:

- ≥90%: Excelente - Mensaje de éxito
- 70-89%: Bueno - Mensaje motivacional
- 40-69%: Regular - Oferta de ayuda con recordatorios
- <40%: Bajo - Invitación a retomar sin presión

---

### 6. **ExtrasScreen** ✅

**Ubicación**: Introducción general y en cada sección específica

**Funcionalidad**:

- Guía sobre cada herramienta extra
- Explicación de beneficios
- Tips de uso

**Mensajes por sección**:

- **QR Scanner**: Explica activación de aerocámara
- **Ejercicio Respiratorio**: Beneficios para estrés y ansiedad
- **Reporte Médico**: Utilidad del PDF para consultas

---

## 🧠 Lógica de Aira

### Análisis de Adherencia

```javascript
// Calcula adherencia semanal (3 dosis/día × 7 días = 21)
const expectedWeekly = 21;
const adherence = Math.round((thisWeekLogs / expectedWeekly) * 100);
```

### Análisis de Síntomas

```javascript
// Detecta tendencia en últimos 3 registros
const trend =
  last3[0].level > last3[last3.length - 1].level
    ? "improving"
    : last3[0].level < last3[last3.length - 1].level
    ? "worsening"
    : "stable";
```

### Detección de Patterns

- **Triggers más comunes**: Cuenta frecuencia de cada trigger
- **Nivel promedio**: Promedio de niveles de síntomas en 7 días
- **Racha actual**: Días consecutivos con todas las dosis registradas

---

## 🎨 Estilos y Animaciones

### Animaciones CSS

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

### Colores por Tipo de Mensaje

- **Motivational**: Azul (#0ea5e9)
- **Educational**: Amarillo (#f59e0b)
- **Insight**: Morado (#8b5cf6)
- **Warning**: Rojo (#ef4444)
- **Success**: Verde (#22c55e)

---

## 📊 Datos que Aira Utiliza

### LocalStorage Keys

- `airaUser` - Datos del usuario
- `inhalationLogs` - Registros de inhalaciones
- `symptomEntries` - Registros de síntomas
- `currentStreak` - Racha actual de días completos
- `dailyPlan` - Plan diario de medicamentos

### Estructura de Datos

```javascript
// Adherence Stats
{
  weeklyAdherence: 75,
  currentStreak: 3,
  totalLogs: 45,
  thisWeekLogs: 16,
  lastLog: { medication_name: "Salbutamol", ... }
}

// Symptoms Patterns
{
  avgLevel: 1.5,
  trend: 'improving',
  mostCommonTrigger: 'exercise',
  recentCount: 5
}
```

---

## 🚀 Características Implementadas

✅ **Guía motivacional diaria**

- Mensajes personalizados según adherencia
- Saludos según hora del día
- Reconocimiento de logros

✅ **Seguimiento inteligente sin IoT**

- Análisis de patrones de registro
- Detección de consistencia
- Alertas sobre uso irregular

✅ **Análisis simple de patrones de síntomas**

- Tendencias (mejorando, empeorando, estable)
- Identificación de triggers
- Correlación con actividades

✅ **Consejos de técnica respiratoria**

- Tips educativos contextuales
- Recordatorios sin ser invasiva
- Lenguaje simple y claro

✅ **Recordatorios inteligentes**

- Basados en historial del usuario
- Ajustados a patrones de olvido
- No implementados aún en notificaciones push

✅ **Conversación educativa**

- Mensajes contextuales en cada pantalla
- Respuestas según acciones del usuario
- Lenguaje empático y motivacional

✅ **Recomendaciones personalizadas**

- Sin diagnosticar
- Basadas en datos del usuario
- Enfocadas en adherencia y registro

✅ **Informe para médico** (preparación)

- Datos de adherencia
- Patrones de síntomas
- Insights claros para consultas

---

## 🔄 Flujos de Interacción

### Flujo 1: Primer uso

1. Usuario completa login/registro
2. **Aira se presenta** en onboarding paso 1
3. Acompaña en cada paso del onboarding
4. Mensaje de bienvenida al finalizar

### Flujo 2: Registro de inhalación

1. Usuario hace clic en medicamento rápido
2. **Aira aparece** con mensaje de confirmación
3. Pregunta cómo se sintió el usuario
4. Mensaje se oculta después de 5 segundos

### Flujo 3: Visualización de estadísticas

1. Usuario entra a Summary
2. **Aira interpreta** los datos automáticamente
3. Muestra insight sobre adherencia
4. Ofrece ayuda si la adherencia es baja

### Flujo 4: Registro de síntomas

1. Usuario registra síntomas
2. **Aira analiza** patrones automáticamente
3. Detecta trends y triggers
4. Ofrece insight sin diagnosticar

---

## 💡 Principios de Diseño de Aira

1. **Contextual**: Aparece en el momento correcto
2. **No invasiva**: Mensajes claros y concisos
3. **Educativa**: Explica sin tecnicismos
4. **Motivacional**: Refuerza comportamientos positivos
5. **Empática**: Lenguaje cercano y comprensivo
6. **Sin diagnosticar**: Siempre refiere al médico
7. **Basada en datos**: Insights reales del usuario

---

## 🛠️ Próximas Mejoras (v1.5)

- [ ] Chat integrado con Aira
- [ ] Notificaciones push con mensajes de Aira
- [ ] Recordatorios inteligentes personalizados
- [ ] Insights más avanzados con machine learning
- [ ] Integración con IoT cuando esté disponible
- [ ] Respuestas a preguntas frecuentes
- [ ] Exportación de conversaciones con Aira

---

## 📝 Notas de Implementación

### Archivos Modificados

- ✅ `frontend/src/components/AiraMessage.jsx` (nuevo)
- ✅ `frontend/src/hooks/useAira.js` (nuevo)
- ✅ `frontend/src/pages/OnboardingScreen.jsx`
- ✅ `frontend/src/pages/HomeScreen.jsx`
- ✅ `frontend/src/pages/LogScreen.jsx`
- ✅ `frontend/src/pages/SymptomsScreen.jsx`
- ✅ `frontend/src/pages/SummaryScreen.jsx`
- ✅ `frontend/src/pages/ExtrasScreen.jsx`
- ✅ `frontend/src/styles.css`

### Sin Errores de Linting ✅

Todos los archivos pasaron la validación de ESLint sin errores.

---

## 🎉 Resultado Final

Aira v1.0 está completamente funcional dentro de la plataforma actual sin necesidad de hardware adicional. El copiloto:

✅ Acompaña al usuario desde el onboarding
✅ Da feedback en tiempo real
✅ Analiza patrones de adherencia y síntomas
✅ Motiva y educa constantemente
✅ Prepara datos útiles para el médico
✅ Crea conexión emocional con la plataforma

**Aira está lista para lanzamiento** 🚀
