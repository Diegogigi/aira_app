
import React, { useState } from 'react'
import { FileText, Download, Printer, Calendar, Activity, Heart, TrendingUp } from 'lucide-react'

export default function MedicalReport() {
  const [generating, setGenerating] = useState(false)
  const [dateRange, setDateRange] = useState('7') // días
  const [error, setError] = useState(null)

  // Función para descargar PDF desde el backend
  const downloadPDF = async () => {
    setGenerating(true)
    setError(null)

    try {
      // Obtener datos del localStorage
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      const logs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
      const symptoms = JSON.parse(localStorage.getItem('symptomEntries') || '[]')
      
      // Filtrar por rango de fecha
      const now = Date.now()
      const rangeMs = parseInt(dateRange) * 24 * 60 * 60 * 1000
      const cutoffDate = now - rangeMs

      const filteredLogs = logs.filter(log => log.timestamp >= cutoffDate)
      const filteredSymptoms = symptoms.filter(s => s.timestamp >= cutoffDate)

      // Hacer la petición al backend usando el endpoint público
      const response = await fetch('http://127.0.0.1:8000/report/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            name: profile.name || 'Paciente',
            diagnosis: profile.diagnosis || 'No especificado'
          },
          logs: filteredLogs,
          symptoms: filteredSymptoms,
          days: parseInt(dateRange)
        })
      })

      if (!response.ok) {
        throw new Error('Error al generar el reporte PDF')
      }

      // Obtener el blob del PDF
      const blob = await response.blob()
      
      // Crear un link temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const fileName = `reporte_aira_${(profile.name || 'paciente').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      
      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Error al descargar el PDF:', err)
      setError('No se pudo generar el PDF. Intenta con el reporte para imprimir.')
    } finally {
      setGenerating(false)
    }
  }

  // Función para ver PDF en vista previa
  const previewPDF = async () => {
    setGenerating(true)
    setError(null)

    try {
      // Obtener datos del localStorage
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      const logs = JSON.parse(localStorage.getItem('inhalationLogs') || '[]')
      const symptoms = JSON.parse(localStorage.getItem('symptomEntries') || '[]')
      
      // Filtrar por rango de fecha
      const now = Date.now()
      const rangeMs = parseInt(dateRange) * 24 * 60 * 60 * 1000
      const cutoffDate = now - rangeMs

      const filteredLogs = logs.filter(log => log.timestamp >= cutoffDate)
      const filteredSymptoms = symptoms.filter(s => s.timestamp >= cutoffDate)

      // Hacer la petición al backend
      const response = await fetch('http://127.0.0.1:8000/report/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            name: profile.name || 'Paciente',
            diagnosis: profile.diagnosis || 'No especificado'
          },
          logs: filteredLogs,
          symptoms: filteredSymptoms,
          days: parseInt(dateRange)
        })
      })

      if (!response.ok) {
        throw new Error('Error al generar la vista previa del PDF')
      }

      // Obtener el blob del PDF
      const blob = await response.blob()
      
      // Crear una URL temporal y abrirla en nueva pestaña
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      
      // Limpiar la URL después de un tiempo
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 60000) // 1 minuto
      
    } catch (err) {
      console.error('Error al generar vista previa:', err)
      setError('No se pudo generar la vista previa. Verifica que el servidor esté ejecutándose.')
    } finally {
      setGenerating(false)
    }
  }

  const calculateStats = (logs, symptoms, days) => {
    const expectedDoses = days * 3 // Asumiendo 3 dosis diarias
    const actualDoses = logs.length
    const adherence = Math.min(100, Math.round((actualDoses / expectedDoses) * 100))

    // Síntomas promedio
    const avgSymptomLevel = symptoms.length > 0
      ? symptoms.reduce((sum, s) => sum + s.level, 0) / symptoms.length
      : 0

    // Días con control
    const daysWithGoodControl = symptoms.filter(s => s.level === 0).length

    // Medicamentos más usados
    const medCounts = {}
    logs.forEach(log => {
      medCounts[log.medication_name] = (medCounts[log.medication_name] || 0) + 1
    })

    return {
      adherence,
      totalDoses: actualDoses,
      expectedDoses,
      avgSymptomLevel,
      daysWithGoodControl,
      totalSymptomDays: symptoms.length,
      medications: medCounts
    }
  }

  const generateReportHTML = (profile, stats, logs, symptoms, days) => {
    const symptomsText = ['Bien controlado', 'Leve', 'Moderado', 'Grave']
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Médico - Aira</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            border-bottom: 4px solid #0ea5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #0ea5e9;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          .patient-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .patient-info h2 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #111;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: 600;
            width: 150px;
            color: #666;
          }
          .info-value {
            color: #111;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #111;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          .stat-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0ea5e9;
          }
          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #0ea5e9;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f8fafc;
            font-weight: 600;
            color: #666;
            font-size: 13px;
            text-transform: uppercase;
          }
          td {
            font-size: 14px;
          }
          .adherence-bar {
            width: 100%;
            height: 30px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            margin-top: 10px;
          }
          .adherence-fill {
            height: 100%;
            background: ${stats.adherence >= 80 ? '#22c55e' : stats.adherence >= 60 ? '#f59e0b' : '#ef4444'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 14px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .interpretation {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin-top: 15px;
          }
          .interpretation-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
          }
          .interpretation-text {
            color: #78350f;
            font-size: 14px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🫁 Aira</div>
          <div class="subtitle">Reporte de Seguimiento Respiratorio</div>
        </div>

        <div class="patient-info">
          <h2>Información del Paciente</h2>
          <div class="info-row">
            <div class="info-label">Nombre:</div>
            <div class="info-value">${profile.name || 'No especificado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Condición:</div>
            <div class="info-value">${profile.diagnosis || 'No especificado'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Período:</div>
            <div class="info-value">Últimos ${days} días</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fecha del reporte:</div>
            <div class="info-value">${new Date().toLocaleDateString('es-CL', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Resumen Ejecutivo</div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.adherence}%</div>
              <div class="stat-label">Adherencia al Tratamiento</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalDoses}</div>
              <div class="stat-label">Inhalaciones Registradas</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.totalSymptomDays}</div>
              <div class="stat-label">Días con Registro de Síntomas</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.daysWithGoodControl}</div>
              <div class="stat-label">Días con Buen Control</div>
            </div>
          </div>

          <div>
            <strong>Adherencia al Tratamiento:</strong>
            <div class="adherence-bar">
              <div class="adherence-fill" style="width: ${stats.adherence}%">
                ${stats.adherence}%
              </div>
            </div>
          </div>

          <div class="interpretation">
            <div class="interpretation-title">Interpretación Clínica:</div>
            <div class="interpretation-text">
              ${stats.adherence >= 80 
                ? 'El paciente muestra excelente adherencia al tratamiento. Los registros son consistentes y regulares.'
                : stats.adherence >= 60
                ? 'El paciente muestra adherencia moderada. Se recomienda reforzar la importancia del uso regular del inhalador.'
                : 'La adherencia es baja. Se sugiere evaluar barreras y considerar estrategias para mejorar el cumplimiento terapéutico.'}
              
              ${stats.avgSymptomLevel <= 1 
                ? ' El control de síntomas es bueno en el período evaluado.'
                : stats.avgSymptomLevel <= 2
                ? ' Se observan síntomas leves a moderados. Considerar ajuste terapéutico si persisten.'
                : ' Se observan síntomas significativos. Se recomienda evaluación clínica.'}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Medicamentos Utilizados</div>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Usos Registrados</th>
                <th>Promedio Diario</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(stats.medications).map(([med, count]) => `
                <tr>
                  <td>${med}</td>
                  <td>${count}</td>
                  <td>${(count / parseInt(days)).toFixed(1)}</td>
                </tr>
              `).join('')}
              ${Object.keys(stats.medications).length === 0 ? '<tr><td colspan="3" style="text-align: center; color: #666;">Sin registros</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Registro de Síntomas Recientes</div>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nivel</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              ${symptoms.slice(0, 10).map(s => `
                <tr>
                  <td>${new Date(s.timestamp).toLocaleDateString('es-CL')}</td>
                  <td>
                    <span style="
                      padding: 4px 8px;
                      border-radius: 4px;
                      background: ${['#f0fdf4', '#fefce8', '#fff7ed', '#fef2f2'][s.level]};
                      color: ${['#166534', '#854d0e', '#9a3412', '#991b1b'][s.level]};
                      font-weight: 600;
                      font-size: 12px;
                    ">
                      ${symptomsText[s.level]}
                    </span>
                  </td>
                  <td>${s.notes || '-'}</td>
                </tr>
              `).join('')}
              ${symptoms.length === 0 ? '<tr><td colspan="3" style="text-align: center; color: #666;">Sin registros</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Notas Importantes</div>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li>Este reporte está basado en los datos registrados por el paciente en la aplicación Aira.</li>
            <li>Los datos son autorreportados y deben ser interpretados en contexto clínico.</li>
            <li>Se recomienda complementar con evaluación clínica, espirometría y otros estudios según criterio médico.</li>
            <li>La adherencia calculada se basa en un esquema teórico de 3 dosis diarias.</li>
          </ul>
        </div>

        <div class="footer">
          <p>Este reporte fue generado automáticamente por Aira el ${new Date().toLocaleDateString('es-CL')} a las ${new Date().toLocaleTimeString('es-CL')}</p>
          <p style="margin-top: 10px;">Aira es una herramienta de seguimiento y no reemplaza la evaluación médica profesional.</p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} color="white" />
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>
              Resumen para tu médico
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Genera un reporte en PDF con tus datos
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Período del reporte</label>
          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Últimos 7 días</option>
            <option value="14">Últimos 14 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="60">Últimos 2 meses</option>
            <option value="90">Últimos 3 meses</option>
          </select>
        </div>

        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={downloadPDF}
          disabled={generating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: generating ? 0.6 : 1,
            marginBottom: 12
          }}
        >
          {generating ? (
            <>
              <div style={{ 
                width: 20, 
                height: 20, 
                border: '3px solid white', 
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Generando reporte...
            </>
          ) : (
            <>
              <Download size={20} />
              Descargar reporte PDF
            </>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={previewPDF}
          disabled={generating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: generating ? 0.6 : 1,
            backgroundColor: 'white',
            color: '#0ea5e9',
            border: '2px solid #0ea5e9'
          }}
        >
          <Printer size={20} />
          Vista previa del PDF
        </button>
      </div>

      <div className="card" style={{ background: '#eff6ff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <FileText size={20} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>
              ¿Cómo usar este reporte?
            </div>
            <ul style={{ 
              fontSize: 13, 
              color: '#1e3a8a', 
              lineHeight: 1.6,
              marginLeft: 18
            }}>
              <li><strong>Descargar PDF:</strong> Guarda un archivo PDF profesional en tu dispositivo</li>
              <li><strong>Vista previa:</strong> Visualiza el PDF en tu navegador antes de descargarlo o imprimirlo</li>
              <li>Ambas opciones generan el mismo PDF con formato profesional</li>
              <li>Genera el reporte antes de tu consulta médica</li>
              <li>Incluye estadísticas, adherencia e interpretación clínica</li>
              <li><strong>Nota:</strong> Necesitas que el servidor backend esté ejecutándose</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}


