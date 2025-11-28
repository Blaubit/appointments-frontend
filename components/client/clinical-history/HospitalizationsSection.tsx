"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Building2, Plus, Trash2, AlertCircle } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface HospitalizationsSectionProps {
  hospitalizations: PatientRecord["hospitalizations"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function HospitalizationsSection({
  hospitalizations,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
  errors = {},
}: HospitalizationsSectionProps) {
  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <AccordionItem value="hospitalizations">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-blue-500" />
            Hospitalizaciones ({hospitalizations.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {hospitalizations.map((hosp, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`hospitalizations.${index}.hospital`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Hospital *
                      </Label>
                      <Input
                        value={hosp.hospital}
                        onChange={(e) =>
                          onUpdate(index, "hospital", e.target.value)
                        }
                        placeholder="Ej: Hospital Universitario"
                        disabled={isLoading}
                        className={
                          hasError(`hospitalizations.${index}.hospital`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`hospitalizations.${index}.hospital`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`hospitalizations.${index}.hospital`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`hospitalizations.${index}.reason`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Motivo *
                      </Label>
                      <Input
                        value={hosp.reason}
                        onChange={(e) =>
                          onUpdate(index, "reason", e.target.value)
                        }
                        placeholder="Ej: Neumonía aguda"
                        disabled={isLoading}
                        className={
                          hasError(`hospitalizations.${index}.reason`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`hospitalizations.${index}.reason`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`hospitalizations.${index}.reason`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`hospitalizations.${index}.admissionDate`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Fecha de Admisión *
                      </Label>
                      <DatePicker
                        date={
                          hosp.admissionDate
                            ? new Date(hosp.admissionDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "admissionDate",
                            date?.toISOString().split("T")[0] || ""
                          )
                        }
                        disabled={isLoading}
                      />
                      {hasError(`hospitalizations.${index}.admissionDate`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`hospitalizations.${index}.admissionDate`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`hospitalizations.${index}.dischargeDate`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Fecha de Alta *
                      </Label>
                      <DatePicker
                        date={
                          hosp.dischargeDate
                            ? new Date(hosp.dischargeDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "dischargeDate",
                            date?.toISOString().split("T")[0] || ""
                          )
                        }
                        disabled={isLoading}
                      />
                      {hasError(`hospitalizations.${index}.dischargeDate`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`hospitalizations. ${index}.dischargeDate`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        className={
                          hasError(`hospitalizations.${index}.diagnosis`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Diagnóstico *
                      </Label>
                      <Textarea
                        value={hosp.diagnosis}
                        onChange={(e) =>
                          onUpdate(index, "diagnosis", e.target.value)
                        }
                        placeholder="Diagnóstico completo"
                        rows={2}
                        disabled={isLoading}
                        className={
                          hasError(`hospitalizations.${index}. diagnosis`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`hospitalizations.${index}.diagnosis`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`hospitalizations.${index}.diagnosis`)}
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
              Agregar Hospitalización
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
