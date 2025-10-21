import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import type { SecurityData, SecurityFormProps } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { LogoutWarningDialog } from "@/components/settings/logout-warning-dialog";

// Componente SecurityForm
export const SecurityForm: React.FC<SecurityFormProps> = ({
  initialData = {},
  onSave,
  isLoading = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLogoutWarning, setShowLogoutWarning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    ...initialData,
  });

  const validatePasswords = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!securityData.currentPassword.trim()) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }

    if (!securityData.newPassword.trim()) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    }

    if (securityData.newPassword.length < 6) {
      newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (securityData.currentPassword === securityData.newPassword) {
      newErrors.newPassword =
        "La nueva contraseña no puede ser igual a la actual";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSecurity = async () => {
    if (!validatePasswords()) {
      toast({
        title: "Error de validación",
        description: "Por favor revisa los campos",
        variant: "destructive",
      });
      return;
    }

    // Mostrar el popup de advertencia
    setShowLogoutWarning(true);
  };

  const handleContinueWithLogout: any = async (): Promise<void> => {
    setIsSaving(true);
    setShowLogoutWarning(false);

    try {
      if (onSave) {
        await onSave(securityData);
      }
    } catch (error) {
      console.error("Error saving security:", error);
      setIsSaving(false);
    }
  };

  const handleCancelWarning = (): void => {
    setShowLogoutWarning(false);
  };

  const clearForm = () => {
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30,
    });
    setErrors({});
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Seguridad de la Cuenta</CardTitle>
          <CardDescription>
            Gestiona la seguridad y privacidad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Cambiar Contraseña</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        currentPassword: e.target.value,
                      })
                    }
                    className={errors.currentPassword ? "border-red-500" : ""}
                    disabled={isLoading || isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isSaving}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {errors.currentPassword}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        newPassword: e.target.value,
                      })
                    }
                    className={errors.newPassword ? "border-red-500" : ""}
                    disabled={isLoading || isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading || isSaving}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    disabled={isLoading || isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || isSaving}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={clearForm}
              disabled={isLoading || isSaving}
            >
              Limpiar
            </Button>
            <Button
              onClick={handleSaveSecurity}
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Warning Dialog */}
      <LogoutWarningDialog
        isOpen={showLogoutWarning}
        onClose={handleCancelWarning}
        onContinue={handleContinueWithLogout}
      />
    </>
  );
};
