"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ProfileForm } from "@/components/settings/profile-form";
import { BusinessInfoForm } from "@/components/settings/bussines-form";
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
  Users,
  Clock,
  Shield,
  Palette,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/header";
import { UserManagementForm } from "@/components/settings/user-management-form";
import { ScheduleForm } from "@/components/settings/schedule-form";
import { SecurityForm } from "@/components/settings/security-form";
import { AppearenceForm } from "@/components/settings/appearence-form";
import { Role, User, Company } from "@/types";

interface SettingsPageClientProps {
  profileData: User & { company?: Company };
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

// Configuración de permisos por tab
const TAB_PERMISSIONS = {
  profile: ["admin_empresa", "profesional", "secretaria", "super_admin"],
  business: ["admin_empresa", "profesional", "secretaria", "super_admin"],
  users: ["admin_empresa", "super_admin"],
  schedule: ["admin_empresa", "super_admin", "profesional"],
  security: ["admin_empresa", "super_admin"],
  appearance: ["admin_empresa", "profesional", "secretaria", "super_admin"],
} as const;

// Definición de tabs con sus configuraciones
const TAB_CONFIG = [
  {
    id: "profile",
    label: "Perfil",
    icon: UserIcon,
    permissions: TAB_PERMISSIONS.profile,
  },
  {
    id: "business",
    label: "Negocio",
    icon: Building2,
    permissions: TAB_PERMISSIONS.business,
  },
  {
    id: "users",
    label: "Usuarios",
    icon: Users,
    permissions: TAB_PERMISSIONS.users,
  },
  {
    id: "schedule",
    label: "Horarios",
    icon: Clock,
    permissions: TAB_PERMISSIONS.schedule,
  },
  {
    id: "security",
    label: "Seguridad",
    icon: Shield,
    permissions: TAB_PERMISSIONS.security,
  },
  {
    id: "appearance",
    label: "Apariencia",
    icon: Palette,
    permissions: TAB_PERMISSIONS.appearance,
  },
] as const;

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

  // Obtener el rol del usuario actual
  const currentUserRole = initialProfileData?.role?.name || "";

  // Función para verificar si el usuario tiene permiso para ver un tab
  const hasPermissionForTab = (tabId: string): boolean => {
    const tabConfig = TAB_CONFIG.find(tab => tab.id === tabId);
    if (!tabConfig) return false;
    
    return tabConfig.permissions.includes(currentUserRole as any);
  };

  // Función para verificar si el usuario puede editar
  const canEdit = (): boolean => {
    return ["admin_empresa", "super_admin"].includes(currentUserRole);
  };

  // Filtrar tabs según permisos del usuario
  const allowedTabs = useMemo(() => {
    return TAB_CONFIG.filter(tab => hasPermissionForTab(tab.id));
  }, [currentUserRole]);

  // Determinar el primer tab permitido como default
  const defaultTab = useMemo(() => {
    return allowedTabs.length > 0 ? allowedTabs[0].id : "profile";
  }, [allowedTabs]);

  // Estado del tab activo con validación de permisos
  const [activeTab, setActiveTab] = useState(() => {
    if (tabFromUrl && hasPermissionForTab(tabFromUrl)) {
      return tabFromUrl;
    }
    return defaultTab;
  });

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl && hasPermissionForTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl && !hasPermissionForTab(tabFromUrl)) {
      // Si el usuario intenta acceder a un tab no permitido, redirigir al default
      console.warn(`Usuario sin permisos para el tab: ${tabFromUrl}. Redirigiendo a: ${defaultTab}`);
      updateUrlParams({ tab: defaultTab });
    }
  }, [tabFromUrl, defaultTab]);

  // Función para actualizar URL con parámetros
  const updateUrlParams = (params: Record<string, string | number>) => {
    const current = new URLSearchParams();
    
    const tab = params.tab?.toString() || activeTab;
    current.set("tab", tab);
    
    if (tab === "users" && params.page && Number(params.page) > 1) {
      current.set("page", params.page.toString());
    }
    
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "tab" && key !== "page" && value) {
        current.set(key, value.toString());
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    router.push(`${pathname}${query}`);
  };

  // Función para cambiar página
  const handlePageChange = (newPage: number) => {

    updateUrlParams({ tab: activeTab, page: newPage });
  };

  // Función para cambiar tab con validación de permisos
  const handleTabChange = (newTab: string) => {
    if (!hasPermissionForTab(newTab)) {
      console.warn(`Usuario sin permisos para acceder al tab: ${newTab}`);
      return;
    }
    setActiveTab(newTab);
    if (newTab === "users") {
      updateUrlParams({ tab: newTab, page: 1 });
    } else {
      updateUrlParams({ tab: newTab });
    }
  };

  // Handler functions
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving profile:", profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBusiness = async (companyData: Omit<Company, "id" | "createdAt">) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving business info:", companyData);
      
      setProfileData(prev => ({
        ...prev,
        company: prev.company ? {
          ...prev.company,
          ...companyData,
        } : undefined,
      }));
      
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
            {allowedTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Profile Tab */}
          {hasPermissionForTab("profile") && (
            <TabsContent value="profile" className="space-y-6">
              <ProfileForm
                initialData={profileData}
                onSave={handleSaveProfile}
                isLoading={isLoading}
                roles={roles}
                canEdit={canEdit()}
              />
            </TabsContent>
          )}

          {/* Business Tab */}
          {hasPermissionForTab("business") && (
            <TabsContent value="business" className="space-y-6">
              {profileData.company ? (
                <BusinessInfoForm
                  company={profileData.company}
                  onSave={handleSaveBusiness}
                  isLoading={isLoading}
                  canEdit={canEdit()} // <- Props agregada correctamente
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Negocio</CardTitle>
                    <CardDescription>
                      No se encontró información de la empresa asociada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Por favor, contacta al administrador para configurar la información de tu empresa.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* Users Management Tab */}
          {hasPermissionForTab("users") && (
            <TabsContent value="users" className="space-y-6">
              <UserManagementForm
                currentUserRole={currentUserRole === "admin_empresa" ? "admin" : "profesional"}
                doctors={doctors}
                users={users}
                onSave={handleSaveUsers}
                onDeleteUser={handleDeleteUser}
                isLoading={isLoading}
                roles={roles}
                currentPage={usersMeta?.currentPage || 1}
                onPageChange={handlePageChange}
                meta={usersMeta}
                useBackendPagination={true}
                canEdit={canEdit()} // <- Props agregada correctamente
              />
            </TabsContent>
          )}

          {/* Schedule Tab */}
          {hasPermissionForTab("schedule") && (
            <TabsContent value="schedule" className="space-y-6">
              <ScheduleForm
                initialSettings={scheduleSettings}
                onSave={handleSaveSchedule}
                isLoading={isLoading}
              />
            </TabsContent>
          )}

          {/* Security Tab */}
          {hasPermissionForTab("security") && (
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
          )}

          {/* Appearance Tab */}
          {hasPermissionForTab("appearance") && (
            <TabsContent value="appearance" className="space-y-6">
              <AppearenceForm
                onSave={handleSaveAppearance}
                onExport={handleExportData}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}