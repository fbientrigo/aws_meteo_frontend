import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Edit3,
    Trash2,
    Search,
    Calendar,
    User,
    StickyNote,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

const HistoryTab = () => {
    const polygonHistory = useAppStore((state) => state.polygonHistory);
    const deleteFromHistory = useAppStore((state) => state.deleteFromHistory);
    const setEditingPolygon = useAppStore((state) => state.setEditingPolygon);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'parcel' | 'paddock'>('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<string | null>(null);

    // Filter and search
    const filteredHistory = polygonHistory
        .filter(entry => {
            if (filterType !== 'all' && entry.type !== filterType) return false;
            if (searchQuery && !entry.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleEditInMap = (id: string) => {
        setEditingPolygon(id);
        toast.info('Modo edición activado. Haz clic en el polígono en el mapa para editarlo.');
    };

    const handleDelete = (id: string) => {
        const entry = polygonHistory.find(e => e.id === id);
        if (!entry) return;

        // Check if it's a parcel with paddocks
        if (entry.type === 'parcel') {
            const paddockCount = polygonHistory.filter(e => e.parentId === id).length;
            if (paddockCount > 0) {
                toast.warning(`Este predio tiene ${paddockCount} potrero(s). Se eliminarán todos.`);
            }
        }

        setSelectedForDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedForDelete) return;

        deleteFromHistory(selectedForDelete);
        toast.success('Polígono eliminado del historial');
        setDeleteDialogOpen(false);
        setSelectedForDelete(null);
    };

    if (polygonHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <MapPin className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
                <h3 className="font-semibold text-lg mb-1">Sin historial</h3>
                <p className="text-sm text-muted-foreground">
                    Los polígonos que crees aparecerán aquí
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="flex-1"
                    >
                        Todos ({polygonHistory.length})
                    </Button>
                    <Button
                        variant={filterType === 'parcel' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('parcel')}
                        className="flex-1"
                    >
                        Predios ({polygonHistory.filter(e => e.type === 'parcel').length})
                    </Button>
                    <Button
                        variant={filterType === 'paddock' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('paddock')}
                        className="flex-1"
                    >
                        Potreros ({polygonHistory.filter(e => e.type === 'paddock').length})
                    </Button>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
                {filteredHistory.map((entry) => (
                    <Card key={entry.id} className="overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant={entry.type === 'parcel' ? 'default' : 'secondary'}>
                                            {entry.type === 'parcel' ? 'Predio' : 'Potrero'}
                                        </Badge>
                                        <h4 className="font-semibold truncate">{entry.name}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {entry.area.toFixed(2)} ha
                                    </p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{entry.createdBy}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{format(new Date(entry.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</span>
                                </div>
                                {entry.notes && (
                                    <div className="flex items-start gap-1.5">
                                        <StickyNote className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{entry.notes}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditInMap(entry.id)}
                                    className="flex-1 gap-2"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(entry.id)}
                                    className="gap-2 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Eliminar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Confirmar Eliminación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El polígono será eliminado permanentemente del mapa y del historial.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default HistoryTab;
