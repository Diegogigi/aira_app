from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfgen import canvas
import re


def parse_date_safely(date_str):
    """
    Parsea fechas en diferentes formatos de manera segura
    Retorna un objeto datetime o None si no se puede parsear
    """
    if not date_str:
        return None
        
    if isinstance(date_str, datetime):
        return date_str
    
    if not isinstance(date_str, str):
        return None
    
    # Limpiar caracteres especiales como espacios no separables
    date_str = date_str.replace('\xa0', ' ').strip()
    
    # Lista de formatos comunes a intentar
    formats = [
        "%d-%m-%Y, %I:%M:%S %p",  # 08-12-2025, 12:12:40 a. m.
        "%d-%m-%Y, %H:%M:%S",      # 08-12-2025, 12:12:40
        "%Y-%m-%dT%H:%M:%S.%fZ",   # ISO con microsegundos
        "%Y-%m-%dT%H:%M:%SZ",      # ISO sin microsegundos
        "%Y-%m-%dT%H:%M:%S",       # ISO simple
        "%Y-%m-%d",                # Solo fecha
        "%d/%m/%Y",                # Formato común español
    ]
    
    # Intentar parsear con cada formato
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except (ValueError, AttributeError):
            continue
    
    # Si ningún formato funciona, intentar con fromisoformat como último recurso
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        pass
    
    return None


