"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/profile-form";
import { BusinessInfoForm } from "@/components/bussines-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Building2,
  Bell,
  Clock,
  Shield,
  Palette,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Header } from "@/components/header";
import NotificationForm from "@/components/notification-form";
import type { NotificationSettings } from "@/types";
import { ScheduleForm } from "@/components/schedule-form";

const notificationSettings: NotificationSettings = {
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

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const role = {
    id: "1",
    name: "Médico General",
    description: "Especialista en atención primaria y medicina general.",
  };
  const company = {
    id: "1",
    name: "Consultorio Dr. Silvas",
    companyType: "consultorio_medico",
    address: "Av. Principal 123, Centro",
    city: "Ciudad",
    state: "Estado",
    postalCode: "12345",
    country: "México",
    description:
      "Consultorio médico especializado en atención primaria y medicina general.",
    createdAt: new Date(),
  };
  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: "Roberto Silva",
    email: "roberto.silva@email.com",
    role: role,
    phone: "+1 (555) 123-4567",
    specialization: "Médico General",
    license: "MD-12345",
    bio: "Médico general con más de 10 años de experiencia en atención primaria.",
    avatar: "/Avatar1.png",
  });

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
  

  // Schedule settings
  const [scheduleSettings, setScheduleSettings] = useState({
    timezone: "America/Mexico_City",
    workingDays: {
      monday: { enabled: true, start: "08:00", end: "18:00" },
      tuesday: { enabled: true, start: "08:00", end: "18:00" },
      wednesday: { enabled: true, start: "08:00", end: "18:00" },
      thursday: { enabled: true, start: "08:00", end: "18:00" },
      friday: { enabled: true, start: "08:00", end: "18:00" },
      saturday: { enabled: false, start: "09:00", end: "14:00" },
      sunday: { enabled: false, start: "09:00", end: "14:00" },
    },
    appointmentDuration: 30,
    bufferTime: 15,
    maxAdvanceBooking: 30,
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 60,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    language: "es",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "MXN",
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving profile:", profileData);
    setIsLoading(false);
  };

  const handleSaveBusiness = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving business info:", company);
    setIsLoading(false);
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving notifications:", notificationSettings);
    setIsLoading(false);
  };

  const handleSaveSchedule = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving schedule:", scheduleSettings);
    setIsLoading(false);
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving security:", securityData);
    setIsLoading(false);
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving appearance:", appearanceSettings);
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    console.log("Deleting account...");
  };

  const handleExportData = async () => {
    console.log("Exporting data...");
  };

  const timezones = [
    { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
    { value: "America/Cancun", label: "Cancún (GMT-5)" },
    { value: "America/Tijuana", label: "Tijuana (GMT-8)" },
    { value: "America/New_York", label: "Nueva York (GMT-5)" },
    { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8)" },
  ];

  const languages = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "pt", label: "Português" },
  ];

  const currencies = [
    { value: "MXN", label: "Peso Mexicano (MXN)" },
    { value: "USD", label: "Dólar Americano (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "CAD", label: "Dólar Canadiense (CAD)" },
  ];

  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Configuración"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
        user={{
          name: "Dr. Roberto Silva",
          email: "roberto.silva@email.com",
          role: "Médico General",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DR",
        }}
        notifications={{
          count: 3,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger
              value="business"
              className="flex items-center space-x-2"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Negocio</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center space-x-2"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apariencia</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileForm
              initialData={profileData}
              onSave={handleSaveProfile}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <BusinessInfoForm
              company={company}
              onSave={handleSaveBusiness}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
                <NotificationForm
                  initialSettings={notificationSettings}
                  onSave={handleSaveNotifications}
                  isLoading={isLoading}
                />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">

            <ScheduleForm
              initialSettings={scheduleSettings}
              onSave={handleSaveSchedule}
              isLoading={isLoading}
            />

          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
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
                      <Label htmlFor="sessionTimeout">
                        Tiempo de Sesión (minutos)
                      </Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securityData.sessionTimeout}
                        onChange={(e) =>
                          setSecurityData({
                            ...securityData,
                            sessionTimeout: Number.parseInt(e.target.value),
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

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                <CardDescription>
                  Acciones irreversibles para tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-600">
                      Eliminar Cuenta
                    </h4>
                    <p className="text-sm text-gray-500">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Cuenta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente tu cuenta y
                          todos los datos asociados. Esta acción no se puede
                          deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar Cuenta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia y Localización</CardTitle>
                <CardDescription>
                  Personaliza la apariencia y configuración regional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Tema</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${
                        appearanceSettings.theme === "light"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "light",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <span>Claro</span>
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${
                        appearanceSettings.theme === "dark"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "dark",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <span>Oscuro</span>
                      </div>
                    </div>
                    <div
                      className={`p-4 border rounded-lg cursor-pointer ${
                        appearanceSettings.theme === "system"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: "system",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>Sistema</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={appearanceSettings.language}
                      onValueChange={(value) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          language: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select
                      value={appearanceSettings.currency}
                      onValueChange={(value) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Fecha</Label>
                    <Select
                      value={appearanceSettings.dateFormat}
                      onValueChange={(value) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          dateFormat: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Formato de Hora</Label>
                    <Select
                      value={appearanceSettings.timeFormat}
                      onValueChange={(value) =>
                        setAppearanceSettings({
                          ...appearanceSettings,
                          timeFormat: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Exportar Datos</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">Descargar Datos</h5>
                      <p className="text-sm text-gray-500">
                        Exporta todos tus datos en formato JSON
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAppearance} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
