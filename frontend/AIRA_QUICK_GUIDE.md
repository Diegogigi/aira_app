# 🌬️ AIRA - Guía Rápida

## ¿Qué es Aira?

**Aira es tu copiloto respiratorio** - un asistente inteligente integrado en AeroPro que:

- 💬 **Te habla** en cada pantalla con mensajes personalizados
- 📊 **Analiza** tu adherencia y patrones de síntomas
- 💪 **Te motiva** a mantener tu tratamiento
- 🧠 **Aprende** de tus registros
- 🏥 **Prepara** datos para tu médico

---

## 🎯 ¿Dónde la encuentro?

| Pantalla | Qué hace Aira |
|----------|---------------|
| 🚀 **Onboarding** | Se presenta y explica cada paso |
| 🏠 **Inicio** | Te saluda y motiva según tu progreso |
| ✍️ **Registro** | Te da feedback tras registrar |
| 💔 **Síntomas** | Analiza patrones y tendencias |
| 📊 **Estadísticas** | Interpreta tus números |
| ⚡ **Extras** | Te guía en cada herramienta |
| 👤 **Perfil** | Te cuenta sobre sí misma |

---

## 💬 Tipos de Mensajes

### 🔵 Motivacional (Azul)
> "¡Excelente! Llevas 3 días con todas tus dosis registradas"

### 🟡 Educativo (Amarillo)
> "Registrar tus dosis justo después de tomarlas ayuda a no olvidar"

### 🟣 Insight (Morado)
> "He notado que usas más tu inhalador por las mañanas"

### 🔴 Advertencia (Rojo)
> "Si tienes dificultad importante, consulta a tu médico"

### 🟢 Éxito (Verde)
> "¡Completaste todas tus dosis del día! 🎉"

---

## 🧠 ¿Qué analiza?

```
✅ Adherencia semanal (%)
✅ Racha de días completos
✅ Patrones de síntomas
✅ Triggers más comunes
✅ Tendencias (mejorando/empeorando)
✅ Comparación semanal
```

---

## ⚡ Uso Rápido

### Para desarrolladores:

```jsx
import AiraMessage from '../components/AiraMessage'

<AiraMessage 
  message="¡Hola! Mensaje de Aira"
  type="motivational"
  showAvatar={true}
  size="medium"
/>
```

### Con datos dinámicos:

```jsx
import useAira from '../hooks/useAira'

const { getHomeMessage } = useAira()
const msg = getHomeMessage()

<AiraMessage 
  message={msg.message}
  type={msg.type}
/>
```

---

## 📁 Archivos Principales

```
frontend/src/
├── components/
│   └── AiraMessage.jsx    ← Componente visual
├── hooks/
│   └── useAira.js         ← Lógica y análisis
└── pages/
    └── [todas integradas] ← Aira en acción
```

---

## 🎨 Personalización

### Tipos disponibles:
- `motivational` - `educational` - `insight` - `warning` - `success`

### Tamaños disponibles:
- `small` - `medium` - `large`

### Mostrar/ocultar avatar:
- `showAvatar={true}` o `showAvatar={false}`

---

## ✅ Estado Actual

- [x] ✅ 100% funcional
- [x] ✅ Integrada en todas las pantallas
- [x] ✅ Sin errores de código
- [x] ✅ Documentación completa
- [x] ✅ Lista para producción

---

## 🚀 Para empezar

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Ver a Aira:**
   - Crea una cuenta
   - Completa el onboarding
   - ¡Aira aparecerá en cada sección!

---

## 📚 Más información

- **Documentación técnica**: `AIRA_IMPLEMENTATION.md`
- **Resumen ejecutivo**: `AIRA_RESUMEN.md`
- **Resumen completo**: `RESUMEN_FINAL.md`
- **Ejemplos de código**: `AiraExample.jsx`

---

## 💡 Recuerda

Aira **NO** diagnostica ni reemplaza al médico.
Es una **herramienta de apoyo** para tu seguimiento respiratorio.

---

**¡Aira está lista para ayudarte!** 🌬️✨

