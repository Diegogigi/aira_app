import { useState, useEffect } from 'react'

/**
 * Hook useAira - Lógica central de Aira para generar mensajes contextuales
 * 
 * Funciones principales:
 * - Análisis de patrones de adherencia
 * - Detección de cambios en síntomas
 * - Generación de mensajes motivacionales
 * - Insights basados en datos del usuario
 */

export default function useAira() {
    const [userData, setUserData] = useState(null)
    const [adherenceStats, setAdherenceStats] = useState(null)
    const [symptomsPatterns, setSymptomsPatterns] = useState(null)

    useEffect(() => {
        loadUserData()
        calculateAdherence()
        analyzeSymptoms()
    }, [])

    const loadUserData = () => {
        const user = JSON.parse(localStorage.getItem('airaUser') || '{}')
        setUserData(user)
    }

    const calculateAdherence = () => {
        const logs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
        const streak = parseInt(localStorage.getItem('currentStreak') || '0')

        const now = Date.now()
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
        const thisWeekLogs = logs.filter(log => log.timestamp >= oneWeekAgo).length

        const expectedWeekly = 21 // 3 dosis diarias x 7 días
        const adherence = Math.min(100, Math.round((thisWeekLogs / expectedWeekly) * 100))

        setAdherenceStats({
            weeklyAdherence: adherence,
            currentStreak: streak,
            totalLogs: logs.length,
            thisWeekLogs,
            lastLog: logs[0] || null
        })
    }

    const analyzeSymptoms = () => {
        const symptoms = JSON.parse(localStorage.getItem('symptomEntries') || '[]')

        if (symptoms.length === 0) {
            setSymptomsPatterns(null)
            return
        }

        // Análisis de los últimos 7 días
        const now = Date.now()
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
        const recentSymptoms = symptoms.filter(s => s.timestamp >= oneWeekAgo)

        // Calcular nivel promedio
        const avgLevel = recentSymptoms.length > 0
            ? recentSymptoms.reduce((sum, s) => sum + s.level, 0) / recentSymptoms.length
            : 0

        // Detectar tendencia
        const last3 = symptoms.slice(0, 3)
        const trend = last3.length >= 2
            ? last3[0].level > last3[last3.length - 1].level ? 'improving' :
                last3[0].level < last3[last3.length - 1].level ? 'worsening' : 'stable'
            : 'stable'

        // Triggers más comunes
        const allTriggers = recentSymptoms.flatMap(s => s.triggers || [])
        const triggerCounts = allTriggers.reduce((acc, t) => {
            acc[t] = (acc[t] || 0) + 1
            return acc
        }, {})

        const mostCommonTrigger = Object.keys(triggerCounts).length > 0
            ? Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0][0]
            : null

        setSymptomsPatterns({
            avgLevel,
            trend,
            mostCommonTrigger,
            recentCount: recentSymptoms.length
        })
    }

    // Mensajes para Home Screen
    const getHomeMessage = () => {
        if (!adherenceStats) return null

        const { weeklyAdherence, currentStreak, thisWeekLogs, lastLog } = adherenceStats
        const userName = userData?.name || 'usuario'
        const hour = new Date().getHours()

        let greeting = hour < 12 ? '¡Buen día' : hour < 20 ? '¡Buenas tardes' : '¡Buenas noches'
        greeting += `, ${userName.split(' ')[0]}!`

        if (weeklyAdherence >= 90) {
            return {
                message: `${greeting} Tu adherencia esta semana es excelente (${weeklyAdherence}%). ¡Sigue así!`,
                type: 'success'
            }
        } else if (currentStreak > 0) {
            return {
                message: `${greeting} Llevas ${currentStreak} ${currentStreak === 1 ? 'día' : 'días'} con todos tus registros completos. ¡Excelente constancia!`,
                type: 'motivational'
            }
        } else if (thisWeekLogs > 0) {
            return {
                message: `${greeting} Has registrado ${thisWeekLogs} dosis esta semana. Cada registro cuenta para tu tratamiento.`,
                type: 'motivational'
            }
        } else {
            return {
                message: `${greeting} ¿Listo para empezar el día? Puedo ayudarte a mantener tu tratamiento al día.`,
                type: 'motivational'
            }
        }
    }

    // Mensajes para Log Screen (después de registrar)
    const getLogMessage = (medicationName, puffs) => {
        const messages = [
            `Perfecto, registré ${puffs} ${puffs === 1 ? 'puff' : 'puffs'} de ${medicationName}. ¿Cómo te sentiste después de la inhalación?`,
            `¡Bien hecho! Acabas de registrar ${medicationName}. La constancia es clave en tu tratamiento.`,
            `Registré tu dosis de ${medicationName}. Recuerda que cada registro ayuda a tu médico a entender tu progreso.`,
            `Excelente. ${medicationName} registrado correctamente. ¿Notaste alguna mejora en tu respiración?`
        ]

        return {
            message: messages[Math.floor(Math.random() * messages.length)],
            type: 'success'
        }
    }

    // Mensajes para Symptoms Screen
    const getSymptomsMessage = () => {
        if (!symptomsPatterns || symptomsPatterns.recentCount === 0) {
            return {
                message: 'Registrar tus síntomas me ayuda a identificar patrones. Mientras más información tengas, mejor puedo apoyarte.',
                type: 'educational'
            }
        }

        const { avgLevel, trend, mostCommonTrigger, recentCount } = symptomsPatterns

        if (trend === 'worsening') {
            return {
                message: `He notado que tus síntomas han aumentado en los últimos registros. Es importante que lo comentes con tu médico en tu próxima consulta.`,
                type: 'warning'
            }
        } else if (trend === 'improving') {
            return {
                message: `¡Buenas noticias! Tus síntomas han mejorado en tus últimos registros. Sigue con tu tratamiento.`,
                type: 'success'
            }
        } else if (mostCommonTrigger) {
            const triggerNames = {
                exercise: 'ejercicio',
                cold: 'frío',
                humidity: 'humedad',
                smoke: 'humo'
            }
            return {
                message: `He detectado que el ${triggerNames[mostCommonTrigger] || mostCommonTrigger} aparece frecuentemente en tus registros. Puede ser útil mencionarlo a tu médico.`,
                type: 'insight'
            }
        }

        return {
            message: `Has registrado síntomas ${recentCount} ${recentCount === 1 ? 'vez' : 'veces'} esta semana. Esto ayuda a crear un patrón claro para tu médico.`,
            type: 'motivational'
        }
    }

    // Mensajes para Summary Screen
    const getSummaryMessage = () => {
        if (!adherenceStats) return null

        const { weeklyAdherence, currentStreak, thisWeekLogs } = adherenceStats

        if (weeklyAdherence >= 90) {
            return {
                message: `Tu adherencia de ${weeklyAdherence}% es excelente. Esto muestra un compromiso real con tu salud respiratoria. ¡Tu médico estará muy contento!`,
                type: 'success'
            }
        } else if (weeklyAdherence >= 70) {
            return {
                message: `Con ${weeklyAdherence}% de adherencia vas por buen camino. Pequeñas mejoras cada semana hacen una gran diferencia.`,
                type: 'motivational'
            }
        } else if (weeklyAdherence >= 40) {
            return {
                message: `Llevas ${thisWeekLogs} registros esta semana. ¿Quieres que te ayude con recordatorios personalizados para no olvidar ninguna dosis?`,
                type: 'educational'
            }
        } else {
            return {
                message: `Te extrañamos. ¿Quieres retomar tu seguimiento desde hoy? No necesitas completar días anteriores, podemos empezar fresco.`,
                type: 'motivational'
            }
        }
    }

    // Mensajes para Extras Screen
    const getExtrasMessage = (section) => {
        const messages = {
            qr: {
                message: 'Cuando estés listo, escanea el código QR de tu aerocámara para activarla. Esto me permitirá monitorear mejor tu técnica.',
                type: 'educational'
            },
            game: {
                message: 'Este ejercicio de respiración puede ayudarte en momentos de estrés o ansiedad. Practícalo regularmente para mejores resultados.',
                type: 'educational'
            },
            report: {
                message: 'Puedo generar un reporte PDF con todos tus datos: adherencia, síntomas y patrones. Perfecto para tu próxima consulta médica.',
                type: 'educational'
            }
        }

        return messages[section] || {
            message: 'Estas herramientas están diseñadas para apoyarte en tu tratamiento respiratorio día a día.',
            type: 'motivational'
        }
    }

    // Mensaje de onboarding
    const getOnboardingMessage = (step) => {
        const messages = {
            1: {
                message: '¡Hola! Soy Aira, tu copiloto respiratorio. Estoy aquí para acompañarte en tu tratamiento y ayudarte a entender tus patrones respiratorios.',
                type: 'motivational'
            },
            2: {
                message: 'Conocer tus datos me permite personalizar mis recomendaciones para ti. Toda tu información está segura y es privada.',
                type: 'educational'
            },
            3: {
                message: 'Esta información médica me ayuda a entender tu condición y ofrecerte consejos más precisos. No diagnostico, solo acompaño.',
                type: 'educational'
            },
            4: {
                message: 'Con tus medicamentos registrados, puedo recordarte cuándo tomarlos y ayudarte a mantener tu adherencia.',
                type: 'educational'
            },
            5: {
                message: 'Es importante tener un contacto de emergencia. Tu seguridad es prioridad.',
                type: 'educational'
            },
            6: {
                message: '¡Todo listo! A partir de ahora estaré contigo en cada paso de tu tratamiento. Juntos lograremos grandes cosas.',
                type: 'success'
            }
        }

        return messages[step] || messages[1]
    }

    return {
        getHomeMessage,
        getLogMessage,
        getSymptomsMessage,
        getSummaryMessage,
        getExtrasMessage,
        getOnboardingMessage,
        refreshData: () => {
            loadUserData()
            calculateAdherence()
            analyzeSymptoms()
        }
    }
}

