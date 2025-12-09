import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface AddPaddockDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (paddockData: PaddockFormData) => void;
    parcelName: string;
    area: number;
}

export interface PaddockFormData {
    name: string;
    description: string;
    cropType: string;
    irrigationType: string;
    attachedFile?: File;
}

const cropTypes = [
    "Maíz",
    "Trigo",
    "Soja",
    "Arroz",
    "Cebada",
    "Avena",
    "Girasol",
    "Alfalfa",
    "Viñedo",
    "Frutales",
    "Hortalizas",
    "Otro"
];

const irrigationTypes = [
    "Sin riego",
    "Riego por goteo",
    "Riego por aspersión",
    "Riego por inundación",
    "Riego por surcos",
    "Pivote central",
    "Otro"
];

const AddPaddockDialog = ({
    open,
    onClose,
    onConfirm,
    parcelName,
    area
}: AddPaddockDialogProps) => {
    const [formData, setFormData] = useState<PaddockFormData>({
        name: "",
        description: "",
        cropType: "",
        irrigationType: ""
    });
    const [attachedFile, setAttachedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("El archivo no puede superar los 10MB");
                return;
            }
            setAttachedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setAttachedFile(null);
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.name.trim()) {
            toast.error("El nombre del potrero es obligatorio");
            return;
        }
        if (!formData.cropType) {
            toast.error("Debes seleccionar un tipo de cultivo");
            return;
        }
        if (!formData.irrigationType) {
            toast.error("Debes seleccionar un tipo de riego");
            return;
        }

        onConfirm({
            ...formData,
            attachedFile: attachedFile || undefined
        });

        // Reset form
        setFormData({
            name: "",
            description: "",
            cropType: "",
            irrigationType: ""
        });
        setAttachedFile(null);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Potrero</DialogTitle>
                    <DialogDescription>
                        Completa la información del potrero en "{parcelName}"
                        <br />
                        <span className="text-xs text-muted-foreground">
                            Área: {area.toFixed(2)} hectáreas
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nombre del Potrero <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Ej: Potrero Norte"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            placeholder="Descripción opcional del potrero..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Crop Type */}
                    <div className="space-y-2">
                        <Label htmlFor="cropType">
                            Tipo de Cultivo <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.cropType}
                            onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                        >
                            <SelectTrigger id="cropType">
                                <SelectValue placeholder="Selecciona un cultivo" />
                            </SelectTrigger>
                            <SelectContent>
                                {cropTypes.map((crop) => (
                                    <SelectItem key={crop} value={crop}>
                                        {crop}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Irrigation Type */}
                    <div className="space-y-2">
                        <Label htmlFor="irrigationType">
                            Tipo de Riego <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.irrigationType}
                            onValueChange={(value) => setFormData({ ...formData, irrigationType: value })}
                        >
                            <SelectTrigger id="irrigationType">
                                <SelectValue placeholder="Selecciona tipo de riego" />
                            </SelectTrigger>
                            <SelectContent>
                                {irrigationTypes.map((irrigation) => (
                                    <SelectItem key={irrigation} value={irrigation}>
                                        {irrigation}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="file">Adjuntar Archivo (opcional)</Label>
                        {attachedFile ? (
                            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                                <div className="flex-1 truncate text-sm">
                                    {attachedFile.name}
                                    <span className="text-xs text-muted-foreground ml-2">
                                        ({(attachedFile.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => document.getElementById('file')?.click()}
                                    type="button"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Seleccionar archivo
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        Guardar Potrero
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddPaddockDialog;
