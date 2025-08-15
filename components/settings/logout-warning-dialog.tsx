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
import { AlertTriangle } from "lucide-react";

interface LogoutWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const LogoutWarningDialog: React.FC<LogoutWarningDialogProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Advertencia de Seguridad</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>
                <strong>¡Atención!</strong> Al guardar cambios en tu perfil, tu sesión actual será cerrada por motivos de seguridad.
              </div>
              <div>
                Después de guardar los cambios, tendrás que iniciar sesión nuevamente con tus credenciales.
              </div>
              <div className="text-sm text-gray-600">
                Esto es necesario para mantener la integridad y seguridad de tu cuenta.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onContinue}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Continuar y Cerrar Sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};