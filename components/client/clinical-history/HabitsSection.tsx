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
import { Activity, Plus, Trash2 } from "lucide-react";
import { PatientRecord } from "@/types";
import { DatePicker } from "@/components/client/clinical-history/DatePicker";

interface HabitsSectionProps {
  habits: PatientRecord["habits"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
}

export function HabitsSection({
  habits,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
}: HabitsSectionProps) {
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
                      <Label>Tipo de Hábito</Label>
                      <Select
                        value={habit.habitType}
                        onValueChange={(value) =>
                          onUpdate(index, "habitType", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
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
                    </div>
                    <div className="space-y-2">
                      <Label>Frecuencia</Label>
                      <Input
                        value={habit.frequency}
                        onChange={(e) =>
                          onUpdate(index, "frequency", e.target.value)
                        }
                        placeholder="Ej: 3 veces por semana"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        value={habit.quantity}
                        onChange={(e) =>
                          onUpdate(index, "quantity", e.target.value)
                        }
                        placeholder="Ej: 1 paquete diario"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        value={habit.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                        placeholder="Ej: Caminata y natación"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Inicio</Label>
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
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Fin (si aplica)</Label>
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
