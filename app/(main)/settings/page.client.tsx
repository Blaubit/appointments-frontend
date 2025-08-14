"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
import { Role, User } from "@/types";

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
  roles: Role[];
  usersMeta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export function SettingsPageClient({
  profileData: initialProfileData,
  scheduleSettings: initialScheduleSettings,
  securityData: initialSecurityData,
  appearanceSettings: initialAppearanceSettings,
  doctors,
  users: initialUsers,
  roles,
  usersMeta,
}: SettingsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const tabFromUrl = searchParams.get("tab");
  const pageFromUrl = parseInt(searchParams.get("page") || "1");
  
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

  // Función para actualizar URL con parámetros - ORDEN CORRECTO: tab primero, luego page
  const updateUrlParams = (params: Record<string, string | number>) => {
    const current = new URLSearchParams();
    
    // Siempre mantener el tab como primer parámetro
    const tab = params.tab?.toString() || activeTab;
    current.set("tab", tab);
    
    // Agregar page solo si es mayor a 1 y estamos en el tab de users
    if (tab === "users" && params.page && Number(params.page) > 1) {
      current.set("page", params.page.toString());
    }
    
    // Agregar otros parámetros si existen
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "tab" && key !== "page" && value) {
        current.set(key, value.toString());
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    router.push(`${pathname}${query}`);
  };

  // Función para cambiar página - Esta función causará una recarga del servidor
  const handlePageChange = (newPage: number) => {
    console.log("Changing to page:", newPage);
    updateUrlParams({ tab: activeTab, page: newPage });
  };

  // Función para cambiar tab y resetear página
  const handleTabChange = (newTab: string) => {
    console.log("Changing to tab:", newTab);
    setActiveTab(newTab);
    if (newTab === "users") {
      updateUrlParams({ tab: newTab, page: 1 });
    } else {
      updateUrlParams({ tab: newTab });
    }
  };

  // Handler functions - Estas deberían hacer llamadas a API
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real a API
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Deleting user:", userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSaveSchedule = async () => {
    setIsLoading(true);
    try {
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
      console.log("Deleting account...");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleExportData = async () => {
    try {
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
          onValueChange={handleTabChange}
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
              roles={roles}
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
              users={users}
              onSave={handleSaveUsers}
              onDeleteUser={handleDeleteUser}
              isLoading={isLoading}
              roles={roles}
              // Props para paginación del backend
              currentPage={usersMeta?.currentPage || 1}
              onPageChange={handlePageChange}
              meta={usersMeta}
              // Indicar que la paginación es del backend
              useBackendPagination={true}
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