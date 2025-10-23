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
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { PatientRecord } from "@/types";

interface AllergiesSectionProps {
  allergies: PatientRecord["allergies"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
  isLoading?: boolean;
}

export function AllergiesSection({
  allergies,
  onAdd,
  onRemove,
  onUpdate,
  isLoading = false,
}: AllergiesSectionProps) {
  return (
    <AccordionItem value="allergies">
      <Card>
        <AccordionTrigger className="px-6 hover:no-underline">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alergias ({allergies.length})
          </CardTitle>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="space-y-4 pt-4">
            {allergies.map((allergy, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Alérgeno</Label>
                      <Input
                        value={allergy.allergen}
                        onChange={(e) =>
                          onUpdate(index, "allergen", e.target.value)
                        }
                        placeholder="Ej: Penicilina"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Reacción</Label>
                      <Input
                        value={allergy.reactionType}
                        onChange={(e) =>
                          onUpdate(index, "reactionType", e.target.value)
                        }
                        placeholder="Ej: Erupción cutánea"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Severidad</Label>
                      <Select
                        value={allergy.severity}
                        onValueChange={(value) =>
                          onUpdate(index, "severity", value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leve">Leve</SelectItem>
                          <SelectItem value="Moderada">Moderada</SelectItem>
                          <SelectItem value="Grave">Grave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Notas</Label>
                      <Textarea
                        value={allergy.notes}
                        onChange={(e) =>
                          onUpdate(index, "notes", e.target.value)
                        }
                        placeholder="Información adicional sobre la alergia"
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
              Agregar Alergia
            </Button>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
