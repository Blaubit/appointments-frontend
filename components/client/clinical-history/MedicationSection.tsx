"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pill, Plus, Trash2 } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface MedicationsSectionProps {
  medications: PatientRecord["currentMedications"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
}

export function MedicationsSection({
  medications,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
}: MedicationsSectionProps) {
  return (
    <AccordionItem value="medications">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <Pill className="h-5 w-5 text-green-500" />
            Medicamentos Actuales ({medications.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {medications.map((med, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Medicamento</Label>
                      <Input
                        value={med.medicationName}
                        onChange={(e) =>
                          onUpdate(index, "medicationName", e.target.value)
                        }
                        placeholder="Ej: Metformina"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosis</Label>
                      <Input
                        value={med.dosage}
                        onChange={(e) =>
                          onUpdate(index, "dosage", e.target.value)
                        }
                        placeholder="Ej: 850mg"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frecuencia</Label>
                      <Input
                        value={med.frequency}
                        onChange={(e) =>
                          onUpdate(index, "frequency", e.target.value)
                        }
                        placeholder="Ej: 2 veces al día"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Prescripción</Label>
                      <DatePicker
                        date={
                          med.prescriptionDate
                            ? new Date(med.prescriptionDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "prescriptionDate",
                            date?.toISOString().split("T")[0] || ""
                          )
                        }
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Médico Prescriptor</Label>
                      <Input
                        value={med.prescribingDoctor}
                        onChange={(e) =>
                          onUpdate(index, "prescribingDoctor", e.target.value)
                        }
                        placeholder="Ej: Dr. Hernández"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Propósito</Label>
                      <Input
                        value={med.purpose}
                        onChange={(e) =>
                          onUpdate(index, "purpose", e.target.value)
                        }
                        placeholder="Ej: Control de glucemia"
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
              Agregar Medicamento
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
