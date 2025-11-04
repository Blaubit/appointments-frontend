import { useState } from "react";
import type { CompanyRegistrationPayload, Plan } from "@/types";

export const useRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const calculateSubscriptionDates = (planId: string, plans: Plan[]) => {
    const selectedPlan = plans.find((p) => p.id === planId);
    const startDate = new Date();
    const endDate = new Date();

    const billingCycleDays = selectedPlan?.billingCycle || 1;
    endDate.setDate(endDate.getDate() + billingCycleDays);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const buildPayload = (
    formData: any,
    termsData: any,
    selectedPlanId: string,
    currentUserId: string | undefined,
    plans: Plan[],
    companyTypes: any[]
  ): CompanyRegistrationPayload => {
    const { startDate, endDate } = calculateSubscriptionDates(
      selectedPlanId,
      plans
    );

    return {
      companyName: formData.company.name.trim(),
      companyType: formData.company.companyType,
      companyAddress: formData.company.address.trim(),
      companyCity: formData.company.city.trim(),
      companyState: formData.company.state.trim(),
      companyPostalCode: formData.company.postal_code.trim() || "00000",
      companyCountry: formData.company.country.trim(),
      companyPhone: formData.company.phone.trim(),
      companyDescription: formData.company.description?.trim() || "",
      adminFullName: formData.user.fullName.trim(),
      adminEmail: formData.user.email.trim(),
      adminBio:
        formData.user.bio?.trim() ||
        "Administrador de empresa médica con experiencia en gestión y atención al paciente.",
      planId: selectedPlanId,
      startDate,
      endDate,
      createdById: currentUserId || "{{userId}}",
    };
  };

  const validateTermsBeforeSubmit = (termsData: any): boolean => {
    return termsData.acceptTerms && termsData.acceptPrivacy;
  };

  const handleSubmit = async (
    payload: CompanyRegistrationPayload,
    onRegisterCompanyComplete: (
      payload: CompanyRegistrationPayload
    ) => Promise<any>
  ) => {
    setIsLoading(true);

    try {
      const response = await onRegisterCompanyComplete(payload);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error en submit:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    calculateSubscriptionDates,
    buildPayload,
    validateTermsBeforeSubmit,
    handleSubmit,
  };
};
