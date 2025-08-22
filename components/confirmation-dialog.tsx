"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Edit3,
  Trash2,
  Plus
} from "lucide-react";

type DialogVariant = 
  | "success" 
  | "warning" 
  | "danger" 
  | "info" 
  | "confirmation"
  | "create"
  | "edit"
  | "delete";

type DialogType = "notification" | "confirmation";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DialogVariant;
  type: DialogType;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    colorClasses: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    buttonVariant: "default" as const,
    defaultTitle: "¡Éxito!",
    defaultConfirmText: "Entendido"
  },
  warning: {
    icon: AlertTriangle,
    colorClasses: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
    buttonVariant: "default" as const,
    defaultTitle: "Advertencia",
    defaultConfirmText: "Continuar"
  },
  danger: {
    icon: XCircle,
    colorClasses: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    buttonVariant: "destructive" as const,
    defaultTitle: "¡Atención!",
    defaultConfirmText: "Continuar"
  },
  info: {
    icon: Info,
    colorClasses: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    buttonVariant: "default" as const,
    defaultTitle: "Información",
    defaultConfirmText: "Entendido"
  },
  confirmation: {
    icon: AlertTriangle,
    colorClasses: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
    buttonVariant: "default" as const,
    defaultTitle: "Confirmar acción",
    defaultConfirmText: "Confirmar"
  },
  create: {
    icon: Plus,
    colorClasses: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    buttonVariant: "default" as const,
    defaultTitle: "Crear cliente",
    defaultConfirmText: "Crear"
  },
  edit: {
    icon: Edit3,
    colorClasses: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    buttonVariant: "default" as const,
    defaultTitle: "Editar cliente",
    defaultConfirmText: "Guardar cambios"
  },
  delete: {
    icon: Trash2,
    colorClasses: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    buttonVariant: "destructive" as const,
    defaultTitle: "Eliminar cliente",
    defaultConfirmText: "Eliminar"
  }
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  variant,
  type,
  title,
  description,
  confirmText,
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  showCancel,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  
  // Determinar si mostrar botón cancelar
  const shouldShowCancel = showCancel !== undefined 
    ? showCancel 
    : type === "confirmation";

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${config.colorClasses}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">
                {title || config.defaultTitle}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          {shouldShowCancel && (
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
          >
            {confirmText || config.defaultConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}