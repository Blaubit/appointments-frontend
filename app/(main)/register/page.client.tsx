"use client";

import type React from "react";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import { CompanyTypes, Role } from "@/types";
import { type RegistrationData } from "@/types/user";

interface RegisterClientProps {
  companyTypes: CompanyTypes[];
  roles: Role[];
  onCreateCompany: (companyData: any) => Promise<any>;
  onCreateUser: (userData: any) => Promise<any>;
}

export default function RegisterClient({
  companyTypes = [],
  roles = [],
  onCreateCompany,
  onCreateUser,
}: RegisterClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState<RegistrationData>({
    company: {
      name: "",
      companyType: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Guatemala",
      description: "",
      id: "",
      createdAt: "",
    },
    user: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      bio: "",
    },
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validar datos de la empresa
      if (!formData.company.name.trim()) {
        newErrors.companyName = "El nombre de la empresa es requerido";
      }
      if (!formData.company.companyType) {
        newErrors.companyType = "Selecciona el tipo de empresa";
      }
      if (!formData.company.address.trim()) {
        newErrors.address = "La dirección es requerida";
      }
      if (!formData.company.city.trim()) {
        newErrors.city = "La ciudad es requerida";
      }
      if (!formData.company.state.trim()) {
        newErrors.state = "El departamento es requerido";
      }
    }

    if (step === 2) {
      // Validar datos del usuario
      if (!formData.user.fullName.trim()) {
        newErrors.fullName = "El nombre completo es requerido";
      } else if (formData.user.fullName.trim().length < 3) {
        newErrors.fullName =
          "El nombre completo debe tener al menos 3 caracteres";
      }

      if (!formData.user.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.user.email)) {
        newErrors.email = "Email inválido";
      }

      if (!formData.user.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.user.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
      }

      if (formData.user.password !== formData.user.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }

      // Validar biografía (mínimo 10 caracteres según el DTO)
      if (
        (formData.user.bio ?? "").trim().length > 0 &&
        (formData.user.bio ?? "").trim().length < 10
      ) {
        newErrors.bio = "La biografía debe tener al menos 10 caracteres";
      }
    }

    if (step === 3) {
      if (!acceptTerms) {
        newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Buscar el rol admin_empresa
      const adminRole = roles.find((role) => role.name === "admin_empresa");

      if (!adminRole) {
        setErrors({
          submit:
            "No se pudo encontrar el rol de administrador. Contacta con soporte.",
        });
        return;
      }


      // 2. PASO 1: Crear la empresa primero usando la función del servidor
      console.log("Creando empresa...");
      const companyPayload = {
        name: formData.company.name.trim(),
        companyType: formData.company.companyType,
        address: formData.company.address.trim(),
        city: formData.company.city.trim(),
        state: formData.company.state.trim(),
        postal_code: formData.company.postal_code.trim() || "00000",
        country: formData.company.country.trim(),
        description: formData.company.description?.trim() || "",
      };

      const companyResponse = await onCreateCompany(companyPayload);

      if (companyResponse.status !== 200 && companyResponse.status !== 201) {
        console.error("Error creando empresa:", companyResponse);
        setErrors({
          submit:
            companyResponse.message ||
            "Error al crear la empresa. Inténtalo de nuevo.",
        });
        return;
      }

      console.log("Empresa creada exitosamente:", companyResponse.data);
      const createdCompany = companyResponse.data;

      // 3. PASO 2: Crear el usuario admin con el ID de la empresa creada usando la función del servidor
      console.log("Creando usuario administrador...");

      // Validar que la biografía tenga al menos 10 caracteres (requerido por el DTO)
      let bio = (formData.user.bio ?? "").trim();
      if (bio.length === 0) {
        bio =
          "Administrador de empresa médica con experiencia en gestión y atención al paciente.";
      } else if (bio.length < 10) {
        bio = bio + " Experiencia en gestión médica.";
      }

      const userPayload = {
        roleId: adminRole.id, // ID real del rol
        fullName: formData.user.fullName.trim(),
        email: formData.user.email.trim(),
        password: formData.user.password,
        bio: bio,
        companyId: createdCompany.id, // ID de la empresa recién creada
      };

      const userResponse = await onCreateUser(userPayload);

      if (userResponse.status !== 200 && userResponse.status !== 201) {
        console.error("Error creando usuario:", userResponse);
        setErrors({
          submit:
            userResponse.message ||
            "Error al crear el usuario administrador. Inténtalo de nuevo.",
        });
        return;
      }

      console.log(
        "Usuario administrador creado exitosamente:",
        userResponse.data,
      );

      // 4. Si llegamos aquí, todo fue exitoso
      console.log("Registro completo exitoso:", {
        empresa: createdCompany,
        usuario: userResponse.data,
      });

      setCurrentStep(4); // Success step
    } catch (error) {
      console.error("Error en el registro:", error);
      setErrors({
        submit: "Error inesperado al crear la cuenta. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información de la Empresa";
      case 2:
        return "Datos del Administrador";
      case 3:
        return "Términos y Condiciones";
      case 4:
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
        return "Crea tu cuenta de administrador para gestionar la empresa";
      case 3:
        return "Revisa y acepta nuestros términos para completar el registro";
      case 4:
        return "Tu empresa y cuenta de administrador han sido creadas exitosamente";
      default:
        return "Completa el proceso de registro";
    }
  };

  const totalSteps = 3;

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

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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
            {currentStep <= totalSteps && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            )}

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {getStepTitle()}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 px-2">
                {getStepDescription()}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        value={formData.company.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: {
                              ...formData.company,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="Clínica San Rafael"
                        className={`pl-10 ${errors.companyName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-sm text-red-600">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyType">Tipo de Empresa *</Label>
                    <Select
                      value={formData.company.companyType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, companyType: value },
                        })
                      }
                    >
                      <SelectTrigger
                        className={errors.companyType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Selecciona el tipo de empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.companyType && (
                      <p className="text-sm text-red-600">
                        {errors.companyType}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Dirección de la Empresa
                    </h4>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.company.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                address: e.target.value,
                              },
                            })
                          }
                          placeholder="6a Avenida 12-23, Zona 1"
                          className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad *</Label>
                        <Input
                          id="city"
                          value={formData.company.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                city: e.target.value,
                              },
                            })
                          }
                          placeholder="Guatemala"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Departamento *</Label>
                        <Input
                          id="state"
                          value={formData.company.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                state: e.target.value,
                              },
                            })
                          }
                          placeholder="Guatemala"
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && (
                          <p className="text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          value={formData.company.postal_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: {
                                ...formData.company,
                                postal_code: e.target.value,
                              },
                            })
                          }
                          placeholder="01001"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.company.country}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: {
                              ...formData.company,
                              country: e.target.value,
                            },
                          })
                        }
                        placeholder="Guatemala"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Descripción de la Empresa
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.company.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe tu empresa, servicios y especialidades..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto"
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Administrator User Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-fit mx-auto">
                      <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Cuenta de Administrador
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm px-2">
                        Esta será tu cuenta principal para gestionar la empresa
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm sm:text-base">
                      Rol: Administrador de Empresa
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-400">
                      Tendrás acceso completo para gestionar usuarios, citas,
                      servicios y configuraciones de la empresa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={formData.user.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: {
                              ...formData.user,
                              fullName: e.target.value,
                            },
                          })
                        }
                        placeholder="Dr. Juan Carlos Pérez"
                        className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.user.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user: { ...formData.user, email: e.target.value },
                          })
                        }
                        placeholder="admin@clinica.com"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.user.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              user: {
                                ...formData.user,
                                password: e.target.value,
                              },
                            })
                          }
                          placeholder="Mínimo 8 caracteres"
                          className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar Contraseña *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.user.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              user: {
                                ...formData.user,
                                confirmPassword: e.target.value,
                              },
                            })
                          }
                          placeholder="Repite tu contraseña"
                          className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía Profesional</Label>
                    <Textarea
                      id="bio"
                      value={formData.user.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          user: { ...formData.user, bio: e.target.value },
                        })
                      }
                      placeholder="Describe tu experiencia profesional, especialidades, etc... (mínimo 10 caracteres si completas)"
                      rows={3}
                      className={errors.bio ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-gray-500">
                      {(formData.user.bio?.trim().length ?? 0) === 0
                        ? "Campo opcional, pero si lo completas debe tener al menos 10 caracteres"
                        : `${formData.user.bio?.trim().length ?? 0} caracteres`}
                    </p>
                    {errors.bio && (
                      <p className="text-sm text-red-600">{errors.bio}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="order-2 sm:order-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="order-1 sm:order-2"
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Terms and Conditions */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto">
                      <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Términos y Condiciones
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm px-2">
                        Revisa y acepta nuestros términos para completar el
                        registro
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 max-h-32 sm:max-h-40 overflow-y-auto">
                      <h4 className="font-medium mb-2 text-sm sm:text-base">
                        Términos de Servicio para Empresas
                      </h4>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>Al registrar tu empresa en CitasFácil, aceptas:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>
                            Proporcionar información veraz sobre tu empresa
                          </li>
                          <li>Cumplir con las regulaciones locales de salud</li>
                          <li>
                            Gestionar responsablemente las citas de tus
                            pacientes
                          </li>
                          <li>
                            Mantener la confidencialidad de los datos médicos
                          </li>
                          <li>
                            Usar la plataforma de manera ética y profesional
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 max-h-32 sm:max-h-40 overflow-y-auto">
                      <h4 className="font-medium mb-2 text-sm sm:text-base">
                        Política de Privacidad
                      </h4>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>
                          Protegemos la información de tu empresa y pacientes:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Encriptación de datos médicos sensibles</li>
                          <li>Cumplimiento con normativas de privacidad</li>
                          <li>Acceso controlado por roles y permisos</li>
                          <li>Backups seguros y recuperación de datos</li>
                          <li>Auditoría de accesos y cambios</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        className={errors.acceptTerms ? "border-red-500" : ""}
                      />
                      <div className="space-y-1 flex-1">
                        <Label
                          htmlFor="acceptTerms"
                          className="text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          Acepto los términos y condiciones *
                        </Label>
                        <p className="text-xs text-gray-500">
                          Al marcar esta casilla, confirmas que has leído y
                          aceptas nuestros términos de servicio y política de
                          privacidad
                        </p>
                      </div>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600">
                        {errors.acceptTerms}
                      </p>
                    )}

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptMarketing"
                        checked={acceptMarketing}
                        onCheckedChange={(checked) =>
                          setAcceptMarketing(checked as boolean)
                        }
                      />
                      <div className="space-y-1 flex-1">
                        <Label
                          htmlFor="acceptMarketing"
                          className="text-xs sm:text-sm font-medium cursor-pointer"
                        >
                          Recibir actualizaciones y ofertas especiales
                        </Label>
                        <p className="text-xs text-gray-500">
                          Mantente informado sobre nuevas funcionalidades y
                          promociones
                        </p>
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="order-2 sm:order-1"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !acceptTerms}
                      className="order-1 sm:order-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creando empresa...
                        </>
                      ) : (
                        <>
                          Crear Empresa
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
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
                            (t) => t.value === formData.company.companyType,
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
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Iniciar Sesión Más Tarde
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Features Section */}
        {currentStep <= 3 && (
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

        {/* Footer */}
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
      </div>
    </div>
  );
}
