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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User as UserIcon,
  Building2,
  Bell,
  Clock,
  Shield,
  Palette,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/header";
import { UserManagementForm } from "@/components/user-management-form";
import { ScheduleForm } from "@/components/schedule-form";
import { SecurityForm } from "@/components/security-form";
import { AppearenceForm } from "@/components/appearence-form";
import { Company, User } from "@/types";

// Mock data - En producción vendría del servidor
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Roberto Silva",
    specialization: "Médico General",
    status: "active" as const,
  },
  {
    id: "2", 
    name: "Dra. Ana García",
    specialization: "Cardiología",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Dr. Carlos Mendez",
    specialization: "Pediatría", 
    status: "active" as const,
  },
  {
    id: "4",
    name: "Dra. Laura Pérez",
    specialization: "Ginecología",
    status: "active" as const,
  },
];

const mockUsers = [
  {
    id: "1",
    fullName: "María González",
    email: "maria@clinica.com",
    phone: "+502 1234-5678",
    role: "secretaria" as const,
    status: "active" as const,
    assignedDoctors: ["1", "2"], // Dr. Roberto Silva y Dra. Ana García
    createdAt: new Date(),
  },
  {
    id: "2",
    fullName: "Rosa Morales",
    email: "rosa@clinica.com", 
    phone: "+502 9876-5432",
    role: "secretaria" as const,
    status: "active" as const,
    assignedDoctors: ["3", "4"], // Dr. Carlos Mendez y Dra. Laura Pérez
    createdAt: new Date(),
  },
];

interface SettingsPageClientProps {
  profileData: User;
  scheduleSettings: {
    timezone: string;
    workingDays: {
      monday: { enabled: boolean; start: string; end: string };
      tuesday: { enabled: boolean; start: string; end: string };
      wednesday: { enabled: boolean; start: string; end: string };
      thursday: { enabled: boolean; start: string; end: string };
      friday: { enabled: boolean; start: string; end: string };
      saturday: { enabled: boolean; start: string; end: string };
      sunday: { enabled: boolean; start: string; end: string };
    };
    appointmentDuration: number;
    bufferTime: number;
    maxAdvanceBooking: number;
  };
  securityData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
  appearanceSettings: {
    theme: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
  };
  doctors: User[];
  users: User[];
}

export function SettingsPageClient({
  profileData: initialProfileData,
  scheduleSettings: initialScheduleSettings,
  securityData: initialSecurityData,
  appearanceSettings: initialAppearanceSettings,
  doctors,
  users: initialUsers,
}: SettingsPageClientProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
  const [isLoading, setIsLoading] = useState(false);

  // State management para datos que pueden cambiar en el cliente
  const [profileData, setProfileData] = useState(initialProfileData);
  const [scheduleSettings, setScheduleSettings] = useState(
    initialScheduleSettings,
  );
  const [securityData, setSecurityData] = useState(initialSecurityData);
  const [appearanceSettings, setAppearanceSettings] = useState(
    initialAppearanceSettings,
  );
  const [users, setUsers] = useState(initialUsers);

  // Determinar el rol del usuario actual (en producción vendría de autenticación)
  const currentUserRole = initialProfileData.role.name === "Administrador" ? "admin" : "profesional";

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Handler functions - Estas deberían hacer llamadas a API
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profileData) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving profile:", profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/company', { method: 'PUT', body: JSON.stringify(company) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving business info:", profileData.company);
    } catch (error) {
      console.error("Error saving business info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUsers = async (userData: any) => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/users', { method: userData.type === 'create' ? 'POST' : 'PUT', body: JSON.stringify(userData) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving user data:", userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Reemplazar con llamada real a API  
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Deleting user:", userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSaveSchedule = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/schedule', { method: 'PUT', body: JSON.stringify(scheduleSettings) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving schedule:", scheduleSettings);
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/security', { method: 'PUT', body: JSON.stringify(securityData) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving security:", securityData);
    } catch (error) {
      console.error("Error saving security:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/appearance', { method: 'PUT', body: JSON.stringify(appearanceSettings) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving appearance:", appearanceSettings);
    } catch (error) {
      console.error("Error saving appearance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Reemplazar con llamada real a API
      // await fetch('/api/account', { method: 'DELETE' });
      console.log("Deleting account...");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleExportData = async () => {
    try {
      // TODO: Reemplazar con llamada real a API
      // const response = await fetch('/api/export');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'my-data.json';
      // a.click();
      console.log("Exporting data...");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        title="Configuración"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
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
              <UserIcon className="h-4 w-4" />
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
              value="users"
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Usuarios</span>
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
              company={profileData.company}
              onSave={handleSaveBusiness}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagementForm
              currentUserRole={currentUserRole}
              doctors={doctors}
              users={initialUsers}
              onSave={handleSaveUsers}
              onDeleteUser={handleDeleteUser}
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
            <SecurityForm
              initialData={securityData}
              onSave={handleSaveSecurity}
              isLoading={isLoading}
            />

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
            <AppearenceForm
              onSave={handleSaveAppearance}
              onExport={handleExportData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}