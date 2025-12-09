import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { MapPin, Upload, Pencil, FileJson } from 'lucide-react';
import { parseGeoJSONFile, calculateAreaFromGeoJSON } from '@/utils/geoJsonLoader';

interface AddFarmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddFarmDialog = ({ open, onOpenChange }: AddFarmDialogProps) => {
    const { setDrawingMode, setActiveDrawingTool } = useAppStore();

    const [formData, setFormData] = useState({
        name: '',
        ownerName: ''
    });

    const [boundaryMethod, setBoundaryMethod] = useState<'draw' | 'upload'>('draw');
    const [geoJSONFile, setGeoJSONFile] = useState<File | null>(null);
    const [parsedGeoJSON, setParsedGeoJSON] = useState<GeoJSON.Polygon | null>(null);
    const [previewArea, setPreviewArea] = useState<number>(0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.json') && !file.name.endsWith('.geojson')) {
            toast.error('El archivo debe ser .json o .geojson');
            return;
        }

        try {
            const geoJSON = await parseGeoJSONFile(file);
            const area = calculateAreaFromGeoJSON(geoJSON);

            setGeoJSONFile(file);
            setParsedGeoJSON(geoJSON);
            setPreviewArea(area);

            toast.success(`Archivo cargado: ${area.toFixed(2)} hectáreas`);
        } catch (error: any) {
            toast.error(error.message || 'Error al cargar el archivo');
            setGeoJSONFile(null);
            setParsedGeoJSON(null);
        }
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error('Por favor ingresa un nombre para el predio');
            return;
        }

        if (!formData.ownerName.trim()) {
            toast.error('Por favor ingresa el nombre del propietario');
            return;
        }

        if (boundaryMethod === 'draw') {
            // Store farm data and activate drawing mode
            const pendingFarm = {
                name: formData.name,
                ownerName: formData.ownerName
            };

            // Store in sessionStorage temporarily
            sessionStorage.setItem('pendingFarm', JSON.stringify(pendingFarm));

            // Close dialog and activate drawing mode
            onOpenChange(false);
            setDrawingMode('parcel');
            setActiveDrawingTool('polygon');

            toast.info(`Dibuja el límite de "${formData.name}" en el mapa`);

            // Reset form
            setFormData({ name: '', ownerName: '' });

        } else if (boundaryMethod === 'upload') {
            if (!parsedGeoJSON) {
                toast.error('Por favor carga un archivo GeoJSON');
                return;
            }

            // Create farm with uploaded GeoJSON
            const newParcel = {
                id: `parcel-${Date.now()}`,
                name: formData.name,
                geoJSON: parsedGeoJSON,
                area: previewArea,
                paddocks: [],
                createdAt: new Date()
            };

            useAppStore.getState().addParcel(newParcel);
            useAppStore.getState().setSelectedParcel(newParcel);

            // Register in history
            useAppStore.getState().addToHistory({
                id: newParcel.id,
                type: 'parcel',
                name: formData.name,
                geoJSON: parsedGeoJSON,
                area: previewArea,
                createdAt: new Date(),
                createdBy: formData.ownerName, // Using owner name as creator
                notes: `Predio creado mediante carga de archivo GeoJSON`
            });

            toast.success(`Predio "${formData.name}" creado exitosamente`);

            // Reset form
            setFormData({ name: '', ownerName: '' });
            setGeoJSONFile(null);
            setParsedGeoJSON(null);
            setPreviewArea(0);
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', ownerName: '' });
        setGeoJSONFile(null);
        setParsedGeoJSON(null);
        setPreviewArea(0);
        setBoundaryMethod('draw');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Nuevo Predio
                    </DialogTitle>
                    <DialogDescription>
                        Ingresa los datos del predio y define su límite geográfico
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Farm Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nombre del Predio <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ej: Santa María"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Owner Name */}
                    <div className="space-y-2">
                        <Label htmlFor="owner">
                            Propietario <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="owner"
                            placeholder="Ej: Juan Pérez"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                    </div>

                    {/* Boundary Method */}
                    <div className="space-y-3">
                        <Label>
                            Límite Geográfico <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup value={boundaryMethod} onValueChange={(value: any) => setBoundaryMethod(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="draw" id="draw" />
                                <Label htmlFor="draw" className="flex items-center gap-2 cursor-pointer font-normal">
                                    <Pencil className="w-4 h-4" />
                                    Dibujar en el mapa
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="upload" id="upload" />
                                <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer font-normal">
                                    <FileJson className="w-4 h-4" />
                                    Cargar archivo GeoJSON
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* File Upload (only if upload method selected) */}
                    {boundaryMethod === 'upload' && (
                        <div className="space-y-2">
                            <Label htmlFor="geojson">Archivo GeoJSON</Label>
                            {geoJSONFile ? (
                                <div className="p-3 border rounded-md bg-muted/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{geoJSONFile.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setGeoJSONFile(null);
                                                setParsedGeoJSON(null);
                                                setPreviewArea(0);
                                            }}
                                        >
                                            Cambiar
                                        </Button>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Área: {previewArea.toFixed(2)} hectáreas
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Input
                                        id="geojson"
                                        type="file"
                                        accept=".json,.geojson"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => document.getElementById('geojson')?.click()}
                                        type="button"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Seleccionar archivo
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Formatos: .json, .geojson
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {boundaryMethod === 'draw' ? 'Dibujar Límite' : 'Crear Predio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFarmDialog;
