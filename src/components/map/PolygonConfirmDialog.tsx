import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DrawnPolygon } from "@/store/useAppStore";
import { Check, Edit2, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

interface PolygonConfirmDialogProps {
  open: boolean;
  polygon: DrawnPolygon | null;
  onApprove: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

const PolygonConfirmDialog = ({
  open,
  polygon,
  onApprove,
  onEdit,
  onCancel,
}: PolygonConfirmDialogProps) => {
  if (!polygon) return null;

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <MapPin className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-xl font-bold">
                Polígono Creado
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm mt-1">
                ¿Qué deseas hacer con este polígono?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Action Buttons */}
        <AlertDialogFooter className="flex flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex-1 gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Button>
          <Button
            onClick={onApprove}
            className="flex-1 gap-2"
          >
            <Check className="w-4 h-4" />
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PolygonConfirmDialog;