class PDFReport:
    """Generador de reportes médicos en PDF para Aira"""
    
    def __init__(self):
        self.buffer = BytesIO()
        self.pagesize = A4
        self.width, self.height = self.pagesize
        
    def generate_report(self, profile_data, stats, logs, symptoms):
        """Genera el reporte médico en PDF"""
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=self.pagesize,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        
        # Container para los elementos del PDF
        story = []
        styles = getSampleStyleSheet()
        
        # Estilos personalizados
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0ea5e9'),
            spaceAfter=30,
            alignment=TA_CENTER,
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#111111'),
            spaceAfter=12,
            spaceBefore=12,
            borderWidth=0,
            borderColor=colors.HexColor('#e5e7eb'),
            borderPadding=0,
            borderRadius=None,
            leftIndent=0,
            rightIndent=0,
        )
        
        normal_style = styles["Normal"]
        
        # Título del documento
        story.append(Paragraph("🫁 Aira", title_style))
        story.append(Paragraph("Reporte de Seguimiento Respiratorio", styles['Heading3']))
        story.append(Spacer(1, 0.3*inch))
        
        # Información del paciente
        story.append(Paragraph("Información del Paciente", heading_style))
        
        patient_info = [
            ["Nombre:", profile_data.get('name', 'No especificado')],
            ["Condición:", profile_data.get('diagnosis', 'No especificado')],
            ["Período:", f"Últimos {stats.get('days', 7)} días"],
            ["Fecha del reporte:", datetime.now().strftime("%d de %B de %Y")],
        ]
        
        patient_table = Table(patient_info, colWidths=[2*inch, 4*inch])
        patient_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
            ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#111111')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
        ]))
        story.append(patient_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Resumen Ejecutivo
        story.append(Paragraph("Resumen Ejecutivo", heading_style))
        
        adherence = stats.get('adherence', 0)
        total_doses = stats.get('totalDoses', 0)
        total_symptom_days = stats.get('totalSymptomDays', 0)
        days_with_good_control = stats.get('daysWithGoodControl', 0)
        
        stats_data = [
            ["Métrica", "Valor"],
            ["Adherencia al Tratamiento", f"{adherence}%"],
            ["Inhalaciones Registradas", str(total_doses)],
            ["Días con Registro de Síntomas", str(total_symptom_days)],
            ["Días con Buen Control", str(days_with_good_control)],
        ]
        
        stats_table = Table(stats_data, colWidths=[3.5*inch, 2.5*inch])
        stats_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#666666')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#dcfce7') if adherence >= 80 else (colors.HexColor('#fef3c7') if adherence >= 60 else colors.HexColor('#fee2e2'))),
            ('TEXTCOLOR', (1, 1), (1, 1), colors.HexColor('#166534') if adherence >= 80 else (colors.HexColor('#854d0e') if adherence >= 60 else colors.HexColor('#991b1b'))),
            ('FONTNAME', (1, 1), (1, 1), 'Helvetica-Bold'),
        ]))
        story.append(stats_table)
        story.append(Spacer(1, 0.2*inch))
        
        # Interpretación clínica
        avg_symptom_level = stats.get('avgSymptomLevel', 0)
        
        interpretation = ""
        if adherence >= 80:
            interpretation = "El paciente muestra excelente adherencia al tratamiento. Los registros son consistentes y regulares."
        elif adherence >= 60:
            interpretation = "El paciente muestra adherencia moderada. Se recomienda reforzar la importancia del uso regular del inhalador."
        else:
            interpretation = "La adherencia es baja. Se sugiere evaluar barreras y considerar estrategias para mejorar el cumplimiento terapéutico."
        
        if avg_symptom_level <= 1:
            interpretation += " El control de síntomas es bueno en el período evaluado."
        elif avg_symptom_level <= 2:
            interpretation += " Se observan síntomas leves a moderados. Considerar ajuste terapéutico si persisten."
        else:
            interpretation += " Se observan síntomas significativos. Se recomienda evaluación clínica."
        
        interpretation_para = Paragraph(f"<b>Interpretación Clínica:</b><br/>{interpretation}", normal_style)
        story.append(interpretation_para)
        story.append(Spacer(1, 0.3*inch))
        
        # Medicamentos utilizados
        story.append(Paragraph("Medicamentos Utilizados", heading_style))
        
        medications = stats.get('medications', {})
        if medications:
            med_data = [["Medicamento", "Usos Registrados", "Promedio Diario"]]
            for med, count in medications.items():
                avg_daily = count / stats.get('days', 7)
                med_data.append([med, str(count), f"{avg_daily:.1f}"])
            
            med_table = Table(med_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
            med_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#666666')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ]))
            story.append(med_table)
        else:
            story.append(Paragraph("Sin registros de medicamentos", normal_style))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Registro de síntomas recientes
        story.append(Paragraph("Registro de Síntomas Recientes", heading_style))
        
        symptom_texts = ['Bien controlado', 'Leve', 'Moderado', 'Grave']
        
        if symptoms:
            symptom_data = [["Fecha", "Nivel", "Notas"]]
            for symptom in symptoms[:10]:  # Mostrar solo los últimos 10
                parsed_date = parse_date_safely(symptom['day'])
                date_str = parsed_date.strftime("%d/%m/%Y") if parsed_date else 'N/A'
                level_text = symptom_texts[symptom['level']] if symptom['level'] < 4 else 'Desconocido'
                notes = symptom.get('notes', '-') or '-'
                symptom_data.append([date_str, level_text, notes[:40]])  # Limitar notas a 40 caracteres
            
            symptom_table = Table(symptom_data, colWidths=[1.5*inch, 1.5*inch, 3*inch])
            symptom_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#666666')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ]))
            story.append(symptom_table)
        else:
            story.append(Paragraph("Sin registros de síntomas", normal_style))
        
        story.append(Spacer(1, 0.3*inch))
        
        # Notas importantes
        story.append(Paragraph("Notas Importantes", heading_style))
        notes = """
        • Este reporte está basado en los datos registrados por el paciente en la aplicación Aira.<br/>
        • Los datos son autorreportados y deben ser interpretados en contexto clínico.<br/>
        • Se recomienda complementar con evaluación clínica, espirometría y otros estudios según criterio médico.<br/>
        • La adherencia calculada se basa en un esquema teórico de 3 dosis diarias.
        """
        story.append(Paragraph(notes, normal_style))
        
        story.append(Spacer(1, 0.5*inch))
        
        # Footer
        footer_text = f"Este reporte fue generado automáticamente por Aira el {datetime.now().strftime('%d/%m/%Y a las %H:%M')}"
        footer_para = Paragraph(footer_text, ParagraphStyle('Footer', parent=normal_style, fontSize=8, textColor=colors.grey, alignment=TA_CENTER))
        story.append(footer_para)
        
        disclaimer = "Aira es una herramienta de seguimiento y no reemplaza la evaluación médica profesional."
        disclaimer_para = Paragraph(disclaimer, ParagraphStyle('Disclaimer', parent=normal_style, fontSize=8, textColor=colors.grey, alignment=TA_CENTER))
        story.append(disclaimer_para)
        
        # Construir el PDF
        doc.build(story)
        
        # Obtener el valor del buffer
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf


