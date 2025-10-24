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
import { Building2, MapPin, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { CompanyTypes } from "@/types";

interface CompanyData {
  name: string;
  companyType: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  description: string;
}

interface CompanyRegistrationCardProps {
  /** Datos de la empresa */
  companyData: CompanyData;
  /** Función para actualizar los datos de la empresa */
  onCompanyDataChange: (data: CompanyData) => void;
  /** Lista de tipos de empresa disponibles */
  companyTypes?: CompanyTypes[];
  /** Errores de validación */
  errors?: Record<string, string>;
  /** Función llamada al avanzar al siguiente paso */
  onNext?: () => void;
  /** Función llamada al retroceder al paso anterior */
  onPrevious?: () => void;
  /** Si mostrar el botón de anterior */
  showPreviousButton?: boolean;
  /** Si mostrar el botón de siguiente */
  showNextButton?: boolean;
  /** Texto del botón siguiente */
  nextButtonText?: string;
  /** Texto del botón anterior */
  previousButtonText?: string;
  /** Si el botón siguiente está deshabilitado */
  nextButtonDisabled?: boolean;
  /** Clase CSS adicional para el card */
  className?: string;
}

const defaultCompanyData: CompanyData = {
  name: "",
  companyType: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Guatemala",
  phone: "",
  description: "",
};

export default function CompanyRegistrationCard({
  companyData = defaultCompanyData,
  onCompanyDataChange,
  companyTypes = [],
  errors = {},
  onNext,
  onPrevious,
  showPreviousButton = false,
  showNextButton = true,
  nextButtonText = "Continuar",
  previousButtonText = "Anterior",
  nextButtonDisabled = false,
  className = "",
}: CompanyRegistrationCardProps) {
  const updateField = (field: keyof CompanyData, value: string) => {
    onCompanyDataChange({
      ...companyData,
      [field]: value,
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Información de la Empresa
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Registra tu clínica, consultorio o centro médico
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Nombre de la empresa */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Nombre de la Empresa *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyName"
              value={companyData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Clínica San Rafael"
              className={`pl-10 ${errors.companyName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.companyName && (
            <p className="text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>

        {/* Tipo de empresa */}
        <div className="space-y-2">
          <Label htmlFor="companyType">Tipo de Empresa *</Label>
          <Select
            value={companyData.companyType}
            onValueChange={(value) => updateField("companyType", value)}
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
            <p className="text-sm text-red-600">{errors.companyType}</p>
          )}
        </div>

        {/* Teléfono de la empresa */}
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Teléfono de la Empresa *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="companyPhone"
              type="tel"
              value={companyData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+502 2123-4567"
              className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <Separator />

        {/* Sección de dirección */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Dirección de la Empresa
          </h4>

          {/* Dirección principal */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={companyData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="6a Avenida 12-23, Zona 1"
                className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Grid de ciudad, departamento y código postal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={companyData.city}
                onChange={(e) => updateField("city", e.target.value)}
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
                value={companyData.state}
                onChange={(e) => updateField("state", e.target.value)}
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
                value={companyData.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                placeholder="01001"
              />
            </div>
          </div>

          {/* País */}
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={companyData.country}
              onChange={(e) => updateField("country", e.target.value)}
              placeholder="Guatemala"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description">Descripción de la Empresa</Label>
          <Textarea
            id="description"
            value={companyData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe tu empresa, servicios y especialidades..."
            rows={3}
          />
        </div>

        {/* Botones de navegación */}
        {(showPreviousButton || showNextButton) && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            {showPreviousButton ? (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {previousButtonText}
              </Button>
            ) : (
              <div /> // Spacer para mantener el layout
            )}

            {showNextButton && (
              <Button
                type="button"
                onClick={onNext}
                disabled={nextButtonDisabled}
                className="order-1 sm:order-2"
              >
                {nextButtonText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook personalizado para manejar la validación de la empresa
export function useCompanyValidation() {
  const validateCompany = (
    companyData: CompanyData
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!companyData.name.trim()) {
      errors.companyName = "El nombre de la empresa es requerido";
    }

    if (!companyData.companyType) {
      errors.companyType = "Selecciona el tipo de empresa";
    }

    if (!companyData.phone.trim()) {
      errors.phone = "El teléfono de la empresa es requerido";
    }

    if (!companyData.address.trim()) {
      errors.address = "La dirección es requerida";
    }

    if (!companyData.city.trim()) {
      errors.city = "La ciudad es requerida";
    }

    if (!companyData.state.trim()) {
      errors.state = "El departamento es requerido";
    }

    return errors;
  };

  const isValidCompany = (companyData: CompanyData): boolean => {
    const errors = validateCompany(companyData);
    return Object.keys(errors).length === 0;
  };

  return { validateCompany, isValidCompany };
}
