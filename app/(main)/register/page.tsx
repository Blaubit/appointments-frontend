"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Calendar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Phone,
  MapPin,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Scissors,
  Wrench,
  GraduationCap,
  Heart,
  Zap,
  Star,
  Shield,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<"professional" | "client" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Professional Information
    businessName: "",
    businessType: "",
    specialization: "",
    license: "",
    experience: "",

    // Business Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "México",

    // Business Details
    website: "",
    description: "",
    services: [] as string[],

    // Preferences
    acceptTerms: false,
    acceptMarketing: false,
    acceptNotifications: true,
  })

  const businessTypes = [
    { id: "medical", name: "Consultorio Médico", icon: Stethoscope, color: "text-blue-600" },
    { id: "dental", name: "Consultorio Dental", icon: Stethoscope, color: "text-green-600" },
    { id: "beauty", name: "Salón de Belleza", icon: Scissors, color: "text-pink-600" },
    { id: "therapy", name: "Terapia Física", icon: Heart, color: "text-purple-600" },
    { id: "maintenance", name: "Taller/Servicios", icon: Wrench, color: "text-orange-600" },
    { id: "education", name: "Centro Educativo", icon: GraduationCap, color: "text-indigo-600" },
    { id: "other", name: "Otro", icon: Zap, color: "text-gray-600" },
  ]

  const commonServices = {
    medical: ["Consulta General", "Consulta Especializada", "Revisión Rutinaria", "Urgencias"],
    dental: ["Limpieza Dental", "Ortodoncia", "Endodoncia", "Cirugía Oral"],
    beauty: ["Corte y Peinado", "Coloración", "Manicure", "Pedicure", "Tratamientos Faciales"],
    therapy: ["Terapia Física", "Rehabilitación", "Masajes Terapéuticos", "Electroterapia"],
    maintenance: ["Reparación", "Mantenimiento", "Instalación", "Consultoría"],
    education: ["Clases Particulares", "Tutorías", "Cursos", "Talleres"],
    other: ["Consulta", "Servicio Básico", "Servicio Premium"],
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "El nombre es requerido"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "El apellido es requerido"
      }
      if (!formData.email.trim()) {
        newErrors.email = "El email es requerido"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email inválido"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "El teléfono es requerido"
      }
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida"
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }

    if (step === 2 && userType === "professional") {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "El nombre del negocio es requerido"
      }
      if (!formData.businessType) {
        newErrors.businessType = "Selecciona el tipo de negocio"
      }
      if (!formData.address.trim()) {
        newErrors.address = "La dirección es requerida"
      }
      if (!formData.city.trim()) {
        newErrors.city = "La ciudad es requerida"
      }
    }

    if (step === 3) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "Debes aceptar los términos y condiciones"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Registration data:", { userType, ...formData })

    setIsLoading(false)
    setCurrentStep(4) // Success step
  }

  const toggleService = (service: string) => {
    const services = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service]

    setFormData({ ...formData, services })
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información Personal"
      case 2:
        return  "Preferencias"
      case 3:
        return "Términos y Condiciones"
      case 4:
        return "¡Registro Exitoso!"
      default:
        return "Registro"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Completa tu información personal para crear tu cuenta"
      case 2:
        return "Configura la información de tu negocio o consultorio"
          
      case 3:
        return "Revisa y acepta nuestros términos para completar el registro"
      case 4:
        return "Tu cuenta ha sido creada exitosamente"
      default:
        return "Completa el proceso de registro"
    }
  }

  const totalSteps = userType === "professional" ? 4 : 4

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
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Planit
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Únete a miles de profesionales que ya optimizaron su gestión de citas
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{getStepTitle()}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getStepDescription()}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: User Type Selection */}
              {/* Step 2: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Tu nombre"
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Tu apellido"
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Repite tu contraseña"
                          className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep <= 1}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Information (Professional) or Preferences (Client) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del Negocio *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Consultorio Dr. Silva"
                        className={`pl-10 ${errors.businessName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.businessName && <p className="text-sm text-red-600">{errors.businessName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de Negocio *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                    >
                      <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona tu tipo de negocio" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessType && <p className="text-sm text-red-600">{errors.businessType}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Especialización</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="Medicina General"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">Número de Licencia</Label>
                      <Input
                        id="license"
                        value={formData.license}
                        onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                        placeholder="MD-12345"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Dirección del Negocio</h4>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Av. Principal 123"
                          className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ciudad *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Ciudad"
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="Estado"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.businessType && commonServices[formData.businessType as keyof typeof commonServices] && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">Servicios que Ofreces</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {commonServices[formData.businessType as keyof typeof commonServices].map((service) => (
                          <div
                            key={service}
                            className={`p-3 border rounded-lg cursor-pointer transition-all text-sm ${
                              formData.services.includes(service)
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                            }`}
                            onClick={() => toggleService(service)}
                          >
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción del Negocio</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe tu negocio y servicios..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep < 1}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-fit mx-auto">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Términos y Condiciones</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Revisa y acepta nuestros términos para completar el registro
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 max-h-40 overflow-y-auto">
                      <h4 className="font-medium mb-2">Términos de Servicio</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>Al usar Planit, aceptas:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Proporcionar información veraz y actualizada</li>
                          <li>Usar la plataforma de manera responsable</li>
                          <li>Respetar los horarios y políticas de los profesionales</li>
                          <li>No usar la plataforma para actividades ilegales</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 max-h-40 overflow-y-auto">
                      <h4 className="font-medium mb-2">Política de Privacidad</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>Tu privacidad es importante para nosotros:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Protegemos tu información personal</li>
                          <li>No compartimos datos sin tu consentimiento</li>
                          <li>Usamos encriptación para proteger tus datos</li>
                          <li>Puedes eliminar tu cuenta en cualquier momento</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                        className={errors.acceptTerms ? "border-red-500" : ""}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="acceptTerms" className="text-sm font-medium">
                          Acepto los términos y condiciones *
                        </Label>
                        <p className="text-xs text-gray-500">
                          Al marcar esta casilla, confirmas que has leído y aceptas nuestros{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            términos de servicio
                          </Link>{" "}
                          y{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            política de privacidad
                          </Link>
                        </p>
                      </div>
                    </div>
                    {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                    <Button type="submit" disabled={isLoading || !formData.acceptTerms}>
                      {isLoading ? (
                        <>
                          <div className="spinner mr-2"></div>
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear Cuenta
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {currentStep === 4 && (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">¡Cuenta Creada Exitosamente!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Bienvenido a Planit, {formData.firstName}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-4">¿Qué sigue?</h4>
                    <div className="space-y-3 text-sm text-blue-800 dark:text-blue-400">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-3" />
                        <span>Revisa tu email para verificar tu cuenta</span>
                      </div>
                      {userType === "professional" && (
                        <>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-3" />
                            <span>Configura tu horario de trabajo</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-3" />
                            <span>Personaliza tus servicios y precios</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-3" />
                        <span>Completa tu perfil para mejores resultados</span>
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
                      <Button variant="outline" className="w-full">
                        Iniciar Sesión Más Tarde
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </form>

            {/* Social Registration (only on first steps) */}
            

            {/* Login Link */}
            {currentStep <= 2 && (
              <div className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login">
                  <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                    Inicia sesión aquí
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        {currentStep <= 2 && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-xs text-muted-foreground">100% Seguro</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-xs text-muted-foreground">Configuración Rápida</p>
            </div>
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-xs text-muted-foreground">Soporte 24/7</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Al registrarte, aceptas nuestros</p>
          <div className="flex justify-center space-x-4 mt-1">
            <Link href="/terms">
              <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600">
                Términos de Servicio
              </Button>
            </Link>
            <span>•</span>
            <Link href="/privacy">
              <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600">
                Política de Privacidad
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
