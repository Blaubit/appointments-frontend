import React from "react";
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
import { CheckCircle } from "lucide-react";

interface AppointmentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToAppointments: () => void;
}

export const AppointmentSuccessDialog: React.FC<AppointmentSuccessDialogProps> = ({
  isOpen,
  onClose,
  onGoToAppointments,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDialogTitle className="text-green-700">¡Cita confirmada!</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>
                <strong className="text-green-700">¡Listo!</strong> Tu cita ha sido registrada exitosamente.
              </div>
              <div>
                Puedes ver el detalle en la sección de tus citas.
              </div>
              <div className="text-sm text-green-600">
                ¡Nos vemos pronto!
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cerrar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onGoToAppointments}
            className="bg-green-600 hover:bg-green-700"
          >
            Ir a mis citas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};