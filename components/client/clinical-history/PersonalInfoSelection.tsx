"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, AlertCircle } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface PersonalInfoSectionProps {
  formData: PatientRecord;
  onInputChange: (field: keyof PatientRecord, value: string) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function PersonalInfoSection({
  formData,
  onInputChange,
  isLoading = false,
  errors = {},
}: PersonalInfoSectionProps) {
  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>Datos básicos del paciente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="nationalId"
              className={hasError("nationalId") ? "text-destructive" : ""}
            >
              DPI / Identificación *
            </Label>
            <Input
              id="nationalId"
              value={formData.nationalId}
              onChange={(e) => onInputChange("nationalId", e.target.value)}
              placeholder="Ej: 12345678"
              disabled={isLoading}
              className={hasError("nationalId") ? "border-destructive" : ""}
            />
            {hasError("nationalId") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("nationalId")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="gender"
              className={hasError("gender") ? "text-destructive" : ""}
            >
              Género *
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => onInputChange("gender", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                id="gender"
                className={hasError("gender") ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Seleccione género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {hasError("gender") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("gender")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="birthDate"
              className={hasError("birthDate") ? "text-destructive" : ""}
            >
              Fecha de Nacimiento *
            </Label>
            <DatePicker
              date={
                formData.birthDate ? new Date(formData.birthDate) : undefined
              }
              onDateChange={(date) =>
                onInputChange(
                  "birthDate",
                  date?.toISOString().split("T")[0] || ""
                )
              }
              disabled={isLoading}
            />
            {hasError("birthDate") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("birthDate")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="birthPlace"
              className={hasError("birthPlace") ? "text-destructive" : ""}
            >
              Lugar de Nacimiento *
            </Label>
            <Input
              id="birthPlace"
              value={formData.birthPlace}
              onChange={(e) => onInputChange("birthPlace", e.target.value)}
              placeholder="Ej: Ciudad de Guatemala"
              disabled={isLoading}
              className={hasError("birthPlace") ? "border-destructive" : ""}
            />
            {hasError("birthPlace") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("birthPlace")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="occupation"
              className={hasError("occupation") ? "text-destructive" : ""}
            >
              Ocupación *
            </Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => onInputChange("occupation", e.target.value)}
              placeholder="Ej: Ingeniero"
              disabled={isLoading}
              className={hasError("occupation") ? "border-destructive" : ""}
            />
            {hasError("occupation") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("occupation")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="maritalStatus"
              className={hasError("maritalStatus") ? "text-destructive" : ""}
            >
              Estado Civil *
            </Label>
            <Select
              value={formData.maritalStatus}
              onValueChange={(value) => onInputChange("maritalStatus", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                id="maritalStatus"
                className={
                  hasError("maritalStatus") ? "border-destructive" : ""
                }
              >
                <SelectValue placeholder="Seleccione estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Soltero">Soltero/a</SelectItem>
                <SelectItem value="Casado">Casado/a</SelectItem>
                <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                <SelectItem value="Viudo">Viudo/a</SelectItem>
                <SelectItem value="Unión Libre">Unión Libre</SelectItem>
              </SelectContent>
            </Select>
            {hasError("maritalStatus") && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getError("maritalStatus")}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className={`flex items-center gap-2 ${hasError("address") ? "text-destructive" : ""}`}
          >
            <MapPin className="h-4 w-4" />
            Dirección Completa *
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            placeholder="Ej: 123 Calle Principal, Zone 1, Guatemala City"
            rows={2}
            disabled={isLoading}
            className={hasError("address") ? "border-destructive" : ""}
          />
          {hasError("address") && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getError("address")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
