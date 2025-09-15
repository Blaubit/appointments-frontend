import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { LogoutWarningDialog } from "@/components/settings/logout-warning-dialog";
import { findOne } from "@/actions/companies/findOne";
import edit from "@/actions/companies/edit";
import { Edit, X, Save, AlertCircle, Loader2 } from "lucide-react";
import type { Company } from "@/types";
import { logout } from "@/actions/auth/logout";

interface BusinessInfoFormProps {
  company?: Company;
  companyId?: string; // Nuevo: para cargar desde servidor si no se pasa company
  onSave?: (companyData: Omit<Company, "id" | "createdAt">) => Promise<void>;
  isLoading?: boolean; // Mantener prop original
  canEdit?: boolean;
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

const getInitialFormData = (
  company?: Company
): Omit<Company, "id" | "createdAt"> => ({
  name: company?.name || "",
  companyType: company?.companyType || "",
  address: company?.address || "",
  city: company?.city || "",
  state: company?.state || "",
  postal_code: company?.postal_code || "",
  country: company?.country || "",
  description: company?.description || "",
});

export function BusinessInfoForm({
  company,
  companyId,
  onSave = async () => {},
  isLoading = false, // Mantener prop original
  canEdit = true,
}: BusinessInfoFormProps) {
  // Estados principales
  const [loadedCompany, setLoadedCompany] = useState<Company | null>(
    company || null
  );
  const [formData, setFormData] = useState<Omit<Company, "id" | "createdAt">>(
    getInitialFormData(company)
  );
  const [originalData, setOriginalData] = useState<
    Omit<Company, "id" | "createdAt">
  >(getInitialFormData(company));

  // Estados de UI
  const [isLoadingFromServer, setIsLoadingFromServer] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState<boolean>(false);

  // Estados de errores
  const [serverError, setServerError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Efecto para cargar datos del servidor cuando sea necesario
  useEffect(() => {
    const loadCompanyData = async () => {
      // Solo cargar del servidor si:
      // 1. No se pasó company como prop Y
      // 2. Se pasó companyId Y
      // 3. No estamos ya en estado de loading externo
      if (!company && companyId && !isLoading) {
        try {
          setIsLoadingFromServer(true);
          setServerError("");

          const result = await findOne(companyId);

          if ("data" in result) {
            const companyData = result.data;
            setLoadedCompany(companyData);

            // Llenar el formulario SOLO con los datos del servidor
            const serverFormData = getInitialFormData(companyData);
            setFormData(serverFormData);
            setOriginalData(serverFormData);
          } else {
            // Manejo de errores del servidor
            let errorMessage = "Error al cargar la información de la empresa";

            if (result.status === 401) {
              errorMessage =
                "Sesión expirada. Por favor, inicia sesión nuevamente.";
            } else if (result.status === 403) {
              errorMessage = "No tienes permisos para ver esta empresa.";
            } else if (result.status === 404) {
              errorMessage = "La empresa no fue encontrada.";
            } else if (result.status && result.status >= 500) {
              errorMessage = "Error interno del servidor. Intenta más tarde.";
            } else if (result.message) {
              errorMessage = result.message;
            }

            setServerError(errorMessage);
          }
        } catch (error) {
          console.error("Error inesperado al cargar empresa:", error);
          setServerError(
            "Error inesperado al cargar la información. Intenta recargar la página."
          );
        } finally {
          setIsLoadingFromServer(false);
        }
      }
    };

    loadCompanyData();
  }, [company, companyId, isLoading]);

  // Efecto para actualizar el formulario cuando cambie el company prop
  useEffect(() => {
    if (company) {
      const newFormData = getInitialFormData(company);
      setFormData(newFormData);
      setOriginalData(newFormData);
      setLoadedCompany(company);
      setServerError(""); // Limpiar errores si se pasan datos válidos
    }
  }, [company]);

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

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Limpiar errores de servidor cuando el usuario interactúe
    if (serverError) {
      setServerError("");
    }
  };

  const handleEditToggle = (): void => {
    if (!canEdit) return;

    if (isEditing) {
      // Cancelar edición - restaurar datos originales
      setFormData(originalData);
      setValidationErrors({});
      setServerError("");
    } else {
      // Habilitar edición - guardar estado actual como respaldo
      setOriginalData(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (): void => {
    if (!canEdit) return;

    if (!validateForm()) {
      return;
    }

    setShowLogoutWarning(true);
  };

  const handleContinueWithLogout = async (): Promise<void> => {
    const currentCompany = loadedCompany || company;

    if (!currentCompany?.id) {
      setServerError("ID de empresa requerido para la actualización");
      setShowLogoutWarning(false);
      return;
    }

    setIsSaving(true);
    setShowLogoutWarning(false);
    setServerError("");

    try {
      const result = await edit({
        id: currentCompany.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        description: formData.description,
      });

      if ("data" in result) {
        console.log(
          "Empresa actualizada exitosamente, cerrando sesión por seguridad:",
          result.data
        );

        // Llamar el callback onSave si existe
        await onSave(formData);

        // logout
        await logout();
      } else {
        // Manejo de errores de actualización
        let errorMessage = "Error al actualizar la información de la empresa";

        if (result.status === 401) {
          errorMessage = "Sesión expirada. Los cambios no se guardaron.";
        } else if (result.status === 403) {
          errorMessage = "No tienes permisos para editar esta empresa.";
        } else if (result.status === 404) {
          errorMessage = "La empresa no fue encontrada.";
        } else if (result.status && result.status >= 500) {
          errorMessage = "Error interno del servidor. Intenta más tarde.";
        } else if (result.message) {
          errorMessage = result.message;
        }

        setServerError(errorMessage);
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error inesperado al actualizar:", error);
      setServerError(
        "Error inesperado al guardar. Verifica tu conexión e intenta nuevamente."
      );
      setIsSaving(false);
    }
  };

  const handleCancelWarning = (): void => {
    setShowLogoutWarning(false);
  };

  const getBusinessTypeLabel = (value: string) => {
    const businessType = businessTypes.find((type) => type.value === value);
    return businessType ? businessType.label : value || "No especificado";
  };

  const handleRetry = () => {
    if (companyId && !company) {
      setServerError("");
      // Forzar recarga eliminando y agregando el companyId
      const currentId = companyId;
      setTimeout(() => {
        // El useEffect se ejecutará nuevamente
        setIsLoadingFromServer(true);
      }, 100);
    }
  };

  // Determinar el estado de loading actual
  const currentlyLoading = isLoading || isLoadingFromServer;
  const currentCompany = loadedCompany || company;

  // Estado de carga inicial
  if (currentlyLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Cargando..."
                : "Cargando información de la empresa..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de error de servidor (sin datos)
  if (serverError && !currentCompany) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{serverError}</span>
              {companyId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2"
                >
                  Reintentar
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
                canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    disabled={!!serverError}
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
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error de servidor durante operaciones */}
          {serverError && currentCompany && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                  id="businessName"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className={validationErrors.name ? "border-red-500" : ""}
                  disabled={!isEditing || !canEdit || isSaving}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">
                    {validationErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Tipo de Negocio</Label>
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
                    className={validationErrors.address ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit || isSaving}
                  />
                  {validationErrors.address && (
                    <p className="text-sm text-red-500">
                      {validationErrors.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className={validationErrors.city ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit || isSaving}
                  />
                  {validationErrors.city && (
                    <p className="text-sm text-red-500">
                      {validationErrors.city}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className={validationErrors.state ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit || isSaving}
                  />
                  {validationErrors.state && (
                    <p className="text-sm text-red-500">
                      {validationErrors.state}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) =>
                      updateFormData("postal_code", e.target.value)
                    }
                    disabled={!isEditing || !canEdit || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className={validationErrors.country ? "border-red-500" : ""}
                    disabled={!isEditing || !canEdit || isSaving}
                  />
                  {validationErrors.country && (
                    <p className="text-sm text-red-500">
                      {validationErrors.country}
                    </p>
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
                disabled={!isEditing || !canEdit || isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <LogoutWarningDialog
        isOpen={showLogoutWarning}
        onClose={handleCancelWarning}
        onContinue={handleContinueWithLogout}
      />
    </>
  );
}
