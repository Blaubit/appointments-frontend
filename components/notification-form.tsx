import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { NotificationFormProps, NotificationSettings } from "@/types";

// Configuración inicial por defecto
const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: false,
  smsNotifications: false,
  pushNotifications: false,
  appointmentReminders: false,
  appointmentConfirmations: false,
  cancellationAlerts: false,
  dailyReports: false,
  weeklyReports: false,
  marketingEmails: false,
};

export default function NotificationForm({
  initialSettings = defaultNotificationSettings,
  onSave,
  isLoading = false,
}: NotificationFormProps) {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(initialSettings);

  const handleSaveNotifications = async () => {
    try {
      await onSave(notificationSettings);
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Configuración de Notificaciones</CardTitle>
        <CardDescription>
          Personaliza cómo y cuándo recibir notificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canales de Notificación */}
        <div className="space-y-4">
          <h4 className="font-medium">Canales de Notificación</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-500">
                  Recibir notificaciones en tu correo electrónico
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por SMS</Label>
                <p className="text-sm text-gray-500">
                  Recibir notificaciones por mensaje de texto
                </p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("smsNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-gray-500">
                  Recibir notificaciones en el navegador
                </p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("pushNotifications", checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Tipos de Notificación */}
        <div className="space-y-4">
          <h4 className="font-medium">Tipos de Notificación</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de Citas</Label>
                <p className="text-sm text-gray-500">
                  Recordatorios automáticos antes de las citas
                </p>
              </div>
              <Switch
                checked={notificationSettings.appointmentReminders}
                onCheckedChange={(checked) =>
                  updateSetting("appointmentReminders", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmaciones de Citas</Label>
                <p className="text-sm text-gray-500">
                  Notificaciones cuando se confirman citas
                </p>
              </div>
              <Switch
                checked={notificationSettings.appointmentConfirmations}
                onCheckedChange={(checked) =>
                  updateSetting("appointmentConfirmations", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Cancelación</Label>
                <p className="text-sm text-gray-500">
                  Notificaciones cuando se cancelan citas
                </p>
              </div>
              <Switch
                checked={notificationSettings.cancellationAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("cancellationAlerts", checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Reportes */}
        <div className="space-y-4">
          <h4 className="font-medium">Reportes</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reportes Diarios</Label>
                <p className="text-sm text-gray-500">
                  Resumen diario de actividad
                </p>
              </div>
              <Switch
                checked={notificationSettings.dailyReports}
                onCheckedChange={(checked) =>
                  updateSetting("dailyReports", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reportes Semanales</Label>
                <p className="text-sm text-gray-500">
                  Resumen semanal de estadísticas
                </p>
              </div>
              <Switch
                checked={notificationSettings.weeklyReports}
                onCheckedChange={(checked) =>
                  updateSetting("weeklyReports", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emails de Marketing</Label>
                <p className="text-sm text-gray-500">
                  Noticias y actualizaciones del producto
                </p>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) =>
                  updateSetting("marketingEmails", checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveNotifications} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
