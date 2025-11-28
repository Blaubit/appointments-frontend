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
import { Activity, Plus, Trash2, AlertCircle } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface HabitsSectionProps {
  habits: PatientRecord["habits"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function HabitsSection({
  habits,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
  errors = {},
}: HabitsSectionProps) {
  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <AccordionItem value="habits">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-orange-500" />
            Hábitos ({habits.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {habits.map((habit, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits.${index}.habitType`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Tipo de Hábito *
                      </Label>
                      <Select
                        value={habit.habitType}
                        onValueChange={(value) =>
                          onUpdate(index, "habitType", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          className={
                            hasError(`habits.${index}.habitType`)
                              ? "border-destructive"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tabaquismo">Tabaquismo</SelectItem>
                          <SelectItem value="Alcoholismo">
                            Alcoholismo
                          </SelectItem>
                          <SelectItem value="Ejercicio">Ejercicio</SelectItem>
                          <SelectItem value="Dieta">Dieta</SelectItem>
                          <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasError(`habits.${index}. habitType`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.habitType`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits.${index}.frequency`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Frecuencia *
                      </Label>
                      <Input
                        value={habit.frequency}
                        onChange={(e) =>
                          onUpdate(index, "frequency", e.target.value)
                        }
                        placeholder="Ej: 3 veces por semana"
                        disabled={isLoading}
                        className={
                          hasError(`habits.${index}.frequency`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`habits.${index}.frequency`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.frequency`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits.${index}.quantity`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Cantidad *
                      </Label>
                      <Input
                        value={habit.quantity}
                        onChange={(e) =>
                          onUpdate(index, "quantity", e.target.value)
                        }
                        placeholder="Ej: 1 paquete diario"
                        disabled={isLoading}
                        className={
                          hasError(`habits.${index}. quantity`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`habits.${index}.quantity`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.quantity`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits. ${index}.description`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Descripción *
                      </Label>
                      <Input
                        value={habit.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                        placeholder="Ej: Caminata y natación"
                        disabled={isLoading}
                        className={
                          hasError(`habits.${index}. description`)
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {hasError(`habits.${index}.description`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.description`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits. ${index}.startDate`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Fecha de Inicio *
                      </Label>
                      <DatePicker
                        date={
                          habit.startDate
                            ? new Date(habit.startDate)
                            : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "startDate",
                            date?.toISOString().split("T")[0] || ""
                          )
                        }
                        disabled={isLoading}
                      />
                      {hasError(`habits. ${index}.startDate`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.startDate`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          hasError(`habits.${index}.endDate`)
                            ? "text-destructive"
                            : ""
                        }
                      >
                        Fecha de Fin (si aplica)
                      </Label>
                      <DatePicker
                        date={
                          habit.endDate ? new Date(habit.endDate) : undefined
                        }
                        onDateChange={(date) =>
                          onUpdate(
                            index,
                            "endDate",
                            date ? date.toISOString().split("T")[0] : null
                          )
                        }
                        disabled={isLoading}
                        placeholder="Opcional"
                      />
                      {hasError(`habits.${index}.endDate`) && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {getError(`habits.${index}.endDate`)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Notas</Label>
                      <Textarea
                        value={habit.notes}
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
              Agregar Hábito
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
