
import React, { useState } from 'react'
import { QrCode, CheckCircle2, XCircle, Camera, Upload } from 'lucide-react'

export default function QRScanner({ onScanSuccess }) {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Simulación de escaneo QR (en producción usarías una librería como html5-qrcode)
  const simulateScan = () => {
    setScanning(true)
    setError(null)
    
    // Simular delay de escaneo
    setTimeout(() => {
      // Simular código QR válido de Aira
      const mockQRData = {
        type: 'aira_chamber',
        serialNumber: 'AIRA-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        activatedAt: new Date().toISOString(),
        model: 'Aerocámara Aira'
      }
      
      setResult(mockQRData)
      setScanning(false)
      
      // Guardar en localStorage
      localStorage.setItem('airaDevice', JSON.stringify(mockQRData))
      
      if (onScanSuccess) {
        onScanSuccess(mockQRData)
      }
    }, 2000)
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div>
      {!result && !scanning && (
        <div style={{
          padding: 24,
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: 16,
          textAlign: 'center'
        }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <QrCode size={40} color="#0ea5e9" />
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            Activa tu Aerocámara
          </h3>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, lineHeight: 1.6 }}>
            Escanea el código QR que viene en tu aerocámara Aira para registrarla en la app
          </p>

          <button
            onClick={simulateScan}
            style={{
              width: '100%',
              padding: 16,
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              marginBottom: 12
            }}
          >
            <Camera size={20} />
            Escanear código QR
          </button>

          <button
            style={{
              width: '100%',
              padding: 14,
              background: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <Upload size={18} />
            Subir imagen del código
          </button>
        </div>
      )}

      {scanning && (
        <div style={{
          padding: 40,
          background: 'white',
          borderRadius: 16,
          textAlign: 'center',
          border: '2px dashed #0ea5e9'
        }}>
          <div style={{
            width: 200,
            height: 200,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <QrCode size={80} color="white" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#0ea5e9' }}>
            Escaneando código QR...
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
            Apunta la cámara al código
          </div>
        </div>
      )}

      {result && (
        <div style={{
          padding: 24,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: 16,
          border: '2px solid #22c55e'
        }}>
          <div style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            background: '#22c55e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={36} color="white" />
          </div>

          <h3 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#166534', 
            marginBottom: 8,
            textAlign: 'center'
          }}>
            ¡Aerocámara activada!
          </h3>

          <div style={{
            background: 'white',
            padding: 16,
            borderRadius: 12,
            marginTop: 16
          }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                Modelo
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                {result.model}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                Número de serie
              </div>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#0ea5e9',
                fontFamily: 'monospace'
              }}>
                {result.serialNumber}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                Activada el
              </div>
              <div style={{ fontSize: 14, color: '#374151' }}>
                {new Date(result.activatedAt).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <button
            onClick={reset}
            style={{
              width: '100%',
              marginTop: 16,
              padding: 14,
              background: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Escanear otra aerocámara
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div style={{
        marginTop: 16,
        padding: 16,
        background: '#fef3c7',
        borderRadius: 12,
        fontSize: 13,
        color: '#78350f',
        lineHeight: 1.6
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          ¿Dónde está el código QR?
        </div>
        <div>
          El código QR está impreso en el empaque de tu aerocámara Aira. 
          También puede estar en un sticker adherido al dispositivo.
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}



