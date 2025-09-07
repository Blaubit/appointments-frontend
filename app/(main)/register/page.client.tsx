"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Users,
  Building2,
  User,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  WifiOff,
  ServerCrash,
  Lock,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { CompanyTypes, Role, Plan, CompanyRegistrationPayload } from "@/types";
import {
  UserRegistrationCard,
  CompanyRegistrationCard,
  PlanSelectionCard,
  useUserValidation,
  useCompanyValidation,
  usePlanSelection,
  TermsAndConditionsCard,
  useTermsValidation,
} from "@/components/registration";

interface RegisterClientProps {
  companyTypes: CompanyTypes[];
  roles: Role[];
  plans?: Plan[];
  onRegisterCompanyComplete: (
    payload: CompanyRegistrationPayload
  ) => Promise<any>;
  onFetchPlans?: () => Promise<Plan[]>;
  currentUserId?: string;
}

export default function RegisterClient({
  companyTypes = [],
  roles = [],
  plans = [],
  onRegisterCompanyComplete,
  onFetchPlans,
  currentUserId,
}: RegisterClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Estado actualizado para manejar ErrorResponse específicamente
  const [registrationError, setRegistrationError] = useState<{
    show: boolean;
    title: string;
    message: string;
    details?: string;
    code?: string;
    statusCode?: number;
    canRetry: boolean;
    icon: React.ReactNode;
    actions?: Array<{
      label: string;
      action: () => void;
      variant?: "default" | "outline" | "destructive";
    }>;
  }>({
    show: false,
    title: "",
    message: "",
    details: "",
    code: "",
    statusCode: undefined,
    canRetry: false,
    icon: <AlertCircle className="h-6 w-6" />,
    actions: [],
  });

  // Hooks de validación
  const { validateCompany } = useCompanyValidation();
  const { validateUser } = useUserValidation();
  const { validateTerms } = useTermsValidation();
  const { selectedPlan, handlePlanSelect } = usePlanSelection();

  // Form data estructurado según el payload final
  const [formData, setFormData] = useState({
    company: {
      name: "",
      companyType: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "España",
      description: "",
    },
    user: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      bio: "",
    },
  });

  // Términos y condiciones (obligatorios para avanzar)
  const [termsData, setTermsData] = useState({
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false,
    acceptCookies: false,
  });

  // Plan seleccionado
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Datos de registro exitoso
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  // ✅ Función para limpiar errores de registro
  const clearRegistrationError = () => {
    setRegistrationError({
      show: false,
      title: "",
      message: "",
      details: "",
      code: "",
      statusCode: undefined,
      canRetry: false,
      icon: <AlertCircle className="h-6 w-6" />,
      actions: [],
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.submit;
      return newErrors;
    });
  };

  // ✅ Función mejorada para manejar ErrorResponse específicamente
  const handleRegistrationError = (errorResponse: any) => {
    const statusCode = errorResponse?.status || errorResponse?.statusCode;
    const errorCode = errorResponse?.code;
    const message = errorResponse?.message || "Error desconocido";

    let errorConfig;

    // ✅ Primero verificar por código de error específico del backend
    switch (errorCode) {
      case "COMPANY_NAME_EXISTS":
        errorConfig = {
          title: "Nombre de Empresa Duplicado",
          message: "Ya existe una empresa con este nombre",
          details: "Por favor, elige un nombre diferente para tu empresa.",
          icon: <Ban className="h-6 w-6 text-orange-600" />,
          canRetry: true,
          actions: [
            {
              label: "Cambiar Nombre",
              action: () => {
                clearRegistrationError();
                setCurrentStep(1);
              },
              variant: "outline" as const,
            },
          ],
        };
        break;

      case "EMAIL_EXISTS":
        errorConfig = {
          title: "Email Ya Registrado",
          message: "Este email ya está asociado a otra cuenta",
          details:
            "Por favor, usa un email diferente o recupera tu cuenta existente.",
          icon: <Ban className="h-6 w-6 text-orange-600" />,
          canRetry: true,
          actions: [
            {
              label: "Cambiar Email",
              action: () => {
                clearRegistrationError();
                setCurrentStep(2);
              },
              variant: "outline" as const,
            },
            {
              label: "Recuperar Cuenta",
              action: () => (window.location.href = "/forgot-password"),
              variant: "default" as const,
            },
          ],
        };
        break;

      case "VALIDATION_ERROR":
        errorConfig = {
          title: "Error de Validación",
          message: message,
          details:
            "Algunos campos contienen errores. Por favor, revisa la información.",
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          canRetry: true,
          actions: [
            {
              label: "Revisar Datos",
              action: () => {
                clearRegistrationError();
                setCurrentStep(1);
              },
              variant: "outline" as const,
            },
          ],
        };
        break;

      case "PLAN_NOT_FOUND":
        errorConfig = {
          title: "Plan No Válido",
          message: "El plan seleccionado no está disponible",
          details: "Por favor, selecciona un plan diferente.",
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          canRetry: true,
          actions: [
            {
              label: "Seleccionar Plan",
              action: () => {
                clearRegistrationError();
                setCurrentStep(3);
              },
              variant: "outline" as const,
            },
          ],
        };
        break;

      case "USER_UNAUTHORIZED":
        errorConfig = {
          title: "Sesión Expirada",
          message: "Tu sesión ha expirado",
          details: "Por favor, inicia sesión nuevamente para continuar.",
          icon: <Lock className="h-6 w-6 text-red-600" />,
          canRetry: false,
          actions: [
            {
              label: "Iniciar Sesión",
              action: () => (window.location.href = "/login"),
              variant: "default" as const,
            },
          ],
        };
        break;

      case "DATABASE_ERROR":
        errorConfig = {
          title: "Error de Base de Datos",
          message: "Problema temporal con la base de datos",
          details:
            "Estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo en unos minutos.",
          icon: <ServerCrash className="h-6 w-6 text-red-600" />,
          canRetry: true,
        };
        break;

      case "RATE_LIMIT_EXCEEDED":
        errorConfig = {
          title: "Demasiados Intentos",
          message: "Has excedido el límite de intentos",
          details: "Por favor, espera unos minutos antes de intentar de nuevo.",
          icon: <Clock className="h-6 w-6 text-yellow-600" />,
          canRetry: false,
        };
        break;

      default:
        // ✅ Si no hay código específico, usar el status HTTP
        switch (statusCode) {
          case 400:
            errorConfig = {
              title: "Solicitud Inválida",
              message: message,
              details:
                "Los datos enviados no son válidos. Verifica la información e inténtalo de nuevo.",
              icon: <Ban className="h-6 w-6 text-orange-600" />,
              canRetry: true,
            };
            break;

          case 401:
            errorConfig = {
              title: "No Autorizado",
              message: message,
              details:
                "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
              icon: <Lock className="h-6 w-6 text-red-600" />,
              canRetry: false,
              actions: [
                {
                  label: "Iniciar Sesión",
                  action: () => (window.location.href = "/login"),
                  variant: "default" as const,
                },
              ],
            };
            break;

          case 403:
            errorConfig = {
              title: "Acceso Denegado",
              message: message,
              details: "No tienes permisos para realizar esta operación.",
              icon: <Shield className="h-6 w-6 text-red-600" />,
              canRetry: false,
              actions: [
                {
                  label: "Contactar Soporte",
                  action: () => (window.location.href = "/contact"),
                  variant: "outline" as const,
                },
              ],
            };
            break;

          case 409:
            errorConfig = {
              title: "Conflicto de Datos",
              message: message,
              details:
                "Ya existe un registro con estos datos. Por favor, usa información diferente.",
              icon: <Ban className="h-6 w-6 text-orange-600" />,
              canRetry: true,
            };
            break;

          case 422:
            errorConfig = {
              title: "Error de Validación",
              message: message,
              details: "Los datos no cumplen con los requisitos de validación.",
              icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
              canRetry: true,
            };
            break;

          case 500:
            errorConfig = {
              title: "Error Interno del Servidor",
              message: "Ocurrió un problema en nuestros servidores",
              details:
                "Nuestro equipo ha sido notificado. Por favor, inténtalo de nuevo en unos minutos.",
              icon: <ServerCrash className="h-6 w-6 text-red-600" />,
              canRetry: true,
            };
            break;

          case 502:
            errorConfig = {
              title: "Servidor No Disponible",
              message: "El servidor no está respondiendo",
              details:
                "Este es un problema temporal. Por favor, inténtalo de nuevo en unos minutos.",
              icon: <ServerCrash className="h-6 w-6 text-red-600" />,
              canRetry: true,
            };
            break;

          case 503:
            errorConfig = {
              title: "Servicio No Disponible",
              message: "El servicio está temporalmente fuera de línea",
              details:
                "Estamos realizando mantenimiento. El servicio estará disponible pronto.",
              icon: <Clock className="h-6 w-6 text-yellow-600" />,
              canRetry: true,
            };
            break;

          default:
            // ✅ Error genérico
            errorConfig = {
              title: "Error Inesperado",
              message: message,
              details:
                "Si el problema persiste, contacta con nuestro equipo de soporte.",
              icon: <AlertCircle className="h-6 w-6 text-red-600" />,
              canRetry: true,
              actions: [
                {
                  label: "Contactar Soporte",
                  action: () => (window.location.href = "/contact"),
                  variant: "outline" as const,
                },
              ],
            };
            break;
        }
        break;
    }

    setRegistrationError({
      show: true,
      code: errorCode,
      statusCode,
      ...errorConfig,
    });
  };

  // Handlers para cada paso
  const handleCompanyDataChange = (companyData: any) => {
    setFormData({
      ...formData,
      company: companyData,
    });
    clearRelevantErrors([
      "companyName",
      "companyType",
      "address",
      "city",
      "state",
    ]);
    clearRegistrationError();
  };

  const handleUserDataChange = (userData: any) => {
    setFormData({
      ...formData,
      user: userData,
    });
    clearRelevantErrors([
      "fullName",
      "email",
      "password",
      "confirmPassword",
      "bio",
    ]);
    clearRegistrationError();
  };

  const handleTermsDataChange = (data: any) => {
    setTermsData(data);
    clearRelevantErrors(["acceptTerms", "acceptPrivacy"]);
    clearRegistrationError();
  };

  const handlePlanSelectionChange = (plan: Plan) => {
    handlePlanSelect(plan);
    setSelectedPlanId(plan.id);
    clearRelevantErrors(["plan"]);
    clearRegistrationError();
  };

  // Función auxiliar para limpiar errores específicos
  const clearRelevantErrors = (errorKeys: string[]) => {
    const hasRelevantErrors = errorKeys.some((key) => errors[key]);
    if (hasRelevantErrors) {
      const newErrors = { ...errors };
      errorKeys.forEach((key) => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  // Navegación entre pasos con validación
  const handleNextFromCompany = () => {
    const companyErrors = validateCompany(formData.company);
    if (Object.keys(companyErrors).length === 0) {
      setCurrentStep(2);
      setErrors({});
      clearRegistrationError();
    } else {
      setErrors(companyErrors);
    }
  };

  const handleNextFromUser = () => {
    const isAdminRole = true;
    const userErrors = validateUser(formData.user, isAdminRole);
    if (Object.keys(userErrors).length === 0) {
      setCurrentStep(3);
      setErrors({});
      clearRegistrationError();
    } else {
      setErrors(userErrors);
    }
  };

  const handleNextFromPlans = () => {
    if (!selectedPlanId) {
      setErrors({ plan: "Debes seleccionar un plan para continuar" });
      return;
    }
    setCurrentStep(4);
    setErrors({});
    clearRegistrationError();
  };

  const handleNextFromTerms = () => {
    const termsErrors = validateTerms(termsData);
    if (Object.keys(termsErrors).length === 0) {
      handleSubmit();
    } else {
      setErrors(termsErrors);
    }
  };

  // Navegación hacia atrás
  const handlePrevious = (targetStep: number) => {
    setCurrentStep(targetStep);
    setErrors({});
    clearRegistrationError();
  };

  // Función para calcular fechas de suscripción
  const calculateSubscriptionDates = (planId: string) => {
    const selectedPlanData = plans.find((p) => p.id === planId) || selectedPlan;
    const startDate = new Date();
    const endDate = new Date();

    // Calcular fecha de fin basada en el ciclo de facturación del plan (en días)
    const billingCycleDays = selectedPlanData?.billingCycle || 1;
    endDate.setDate(endDate.getDate() + billingCycleDays);

    return {
      startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD
      endDate: endDate.toISOString().split("T")[0], // YYYY-MM-DD
    };
  };

  // Construir el payload final según la estructura requerida
  const buildRegistrationPayload = (): CompanyRegistrationPayload => {
    const { startDate, endDate } = calculateSubscriptionDates(selectedPlanId);

    return {
      // Company data
      companyName: formData.company.name.trim(),
      companyType: formData.company.companyType,
      companyAddress: formData.company.address.trim(),
      companyCity: formData.company.city.trim(),
      companyState: formData.company.state.trim(),
      companyPostalCode: formData.company.postal_code.trim() || "00000",
      companyCountry: formData.company.country.trim(),
      companyDescription: formData.company.description?.trim() || "",

      // Admin data
      adminFullName: formData.user.fullName.trim(),
      adminEmail: formData.user.email.trim(),
      adminPassword: formData.user.password,
      adminBio:
        formData.user.bio?.trim() ||
        "Administrador de empresa médica con experiencia en gestión y atención al paciente.",

      // Subscription data
      planId: selectedPlanId,
      startDate,
      endDate,
      createdById: currentUserId || "{{userId}}",
    };
  };

  // ✅ Envío final del formulario con manejo específico de SuccessResponse/ErrorResponse
  const handleSubmit = async () => {
    if (!termsData.acceptTerms || !termsData.acceptPrivacy) {
      setErrors({
        acceptTerms: !termsData.acceptTerms
          ? "Debes aceptar los términos y condiciones"
          : "",
        acceptPrivacy: !termsData.acceptPrivacy
          ? "Debes aceptar la política de privacidad"
          : "",
      });
      return;
    }

    setIsLoading(true);
    clearRegistrationError();

    try {
      console.log("Iniciando registro completo de empresa...");
      const payload = buildRegistrationPayload();
      console.log("Payload a enviar:", payload);

      const response = await onRegisterCompanyComplete(payload);
      console.log("Respuesta del servidor:", response);

      // ✅ Verificar si es una ErrorResponse
      if (
        response &&
        "message" in response &&
        ("code" in response || "status" in response)
      ) {
        console.error("Error Response recibido:", response);
        handleRegistrationError(response);
        return;
      }

      // ✅ Verificar si es una SuccessResponse<Company>
      if (response && "data" in response && response.data) {
        console.log("Success Response recibido:", response);
        setRegistrationResult(response);
        setCurrentStep(5);
        return;
      }

      // ✅ Si no coincide con ninguna estructura esperada
      console.error("Respuesta inesperada del servidor:", response);
      handleRegistrationError({
        message: "Respuesta inesperada del servidor",
        status: 500,
        code: "UNEXPECTED_RESPONSE",
      });
    } catch (error) {
      console.error("Error inesperado en el registro:", error);

      // ✅ Manejar errores de red/conexión
      if (error instanceof TypeError && error.message.includes("fetch")) {
        handleRegistrationError({
          message: "Error de conexión con el servidor",
          status: 0,
          code: "NETWORK_ERROR",
        });
      } else if (error instanceof Error) {
        handleRegistrationError({
          message: error.message,
          status: 500,
          code: "UNEXPECTED_ERROR",
        });
      } else {
        handleRegistrationError({
          message: "Error inesperado al procesar la solicitud",
          status: 500,
          code: "UNKNOWN_ERROR",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Función para reintentar el registro
  const handleRetryRegistration = () => {
    clearRegistrationError();
    handleRetryFromStart();
    handleSubmit();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información de la Empresa";
      case 2:
        return "Cuenta de Administrador";
      case 3:
        return "Selecciona tu Plan";
      case 4:
        return "Términos y Condiciones";
      case 5:
        return "¡Registro Exitoso!";
      default:
        return "Registro";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Registra tu clínica, consultorio o centro médico";
      case 2:
        return "Esta será tu cuenta principal para gestionar la empresa";
      case 3:
        return "Elige el plan que mejor se adapte a tu empresa";
      case 4:
        return "Revisa y acepta nuestros términos para completar el registro";
      case 5:
        return "Tu empresa y cuenta de administrador han sido creadas exitosamente";
      default:
        return "Completa el proceso de registro";
    }
  };
  const handleRetryFromStart = () => {
    clearRegistrationError();
    setCurrentStep(1);
  };
  const totalSteps = 4;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-2xl">
        {/* Back to home */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        {/* ✅ Componente de Error mejorado para mostrar ErrorResponse */}
        {registrationError.show && (
          <Card className="shadow-2xl border-0 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm mb-6 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full flex-shrink-0">
                  {registrationError.icon}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                      {registrationError.title}
                      <div className="flex gap-1">
                        {registrationError.statusCode && (
                          <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded-full">
                            {registrationError.statusCode}
                          </span>
                        )}
                        {registrationError.code && (
                          <span className="text-xs px-2 py-1 bg-red-300 dark:bg-red-700 rounded-full">
                            {registrationError.code}
                          </span>
                        )}
                      </div>
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      {registrationError.message}
                    </p>
                  </div>

                  {registrationError.details && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {registrationError.details}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {/* Botón de reintentar si está disponible */}
                    {registrationError.canRetry && currentStep === 4 && (
                      <Button
                        onClick={handleRetryRegistration}
                        disabled={isLoading}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Reintentando...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                          </>
                        )}
                      </Button>
                    )}

                    {/* Acciones específicas del error */}
                    {registrationError.actions?.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || "outline"}
                        size="sm"
                        onClick={action.action}
                        className={
                          action.variant === "outline"
                            ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            : ""
                        }
                      >
                        {action.label}
                      </Button>
                    ))}

                    {/* Botón cerrar siempre disponible */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRegistrationError}
                      className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header con progreso - Solo mostrar en pasos 1-4 */}
        {currentStep <= totalSteps && (
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
            <CardHeader className="text-center space-y-4 px-4 sm:px-6">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CitasFácil
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-muted-foreground mt-2 px-2">
                  Registra tu empresa y comienza a gestionar citas de forma
                  profesional
                </CardDescription>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {getStepTitle()}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 px-2">
                  {getStepDescription()}
                </p>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Step 1: Company Information */}
        {currentStep === 1 && (
          <CompanyRegistrationCard
            companyData={formData.company}
            onCompanyDataChange={handleCompanyDataChange}
            companyTypes={companyTypes}
            errors={errors}
            onNext={handleNextFromCompany}
            showPreviousButton={false}
            showNextButton={true}
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 2: User Registration */}
        {currentStep === 2 && (
          <UserRegistrationCard
            userData={formData.user}
            onUserDataChange={handleUserDataChange}
            roles={roles}
            errors={errors}
            onNext={handleNextFromUser}
            onPrevious={() => handlePrevious(1)}
            showRoleSelector={false}
            defaultRole={roles.find((role) => role.name === "admin_empresa")}
            title="Cuenta de Administrador"
            description="Esta será tu cuenta principal para gestionar la empresa"
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 3: Plan Selection */}
        {currentStep === 3 && (
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <PlanSelectionCard
              plans={plans}
              onFetchPlans={onFetchPlans}
              selectedPlanId={selectedPlanId}
              onPlanSelect={handlePlanSelectionChange}
              recommendedPlanId={
                plans.find((p) => p.name.toLowerCase().includes("pro"))?.id
              }
              showConfirmButton={false}
              className="border-0 shadow-none bg-transparent"
            />

            {/* Error de selección de plan */}
            {errors.plan && (
              <CardContent className="px-4 sm:px-6 pt-0">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.plan}
                  </p>
                </div>
              </CardContent>
            )}

            {/* Botones dentro de la card */}
            <CardContent className="px-4 sm:px-6 pt-0">
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePrevious(2)}
                  className="order-2 sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  onClick={handleNextFromPlans}
                  disabled={!selectedPlanId}
                  className="order-1 sm:order-2"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Terms and Conditions */}
        {currentStep === 4 && (
          <TermsAndConditionsCard
            termsData={termsData}
            onTermsDataChange={handleTermsDataChange}
            errors={errors}
            onNext={handleNextFromTerms}
            onPrevious={() => handlePrevious(3)}
            companyType={
              companyTypes.find((t) => t.value === formData.company.companyType)
                ?.label || "empresa médica"
            }
            companyName={formData.company.name}
            nextButtonText={isLoading ? "Creando empresa..." : "Crear Empresa"}
            nextButtonDisabled={
              isLoading || !termsData.acceptTerms || !termsData.acceptPrivacy
            }
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && registrationResult && (
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="text-center space-y-6 py-12">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto">
                  <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    ¡Empresa Registrada Exitosamente!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                    Bienvenido a CitasFácil, {formData.user.fullName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Empresa Creada
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {formData.company.name}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    {
                      companyTypes.find(
                        (t) => t.value === formData.company.companyType
                      )?.label
                    }
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2 text-sm">
                    <User className="h-4 w-4 inline mr-2" />
                    Usuario Administrador
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-400">
                    {formData.user.fullName}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                    Rol: Administrador de Empresa
                  </p>
                </div>
              </div>

              {/* Información del plan */}
              {selectedPlan && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-300 mb-2 text-sm">
                    <Star className="h-4 w-4 inline mr-2" />
                    Plan Seleccionado
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    {selectedPlan.name} - ${selectedPlan.price}/
                    {selectedPlan.billingCycle} días
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Suscripción activa
                  </p>
                </div>
              )}

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-300 mb-4 text-sm sm:text-base">
                  ¿Qué sigue?
                </h4>
                <div className="space-y-3 text-xs sm:text-sm text-green-800 dark:text-green-400">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span>Revisa tu email para verificar tu cuenta</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span>Crea usuarios para doctores y secretarias</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span>Configura servicios y horarios de trabajo</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span>Personaliza tu perfil empresarial</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Ir al Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Iniciar Sesión Más Tarde
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section - Solo mostrar en pasos 1-4 */}
        {currentStep <= totalSteps && (
          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-green-600" />
              <p className="text-xs text-muted-foreground">100% Seguro</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Clock className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs text-muted-foreground">
                Configuración Rápida
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Star className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-xs text-muted-foreground">Soporte 24/7</p>
            </div>
          </div>
        )}

        {/* Footer - Solo mostrar en pasos 1-4 */}
        {currentStep <= totalSteps && (
          <div className="mt-6 text-center text-xs text-muted-foreground px-4">
            <p>Al registrarte, aceptas nuestros</p>
            <div className="flex justify-center space-x-4 mt-1">
              <Link href="/terms">
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
                >
                  Términos de Servicio
                </Button>
              </Link>
              <span>•</span>
              <Link href="/privacy">
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
                >
                  Política de Privacidad
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
