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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import type { SecurityData, SecurityFormProps } from "@/types";

// Componente SecurityForm
export const SecurityForm: React.FC<SecurityFormProps> = ({
  initialData = {},
  onSave,
  isLoading = false,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    ...initialData,
  });

  const handleSaveSecurity = () => {
    if (onSave) {
      onSave(securityData);
    }
  };

  return (
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Autenticación de Dos Factores</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Habilitar 2FA</Label>
              <p className="text-sm text-gray-500">
                Agrega una capa extra de seguridad a tu cuenta
              </p>
            </div>
            <Switch
              checked={securityData.twoFactorEnabled}
              onCheckedChange={(checked) =>
                setSecurityData({
                  ...securityData,
                  twoFactorEnabled: checked,
                })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Configuración de Sesión</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Inicio de Sesión</Label>
                <p className="text-sm text-gray-500">
                  Recibir notificaciones de nuevos inicios de sesión
                </p>
              </div>
              <Switch
                checked={securityData.loginAlerts}
                onCheckedChange={(checked) =>
                  setSecurityData({
                    ...securityData,
                    loginAlerts: checked,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securityData.sessionTimeout}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    sessionTimeout: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="w-32"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSecurity} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
