import { useState } from "react";
import {
  useUserValidation,
  useCompanyValidation,
  useTermsValidation,
  usePlanSelection,
} from "@/components/registration";
import type { Plan } from "@/types";

export interface FormData {
  company: {
    name: string;
    companyType: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    description: string;
  };
  user: {
    email: string;
    fullName: string;
    bio: string;
  };
}

export interface TermsData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
  acceptCookies: boolean;
}

export const useRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  const [formData, setFormData] = useState<FormData>({
    company: {
      name: "",
      companyType: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      description: "",
    },
    user: {
      email: "",
      fullName: "",
      bio: "",
    },
  });

  const [termsData, setTermsData] = useState<TermsData>({
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false,
    acceptCookies: false,
  });

  // Hooks de validación
  const { validateCompany } = useCompanyValidation();
  const { validateUser } = useUserValidation();
  const { validateTerms } = useTermsValidation();
  const { selectedPlan, handlePlanSelect } = usePlanSelection();

  // Handlers para cambios de datos
  const handleCompanyDataChange = (companyData: any) => {
    setFormData({ ...formData, company: companyData });
    clearRelevantErrors([
      "companyName",
      "companyType",
      "address",
      "city",
      "state",
      "phone",
    ]);
  };

  const handleUserDataChange = (userData: any) => {
    setFormData({ ...formData, user: userData });
    clearRelevantErrors(["fullName", "email", "bio"]);
  };

  const handleTermsDataChange = (data: any) => {
    setTermsData(data);
    clearRelevantErrors(["acceptTerms", "acceptPrivacy"]);
  };

  const handlePlanSelectionChange = (plan: Plan) => {
    handlePlanSelect(plan);
    setSelectedPlanId(plan.id);
    clearRelevantErrors(["plan"]);
  };

  // Validaciones para cada paso
  const validateCompanyStep = () => {
    const companyErrors = validateCompany(formData.company);
    if (Object.keys(companyErrors).length === 0) {
      setCurrentStep(2);
      setErrors({});
      return true;
    } else {
      setErrors(companyErrors);
      return false;
    }
  };

  const validateUserStep = () => {
    const isAdminRole = true;
    const userErrors = validateUser(formData.user, isAdminRole);
    if (Object.keys(userErrors).length === 0) {
      setCurrentStep(3);
      setErrors({});
      return true;
    } else {
      setErrors(userErrors);
      return false;
    }
  };

  const validatePlanStep = () => {
    if (!selectedPlanId) {
      setErrors({ plan: "Debes seleccionar un plan para continuar" });
      return false;
    }
    setCurrentStep(4);
    setErrors({});
    return true;
  };

  const validateTermsStep = () => {
    const termsErrors = validateTerms(termsData);
    if (Object.keys(termsErrors).length === 0) {
      return true;
    } else {
      setErrors(termsErrors);
      return false;
    }
  };

  // Navegación
  const goToPreviousStep = (targetStep: number) => {
    setCurrentStep(targetStep);
    setErrors({});
  };

  const goToSuccessStep = () => {
    setCurrentStep(5);
  };

  // Utilidades
  const clearRelevantErrors = (errorKeys: string[]) => {
    const hasRelevantErrors = errorKeys.some((key) => errors[key]);
    if (hasRelevantErrors) {
      const newErrors = { ...errors };
      errorKeys.forEach((key) => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setCurrentStep(1);
    setErrors({});
    setSelectedPlanId("");
    setRegistrationResult(null);
    setFormData({
      company: {
        name: "",
        companyType: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: "",
        description: "",
      },
      user: {
        email: "",
        fullName: "",
        bio: "",
      },
    });
    setTermsData({
      acceptTerms: false,
      acceptPrivacy: false,
      acceptMarketing: false,
      acceptCookies: false,
    });
  };

  return {
    // Estado
    currentStep,
    formData,
    termsData,
    errors,
    selectedPlanId,
    registrationResult,
    selectedPlan,

    // Setters
    setFormData,
    setTermsData,
    setRegistrationResult,
    setCurrentStep,

    // Handlers de cambio
    handleCompanyDataChange,
    handleUserDataChange,
    handleTermsDataChange,
    handlePlanSelectionChange,

    // Validaciones
    validateCompanyStep,
    validateUserStep,
    validatePlanStep,
    validateTermsStep,

    // Navegación
    goToPreviousStep,
    goToSuccessStep,
    clearAllErrors,
    resetForm,
  };
};
