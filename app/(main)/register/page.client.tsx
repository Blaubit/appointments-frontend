"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CompanyTypes, Role, Plan, CompanyRegistrationPayload } from "@/types";
import {
  UserRegistrationCard,
  CompanyRegistrationCard,
  PlanSelectionCard,
  TermsAndConditionsCard,
} from "@/components/registration";
import { RegistrationHeader } from "@/components/registration/RegistrationHeader";
import { RegistrationErrorCard } from "@/components/registration/RegistrationErrorCard";
import { RegistrationSuccessCard } from "@/components/registration/RegistrationSuccessCard";
import { RegistrationFeaturesFooter } from "@/components/registration/registrationFeturesFooter";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { useRegistrationError } from "@/hooks/UseRegistrationError";
import { useRegistrationSubmit } from "@/hooks/useRegistrationSubmit";
import { CardContent, Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
  // Hooks personalizados
  const form = useRegistrationForm();
  const { registrationError, clearError, setErrorFromResponse } =
    useRegistrationError();
  const submit = useRegistrationSubmit();

  // Constantes
  const TOTAL_STEPS = 4;

  // Helpers para títulos y descripciones
  const getStepTitle = (step: number): string => {
    const titles: Record<number, string> = {
      1: "Información de la Empresa",
      2: "Cuenta de Administrador",
      3: "Selecciona tu Plan",
      4: "Términos y Condiciones",
      5: "¡Registro Exitoso!",
    };
    return titles[step] || "Registro";
  };

  const getStepDescription = (step: number): string => {
    const descriptions: Record<number, string> = {
      1: "Registra tu clínica, consultorio o centro médico",
      2: "Esta será tu cuenta principal para gestionar la empresa",
      3: "Elige el plan que mejor se adapte a tu empresa",
      4: "Revisa y acepta nuestros términos para completar el registro",
      5: "Tu empresa y cuenta de administrador han sido creadas exitosamente",
    };
    return descriptions[step] || "Completa el proceso de registro";
  };

  // Handlers de navegación
  const handleNextFromCompany = () => {
    form.handleCompanyDataChange(form.formData.company);
    if (form.validateCompanyStep()) {
      clearError();
    }
  };

  const handleNextFromUser = () => {
    form.handleUserDataChange(form.formData.user);
    if (form.validateUserStep()) {
      clearError();
    }
  };

  const handleNextFromPlans = () => {
    if (form.validatePlanStep()) {
      clearError();
    }
  };

  const handlePreviousStep = (targetStep: number) => {
    form.goToPreviousStep(targetStep);
    clearError();
  };

  // Handler de envío del formulario
  const handleSubmit = async () => {
    if (!form.validateTermsStep()) {
      return;
    }

    submit.setIsLoading(true);
    clearError();

    try {
      const payload = submit.buildPayload(
        form.formData,
        form.termsData,
        form.selectedPlanId,
        currentUserId,
        plans,
        companyTypes
      );

      const response = await onRegisterCompanyComplete(payload);
      console.log("Respuesta de onRegisterCompanyComplete:", response);
      // Verificar si es un error
      if (
        response &&
        "message" in response &&
        ("code" in response || "status" in response)
      ) {
        const errorActions = [
          form.selectedPlan
            ? {
                label: "Cambiar Plan",
                action: () => {
                  clearError();
                  form.setCurrentStep(3);
                },
                variant: "outline" as const,
              }
            : null,
          {
            label: "Contactar Soporte",
            action: () => (window.location.href = "/contact"),
            variant: "outline" as const,
          },
        ].filter(Boolean);

        setErrorFromResponse(response, errorActions as any);
        return;
      }

      // Éxito
      if (response && "data" in response && response.data) {
        form.setRegistrationResult(response);
        form.goToSuccessStep();
      }
    } catch (error) {
      console.error("Error en registro:", error);

      const errorResponse = {
        message:
          error instanceof Error
            ? error.message
            : "Error inesperado al procesar la solicitud",
        status: 500,
        code: error instanceof TypeError ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
      };

      setErrorFromResponse(errorResponse);
    } finally {
      submit.setIsLoading(false);
    }
  };

  // Handler de reintento
  const handleRetryRegistration = () => {
    clearError();
    handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        {/* Botón de regreso y tema */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        {/* Card de error */}
        <RegistrationErrorCard
          error={registrationError}
          onClose={clearError}
          onRetry={handleRetryRegistration}
          isLoading={submit.isLoading}
          showRetryInStep4={true}
          currentStep={form.currentStep}
        />

        {/* Header con progreso - Solo en pasos 1-4 */}
        {form.currentStep <= TOTAL_STEPS && (
          <RegistrationHeader
            currentStep={form.currentStep}
            totalSteps={TOTAL_STEPS}
            stepTitle={getStepTitle(form.currentStep)}
            stepDescription={getStepDescription(form.currentStep)}
          />
        )}

        {/* Step 1: Company Information */}
        {form.currentStep === 1 && (
          <CompanyRegistrationCard
            companyData={form.formData.company}
            onCompanyDataChange={form.handleCompanyDataChange}
            companyTypes={companyTypes}
            errors={form.errors}
            onNext={handleNextFromCompany}
            showPreviousButton={false}
            showNextButton={true}
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 2: User Registration */}
        {form.currentStep === 2 && (
          <UserRegistrationCard
            userData={form.formData.user}
            onUserDataChange={form.handleUserDataChange}
            roles={roles}
            errors={form.errors}
            onNext={handleNextFromUser}
            onPrevious={() => handlePreviousStep(1)}
            showRoleSelector={false}
            defaultRole={roles.find((role) => role.name === "admin_empresa")}
            title="Cuenta de Administrador"
            description="Esta será tu cuenta principal para gestionar la empresa"
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 3: Plan Selection */}
        {form.currentStep === 3 && (
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            {/* Envolver en CardContent para asegurar padding consistente */}
            <CardContent className="px-4 sm:px-6">
              <PlanSelectionCard
                plans={plans}
                onFetchPlans={onFetchPlans}
                selectedPlanId={form.selectedPlanId}
                onPlanSelect={form.handlePlanSelectionChange}
                recommendedPlanId={
                  plans.find((p) => p.name.toLowerCase().includes("pro"))?.id
                }
                showConfirmButton={false}
                className="" /* quitar bg-transparent/padding conflictivo */
              />
            </CardContent>

            {form.errors.plan && (
              <CardContent className="px-4 sm:px-6 pt-0">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {form.errors.plan}
                  </p>
                </div>
              </CardContent>
            )}

            <CardContent className="px-4 sm:px-6 pt-0">
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePreviousStep(2)}
                  className="order-2 sm:order-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  onClick={handleNextFromPlans}
                  disabled={!form.selectedPlanId}
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
        {form.currentStep === 4 && (
          <TermsAndConditionsCard
            termsData={form.termsData}
            onTermsDataChange={form.handleTermsDataChange}
            errors={form.errors}
            onNext={handleSubmit}
            onPrevious={() => handlePreviousStep(3)}
            companyType={
              companyTypes.find(
                (t) => t.value === form.formData.company.companyType
              )?.label || "empresa médica"
            }
            companyName={form.formData.company.name}
            nextButtonText={
              submit.isLoading ? "Creando empresa..." : "Crear Empresa"
            }
            nextButtonDisabled={
              submit.isLoading ||
              !form.termsData.acceptTerms ||
              !form.termsData.acceptPrivacy
            }
            className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          />
        )}

        {/* Step 5: Success */}
        {form.currentStep === 5 && form.registrationResult && (
          <RegistrationSuccessCard
            companyName={form.formData.company.name}
            companyType={form.formData.company.companyType}
            adminFullName={form.formData.user.fullName}
            selectedPlan={form.selectedPlan}
            companyTypes={companyTypes}
          />
        )}

        {/* Features y Footer - Solo en pasos 1-4 */}
        {form.currentStep <= TOTAL_STEPS && <RegistrationFeaturesFooter />}
      </div>
    </div>
  );
}
