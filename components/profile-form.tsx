import React, { useState } from "react";
import type { User } from "@/types/user";
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
import { AvatarSelector } from "@/components/avatar-selector";
import { useUser } from "@/hooks/useUser";
import { useUserContext } from "@/contexts/user-context";
import { AlertCircle } from "lucide-react";

interface ProfileFormProps {
  initialData?: Partial<User>;
  onSave?: (userData: Partial<User>) => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  mockUser?: User | null; // For testing purposes
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData = {},
  onSave = () => {},
  isLoading = false,
  title = "Información Personal",
  description = "Actualiza tu información personal y profesional",
  mockUser = null,
}) => {
  // Try to use context first (for testing), then fallback to hook
  let currentUser: User | null = null;
  try {
    const context = useUserContext();
    currentUser = context.user;
  } catch {
    // Context not available, use hook
    const { user } = useUser();
    currentUser = user;
  }
  
  // Use mock user if provided (for testing)
  if (mockUser) {
    currentUser = mockUser;
  }
  
  const [profileData, setProfileData] = useState<Partial<User>>({
    id: "",
    fullName: "",
    email: "",
    bio: "",
    avatar: "",
    createdAt: new Date().toISOString(),
    company: {
      id: "",
      name: "",
      company_type: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      description: "",
      createdAt: new Date().toISOString(),
    },
    role: {
      id: "",
      name: "",
      description: "",
    },
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if current user has full editing permissions
  const hasFullEditPermissions = currentUser?.role?.name === "admin_empresa" || currentUser?.role?.name === "super_admin";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.fullName?.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    }

    if (!profileData.email?.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!profileData.company?.name?.trim()) {
      newErrors.companyName = "El nombre de la empresa es requerido";
    }

    if (!profileData.role?.name?.trim()) {
      newErrors.roleName = "El rol es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("company.")) {
      const companyField = field.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        company: {
          ...prev.company!,
          [companyField]: value,
        },
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(profileData);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleAvatarChange = (avatarPath: string) => {
    setProfileData((prev) => ({ ...prev, avatar: avatarPath }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <AvatarSelector
                currentAvatar={profileData.avatar || "/Avatar1.png"}
                onAvatarChange={handleAvatarChange}
                disabled={false}
              />
              <p className="text-sm text-gray-500">
                Selecciona tu avatar preferido
              </p>
            </div>
          </div>

          <Separator />

          {/* Permission Notice for Restricted Users */}
          {!hasFullEditPermissions && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                Para cambiar los datos debe comunicarse con el administrador
              </p>
            </div>
          )}

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                value={profileData.fullName || ""}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
                disabled={!hasFullEditPermissions}
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={!hasFullEditPermissions}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleName">Rol *</Label>
              <Input
                id="roleName"
                value={profileData.role?.name || ""}
                onChange={(e) => handleInputChange("role.name", e.target.value)}
                className={errors.roleName ? "border-red-500" : ""}
                disabled={!hasFullEditPermissions}
              />
              {errors.roleName && (
                <p className="text-sm text-red-500">{errors.roleName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía Personal</Label>
            <Textarea
              id="bio"
              value={profileData.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Describe tu experiencia y especialidades..."
              rows={4}
              disabled={!hasFullEditPermissions}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !hasFullEditPermissions}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
