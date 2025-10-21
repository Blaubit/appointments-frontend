"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { BusinessInfoForm } from "@/components/settings/bussines-form";

import {
  User as UserIcon,
  Building2,
  Users,
  Clock,
  Shield,
  Palette,
} from "lucide-react";
import { Header } from "@/components/header";
import { UserManagementForm } from "@/components/settings/user-management-form";
import { ScheduleForm } from "@/components/settings/schedule-form";
import { SecurityForm } from "@/components/settings/security-form";
import { AppearenceForm } from "@/components/settings/appearence-form";
import {
  Role,
  User,
  Company,
  Pagination,
  ScheduleSettings,
  SecurityData,
} from "@/types";
import { findAll as findAllUsers } from "@/actions/user/findAll";
import { changePassword } from "@/actions/auth/change-password";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/actions/auth/logout";

interface SettingsPageClientProps {
  profileData: User;
  scheduleSettings: ScheduleSettings;
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
  usersMeta?: Pagination;
}

const TAB_PERMISSIONS = {
  profile: ["admin_empresa", "profesional", "secretaria", "super_admin"],
  business: ["admin_empresa", "profesional", "secretaria", "super_admin"],
  users: ["admin_empresa", "super_admin"],
  schedule: ["admin_empresa", "super_admin", "profesional"],
  security: ["admin_empresa", "super_admin"],
  appearance: ["admin_empresa", "profesional", "secretaria", "super_admin"],
} as const;

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
  usersMeta: initialUsersMeta,
}: SettingsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const tabFromUrl = searchParams.get("tab");
  const pageFromUrl = parseInt(searchParams.get("page") || "1");
  const qValue = searchParams.get("q") || "";
  const roleValue = searchParams.get("role") || "";

  const [isLoading, setIsLoading] = useState(false);

  // State management para datos que pueden cambiar en el cliente
  const [profileData, setProfileData] = useState(initialProfileData);
  const [scheduleSettings, setScheduleSettings] = useState(
    initialScheduleSettings
  );
  const [securityData, setSecurityData] = useState(initialSecurityData);
  const [appearanceSettings, setAppearanceSettings] = useState(
    initialAppearanceSettings
  );

  // Para paginación de usuarios
  const [users, setUsers] = useState(initialUsers);
  const [usersMeta, setUsersMeta] = useState(initialUsersMeta);

  // Obtener el rol del usuario actual
  const currentUserRole = initialProfileData?.role?.name || "";

  const hasPermissionForTab = (tabId: string): boolean => {
    const tabConfig = TAB_CONFIG.find((tab) => tab.id === tabId);
    if (!tabConfig) return false;
    return tabConfig.permissions.includes(currentUserRole as any);
  };

  const canEdit = (): boolean => {
    return ["admin_empresa", "super_admin"].includes(currentUserRole);
  };

  const allowedTabs = useMemo(() => {
    return TAB_CONFIG.filter((tab) => hasPermissionForTab(tab.id));
  }, [currentUserRole]);

  const defaultTab = useMemo(() => {
    return allowedTabs.length > 0 ? allowedTabs[0].id : "profile";
  }, [allowedTabs]);

  const [activeTab, setActiveTab] = useState(() => {
    if (tabFromUrl && hasPermissionForTab(tabFromUrl)) {
      return tabFromUrl;
    }
    return defaultTab;
  });

  useEffect(() => {
    if (tabFromUrl && hasPermissionForTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl && !hasPermissionForTab(tabFromUrl)) {
      // Si el usuario intenta acceder a un tab no permitido, redirigir al default
      console.warn(
        `Usuario sin permisos para el tab: ${tabFromUrl}. Redirigiendo a: ${defaultTab}`
      );
      updateUrlParams({ tab: defaultTab });
    }
  }, [tabFromUrl, defaultTab]);

  const updateUrlParams = (params: Record<string, string | number>) => {
    const current = new URLSearchParams(searchParams.toString());

    const tab = params.tab?.toString() || activeTab;
    current.set("tab", tab);

    // Solo mantener page si está en users
    if (tab === "users" && params.page && Number(params.page) > 1) {
      current.set("page", params.page.toString());
    } else {
      current.delete("page");
    }

    // Mantener q y role si existen
    if (tab === "users") {
      if (params.q !== undefined) {
        if (params.q) current.set("q", params.q.toString());
        else current.delete("q");
      }
      if (params.role !== undefined) {
        if (params.role) current.set("role", params.role.toString());
        else current.delete("role");
      }
    }

    Object.entries(params).forEach(([key, value]) => {
      if (
        key !== "tab" &&
        key !== "page" &&
        key !== "q" &&
        key !== "role" &&
        value
      ) {
        current.set(key, value.toString());
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  // Cambia la página y mantiene los filtros
  const handlePageChange = (newPage: number) => {
    updateUrlParams({
      tab: activeTab,
      page: newPage,
      q: qValue,
      role: roleValue,
    });
  };

  // Cambia el tab y reinicia los filtros de users
  const handleTabChange = (newTab: string) => {
    if (!hasPermissionForTab(newTab)) {
      console.warn(`Usuario sin permisos para acceder al tab: ${newTab}`);
      return;
    }
    setActiveTab(newTab);
    if (newTab === "users") {
      updateUrlParams({ tab: newTab, page: 1, q: "", role: "" });
    } else {
      updateUrlParams({ tab: newTab });
    }
  };

  // Actualiza usuarios desde el backend cuando cambia page, q, role o tab
  useEffect(() => {
    async function fetchUsers(page: number, q: string, role: string) {
      setIsLoading(true);
      try {
        // El backend debe aceptar q y role como parámetros
        const result = await findAllUsers({
          page,
          limit: usersMeta?.itemsPerPage || 10,
          q,
          role,
        });
        if (result && result.data) {
          setUsers(result.data);
          setUsersMeta(result.meta);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (activeTab === "users") {
      fetchUsers(pageFromUrl, qValue, roleValue);
    }
  }, [pageFromUrl, qValue, roleValue, activeTab]);

  // Handler functions para guardar cambios
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBusiness = async (
    companyData: Omit<Company, "id" | "createdAt">
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfileData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          ...companyData,
        },
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
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSaveSchedule = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async (securityFormData: SecurityData) => {
    setIsLoading(true);
    try {
      // Validar que las contraseñas coincidan
      if (securityFormData.newPassword !== securityFormData.confirmPassword) {
        toast({
          title: "Error de validación",
          description: "Las contraseñas nuevas no coinciden",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Llamar a la action changePassword
      const response = await changePassword({
        currentPassword: securityFormData.currentPassword,
        newPassword: securityFormData.newPassword,
      });

      // Validar que la respuesta sea exitosa (status entre 200-299)
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Éxito",
          description:
            "Contraseña cambiada correctamente. Se cerrará tu sesión por seguridad.",
          variant: "default",
        });

        // Limpiar el formulario antes de cerrar sesión
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          twoFactorEnabled: false,
          loginAlerts: true,
          sessionTimeout: 30,
        });

        // Esperar un poco antes de cerrar sesión para que el usuario vea el mensaje
        setTimeout(async () => {
          await logout();
        }, 2000);
      } else {
        // Error en la respuesta
        toast({
          title: "Error",
          description: response.message || "Error al cambiar la contraseña",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cambiar la contraseña";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Error saving security:", error);
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
              <BusinessInfoForm
                company={profileData.company}
                onSave={handleSaveBusiness}
                isLoading={isLoading}
                canEdit={canEdit()}
              />
            </TabsContent>
          )}

          {/* Users Management Tab */}
          {hasPermissionForTab("users") && (
            <TabsContent value="users" className="space-y-6">
              <UserManagementForm
                currentUserRole={
                  currentUserRole === "admin_empresa" ? "admin" : "profesional"
                }
                doctors={doctors}
                users={users}
                onSave={handleSaveUsers}
                onDeleteUser={handleDeleteUser}
                isLoading={isLoading}
                roles={roles}
                currentPage={usersMeta?.currentPage || pageFromUrl || 1}
                onPageChange={handlePageChange}
                meta={usersMeta}
                useBackendPagination={true}
                canEdit={canEdit()}
              />
            </TabsContent>
          )}

          {/* Schedule Tab */}
          {hasPermissionForTab("schedule") && (
            <TabsContent value="schedule" className="space-y-6">
              <ScheduleForm
                professionals={doctors}
                initialSettings={scheduleSettings}
                userSession={profileData}
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
