"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Users, Plus, Trash2, AlertCircle } from "lucide-react";
import { PatientRecord } from "@/types";

interface FamilyHistorySectionProps {
  familyHistory: PatientRecord["familyHistory"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function FamilyHistorySection({
  familyHistory,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
  errors = {},
}: FamilyHistorySectionProps) {
  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <AccordionItem value="family-history">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-purple-500" />
            Historial Familiar ({familyHistory.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {familyHistory.map((history, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`familyHistory.${index}.relative`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Familiar *
                      </Label>
                      <Select
                        value={history.relative}
                        onValueChange={(value) =>
                          onUpdate(index, "relative", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          className={
                            hasError(`familyHistory.${index}.relative`)
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Padre">Padre</SelectItem>
                          <SelectItem value="Madre">Madre</SelectItem>
                          <SelectItem value="Hermano">Hermano</SelectItem>
                          <SelectItem value="Hermana">Hermana</SelectItem>
                          <SelectItem value="Abuelo">Abuelo</SelectItem>
                          <SelectItem value="Abuela">Abuela</SelectItem>
                          <SelectItem value="Tío">Tío</SelectItem>
                          <SelectItem value="Tía">Tía</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasError(`familyHistory. ${index}.relative`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`familyHistory.${index}.relative`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`familyHistory.${index}.diseaseName`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Enfermedad *
                      </Label>
                      <Input
                        value={history.diseaseName}
                        onChange={(e) =>
                          onUpdate(index, "diseaseName", e.target.value)
                        }
                        placeholder="Ej: Diabetes Tipo 2"
                        disabled={isLoading}
                        className={
                          hasError(`familyHistory. ${index}.diseaseName`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`familyHistory. ${index}.diseaseName`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`familyHistory.${index}.diseaseName`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`familyHistory.${index}. ageAtDiagnosis`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Edad al Diagnóstico *
                      </Label>
                      <Input
                        type="number"
                        value={history.ageAtDiagnosis}
                        onChange={(e) =>
                          onUpdate(
                            index,
                            "ageAtDiagnosis",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Ej: 55"
                        disabled={isLoading}
                        className={
                          hasError(`familyHistory.${index}.ageAtDiagnosis`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`familyHistory.${index}.ageAtDiagnosis`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`familyHistory.${index}.ageAtDiagnosis`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Notas</Label>
                      <Textarea
                        value={history.notes}
                        onChange={(e) =>
                          onUpdate(index, "notes", e.target.value)
                        }
                        placeholder="Información adicional"
                        rows={2}
                        disabled={isLoading}
                      />
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
              Agregar Historial Familiar
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
