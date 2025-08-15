import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { LogoutWarningDialog } from "@/components/settings/logout-warning-dialog";
import { logout } from "@/actions/auth/logout";
import edit from "@/actions/companies/edit";
import { Edit, X, Save } from "lucide-react";
import type { Company } from "@/types";

interface BusinessInfoFormProps {
  company?: Company;
  onSave?: (companyData: Omit<Company, "id" | "createdAt">) => Promise<void>;
  isLoading?: boolean;
  canEdit?: boolean; // <- Agregada esta prop
}

const businessTypes = [
  { value: "consultorio_medico", label: "Consultorio Médico" },
  { value: "clinica_dental", label: "Clínica Dental" },
  { value: "fisioterapia", label: "Fisioterapia" },
  { value: "psicologia", label: "Psicología" },
  { value: "veterinaria", label: "Veterinaria" },
  { value: "spa_wellness", label: "Spa & Wellness" },
  { value: "beauty_salon", label: "Salón de Belleza" },
  { value: "consultoria", label: "Consultoría" },
  { value: "otro", label: "Otro" },
];

export function BusinessInfoForm({
  company,
  onSave = async () => {},
  isLoading = false,
  canEdit = true, // <- Valor por defecto agregado
}: BusinessInfoFormProps) {
  const [formData, setFormData] = useState<Omit<Company, "id" | "createdAt">>({
    name: company?.name || "",
    companyType: company?.companyType || "",
    address: company?.address || "",
    city: company?.city || "",
    state: company?.state || "",
    postal_code: company?.postal_code || "",
    country: company?.country || "",
    description: company?.description || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<Omit<Company, "id" | "createdAt">>(formData);
  const [showLogoutWarning, setShowLogoutWarning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del negocio es requerido";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!formData.state.trim()) {
      newErrors.state = "El estado es requerido";
    }

    if (!formData.country.trim()) {
      newErrors.country = "El país es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEditToggle = (): void => {
    if (!canEdit) return; // <- Verificación de permisos agregada
    
    if (isEditing) {
      // Cancelar edición - restaurar datos originales
      setFormData(originalData);
      setErrors({});
    } else {
      // Habilitar edición - guardar estado actual como respaldo
      setOriginalData(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (): void => {
    if (!canEdit) return; // <- Verificación de permisos agregada
    
    if (!validateForm()) {
      return;
    }
    
    // Mostrar el popup de advertencia
    setShowLogoutWarning(true);
  };

  const handleContinueWithLogout = async (): Promise<void> => {
    if (!company?.id) {
      console.error("Company ID is required for update");
      return;
    }

    setIsSaving(true);
    setShowLogoutWarning(false);

    try {
      // No enviamos companyType ya que no es editable
      const result = await edit({
        id: company.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        description: formData.description,
      });

      if ('data' in result) {
        // Éxito - pero no actualizar el estado porque vamos a cerrar sesión
        console.log("Company updated successfully, logging out for security:", result.data);
        
        // Cerrar sesión por seguridad
        await logout();
      } else {
        // Error en la actualización
        console.error("Error updating company:", result.message);
        setIsSaving(false);
        // Aquí puedes mostrar un toast de error
        // toast.error(result.message || "Error al actualizar la información del negocio");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsSaving(false);
      // toast.error("Error inesperado al actualizar la información del negocio");
    }
  };

  const handleCancelWarning = (): void => {
    setShowLogoutWarning(false);
  };

  // Función para obtener el label del tipo de empresa
  const getBusinessTypeLabel = (value: string) => {
    const businessType = businessTypes.find(type => type.value === value);
    return businessType ? businessType.label : value;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Información del Negocio</CardTitle>
              <CardDescription>
                Configura los detalles de tu consultorio o negocio.
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                canEdit && ( // <- Condición agregada
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                  id="businessName"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Tipo de Negocio</Label>
                {/* Campo no editable - mostrar como texto */}
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                  {getBusinessTypeLabel(formData.companyType)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Dirección</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className={errors.state ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className={errors.country ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Negocio</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe tu negocio y servicios..."
                rows={4}
                disabled={!isEditing || !canEdit} // <- Verificación de permisos agregada
              />
            </div>
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
}