import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAppStore } from '@/store/useAppStore';
import { getRiskName } from '@/lib/constants';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

export const useExportPDF = () => {
    const { selectedFarm, activeRisks, drawnPolygons } = useAppStore();
    const [exporting, setExporting] = useState(false);

    const exportToPDF = async () => {
        setExporting(true);
        toast.loading('Generando reporte PDF...', { id: 'pdf-export' });

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let yPosition = 20;

            // Header
            pdf.setFontSize(22);
            pdf.setTextColor(34, 139, 34);
            pdf.text('SbNAI - Reporte de Análisis', pageWidth / 2, yPosition, { align: 'center' });

            yPosition += 10;
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`, pageWidth / 2, yPosition, { align: 'center' });

            // Farm Info
            yPosition += 15;
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Información de la Parcela', 15, yPosition);

            yPosition += 8;
            pdf.setFontSize(10);
            pdf.setTextColor(60, 60, 60);
            pdf.text(`Nombre: ${selectedFarm?.name || 'N/A'}`, 20, yPosition);
            yPosition += 6;
            pdf.text(`Ubicación: ${selectedFarm?.location.lat.toFixed(4)}, ${selectedFarm?.location.lng.toFixed(4)}`, 20, yPosition);
            yPosition += 6;
            pdf.text(`Área Total: ${selectedFarm?.totalArea || 'N/A'} ha`, 20, yPosition);

            // Active Risks
            yPosition += 12;
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Riesgos Activados', 15, yPosition);

            yPosition += 8;
            pdf.setFontSize(10);
            if (activeRisks.length > 0) {
                activeRisks.forEach(risk => {
                    pdf.text(`• ${getRiskName(risk)}`, 20, yPosition);
                    yPosition += 6;
                });
            } else {
                pdf.setTextColor(100, 100, 100);
                pdf.text('No hay riesgos activados', 20, yPosition);
                pdf.setTextColor(60, 60, 60);
                yPosition += 6;
            }

            // Drawn Polygons
            yPosition += 12;
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Polígonos Analizados', 15, yPosition);

            yPosition += 8;
            pdf.setFontSize(10);
            if (drawnPolygons.length > 0) {
                drawnPolygons.forEach((polygon, idx) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = 20;
                    }

                    pdf.text(`Polígono ${idx + 1}:`, 20, yPosition);
                    yPosition += 6;
                    pdf.text(`  Área: ${polygon.area.toFixed(2)} ha`, 20, yPosition);
                    yPosition += 6;

                    if (polygon.analysis) {
                        pdf.text(`  Riesgos detectados: ${polygon.analysis.detectedRisks.join(', ')}`, 20, yPosition);
                        yPosition += 6;
                    }
                    yPosition += 4;
                });
            } else {
                pdf.setTextColor(100, 100, 100);
                pdf.text('No hay polígonos dibujados', 20, yPosition);
            }

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                'Generado por SbNAI - Soluciones Basadas en la Naturaleza',
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );

            // Try to capture map view
            const mapElement = document.querySelector('.leaflet-container') as HTMLElement;
            if (mapElement) {
                try {
                    const canvas = await html2canvas(mapElement, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 2,
                    });

                    pdf.addPage();
                    pdf.setFontSize(14);
                    pdf.setTextColor(0, 0, 0);
                    pdf.text('Vista del Mapa', 15, 20);

                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pageWidth - 30;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, Math.min(imgHeight, pageHeight - 50));
                } catch (error) {
                    console.warn('Could not capture map screenshot:', error);
                }
            }

            // Save
            pdf.save(`SbNAI_Reporte_${selectedFarm?.name || 'Análisis'}_${new Date().toISOString().slice(0, 10)}.pdf`);

            toast.success('Reporte PDF generado exitosamente', { id: 'pdf-export' });
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF', { id: 'pdf-export' });
        } finally {
            setExporting(false);
        }
    };

    return { exportToPDF, exporting };
};

export const ExportPDFButton = () => {
    const { exportToPDF, exporting } = useExportPDF();

    return (
        <Button
            onClick={exportToPDF}
            disabled={exporting}
            variant="outline"
            className="gap-2"
        >
            {exporting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando...
                </>
            ) : (
                <>
                    <FileDown className="w-4 h-4" />
                    Exportar PDF
                </>
            )}
        </Button>
    );
};
