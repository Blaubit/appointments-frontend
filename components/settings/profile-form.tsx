import React, { useState } from "react";
import type { User, Role, Company } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User as UserIcon, Edit, X, Save } from "lucide-react";
import { AvatarSelector } from "@/components/settings/avatar-selector";
import { updateProfile } from "@/actions/user/update";
//import { logout } from "@/actions/auth/logout";
import { LogoutWarningDialog } from "@/components/settings/logout-warning-dialog";

interface ProfileFormProps {
  initialData?: Partial<User>;
  onSave?: (userData: Partial<User>) => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  roles?: Role[];
  canEdit?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {},
  onSave = () => {},
  isLoading = false,
  title = "Información Personal",
  description = "Actualiza tu información personal y profesional",
  roles = [],
  canEdit = true,
}) => {
  const [profileData, setProfileData] = useState<Partial<User>>({
    id: "",
    fullName: "",
    email: "",
    bio: "",
    avatar: "",
    createdAt: "",
    company: undefined,
    role: {
      id: "",
      name: "",
      description: "",
    },
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAvatarSelector, setShowAvatarSelector] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<Partial<User>>(profileData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.fullName?.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!profileData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!profileData.role?.id?.trim()) {
      newErrors.roleId = "El rol es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string): void => {
    if (field.startsWith("company.")) {
      const companyField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        companyId: value,
      }));
    } else if (field.startsWith("role.")) {
      const roleField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        role: {
          ...prev.role!,
          [roleField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRoleChange = (roleId: string): void => {
    const selectedRole = roles.find((role) => role.id === roleId);
    if (selectedRole) {
      setProfileData((prev) => ({
        ...prev,
        role: {
          id: selectedRole.id,
          name: selectedRole.name,
          description: selectedRole.description || "",
        },
      }));

      // Clear error when user selects a role
      if (errors.roleId) {
        setErrors((prev) => ({ ...prev, roleId: "" }));
      }
    }
  };

  const handleAvatarChange = (): void => {
    // Solo permitir cambiar avatar si está en modo edición y tiene permisos
    if (!isEditing || !canEdit) {
      return;
    }
    setShowAvatarSelector(true);
  };

  const handleAvatarSelect = (avatarUrl: string): void => {
    // Solo actualizar el estado local, sin guardar automáticamente
    setProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
    setShowAvatarSelector(false);
  };

  const handleEditToggle = (): void => {
    if (!canEdit) {
      return;
    }

    if (isEditing) {
      // Cancelar edición - restaurar todos los datos originales (incluyendo avatar)
      setProfileData(originalData);
      setErrors({});
    } else {
      // Habilitar edición - guardar estado actual como respaldo
      setOriginalData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (): void => {
    if (!canEdit) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Mostrar el popup de advertencia
    setShowLogoutWarning(true);
  };

  const handleContinueWithLogout = async (): Promise<void> => {
    if (!profileData.id) {
      console.error("User ID is required for update");
      return;
    }

    setIsSaving(true);
    setShowLogoutWarning(false);

    try {
      const result = await updateProfile({
        userId: profileData.id,
        email: profileData.email,
        avatar: profileData.avatar,
        fullName: profileData.fullName,
        bio: profileData.bio,
        roleId: profileData.role?.id,
      });

      if ("data" in result) {
        // Éxito - pero no actualizar el estado porque vamos a cerrar sesión
        console.log(
          "Profile updated successfully, logging out for security:",
          result.data,
        );

        // Cerrar sesión por seguridad
        //await logout();
      } else {
        // Error en la actualización
        console.error("Error updating profile:", result.message);
        setIsSaving(false);
        // Aquí puedes mostrar un toast de error
        // toast.error(result.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsSaving(false);
      // toast.error("Error inesperado al actualizar el perfil");
    }
  };

  const handleCancelWarning = (): void => {
    setShowLogoutWarning(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.avatar || "/Avatar1.png"} />
                <AvatarFallback className="text-lg">
                  {profileData.fullName
                    ? profileData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarChange}
                  disabled={!isEditing || !canEdit}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Cambiar Avatar
                </Button>
                <p className="text-sm text-gray-500">
                  {isEditing && canEdit
                    ? "Selecciona un avatar predeterminado."
                    : !canEdit
                      ? "No tienes permisos para editar el perfil."
                      : "Habilita el modo edición para cambiar el avatar."}
                </p>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className={errors.fullName ? "border-red-500" : ""}
                  disabled={!isEditing || !canEdit}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("email", e.target.value)
                  }
                  className={errors.email ? "border-red-500" : ""}
                  disabled={!isEditing || !canEdit}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={profileData.role?.id || ""}
                  onValueChange={handleRoleChange}
                  disabled={!isEditing || !canEdit}
                >
                  <SelectTrigger
                    className={errors.roleId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && (
                  <p className="text-sm text-red-500">{errors.roleId}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía Personal</Label>
              <Textarea
                id="bio"
                value={profileData.bio || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange("bio", e.target.value)
                }
                placeholder="Describe tu experiencia y especialidades..."
                rows={4}
                disabled={!isEditing || !canEdit}
              />
            </div>

            {/* Mensaje cuando no tiene permisos */}
            {!canEdit && (
              <div className="bg-red-500 border border-red-200 rounded-md p-4">
                <p className="text-sm text-white-800">
                  <strong>Información:</strong> No tienes permisos para editar
                  la información del perfil.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Avatar Selector Modal */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={profileData.avatar}
      />

      {/* Logout Warning Dialog */}
      <LogoutWarningDialog
        isOpen={showLogoutWarning}
        onClose={handleCancelWarning}
        onContinue={handleContinueWithLogout}
      />
    </>
  );
};
