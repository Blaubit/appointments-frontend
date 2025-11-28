"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Plus, Trash2, AlertCircle } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface ChronicDiseasesSectionProps {
  chronicDiseases: PatientRecord["chronicDiseases"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function ChronicDiseasesSection({
  chronicDiseases,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
  errors = {},
}: ChronicDiseasesSectionProps) {
  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <AccordionItem value="chronic-diseases">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-5 w-5 text-red-500" />
            Enfermedades Crónicas ({chronicDiseases.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {chronicDiseases.map((disease, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`chronicDiseases.${index}. diseaseName`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Nombre de la Enfermedad *
                      </Label>
                      <Input
                        value={disease.diseaseName}
                        onChange={(e) =>
                          onUpdate(index, "diseaseName", e.target.value)
                        }
                        placeholder="Ej: Diabetes Tipo 2"
                        disabled={isLoading}
                        className={
                          hasError(`chronicDiseases.${index}.diseaseName`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`chronicDiseases.${index}.diseaseName`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`chronicDiseases.${index}.diseaseName`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`chronicDiseases.${index}.diagnosisDate`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Fecha de Diagnóstico *
                      </Label>
                      <DatePicker
                        date={
                          disease.diagnosisDate
                            ? new Date(disease.diagnosisDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "diagnosisDate",
                            date?.toISOString().split("T")[0] || ""
                          )
                        }
                        disabled={isLoading}
                      />
                      {hasError(`chronicDiseases. ${index}.diagnosisDate`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`chronicDiseases.${index}.diagnosisDate`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`chronicDiseases.${index}.treatment`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Tratamiento *
                      </Label>
                      <Input
                        value={disease.treatment}
                        onChange={(e) =>
                          onUpdate(index, "treatment", e.target.value)
                        }
                        placeholder="Ej: Metformina 500mg"
                        disabled={isLoading}
                        className={
                          hasError(`chronicDiseases. ${index}.treatment`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`chronicDiseases.${index}.treatment`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`chronicDiseases.${index}.treatment`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`chronicDiseases.${index}.severity`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Severidad *
                      </Label>
                      <Select
                        value={disease.severity}
                        onValueChange={(value) =>
                          onUpdate(index, "severity", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          className={
                            hasError(`chronicDiseases. ${index}.severity`)
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leve">Leve</SelectItem>
                          <SelectItem value="Moderada">Moderada</SelectItem>
                          <SelectItem value="Grave">Grave</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasError(`chronicDiseases.${index}.severity`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`chronicDiseases.${index}.severity`)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                    onClick={() => onRemove(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={onAdd}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Enfermedad Crónica
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
