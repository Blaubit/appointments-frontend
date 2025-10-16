"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Save, Loader2 } from "lucide-react";
import { savePatientRecord } from "@/actions/clients/create-history";
import { PatientRecord } from "@/types";
import { PersonalInfoSection } from "@/components/client/clinical-history/PersonalInfoSelection";
import { ChronicDiseasesSection } from "@/components/client/clinical-history/ChronicDiseasesSection";
import { AllergiesSection } from "@/components/client/clinical-history/AllergiesSection";
import { HospitalizationsSection } from "@/components/client/clinical-history/HospitalizationsSection";
import { MedicationsSection } from "@/components/client/clinical-history/MedicationSection";
import { FamilyHistorySection } from "@/components/client/clinical-history/FamilyHistorySection";
import { HabitsSection } from "@/components/client/clinical-history/HabitsSection";

interface ClinicalHistoryFormProps {
  clientId: string;
  initialData?: PatientRecord | null;
  mode: "create" | "update";
  onCancel?: () => void;
}

const defaultFormData: PatientRecord = {
  gender: "",
  nationalId: "",
  birthDate: "",
  birthPlace: "",
  address: "",
  occupation: "",
  maritalStatus: "",
  chronicDiseases: [],
  allergies: [],
  hospitalizations: [],
  currentMedications: [],
  familyHistory: [],
  habits: [],
};

export function ClinicalHistoryForm({
  clientId,
  initialData,
  mode,
  onCancel,
}: ClinicalHistoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<PatientRecord>(
    initialData || defaultFormData
  );

  // Actualizar el formulario si cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Manejadores para campos simples
  const handleInputChange = (field: keyof PatientRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Manejadores para arrays
  const addArrayItem = (field: keyof PatientRecord, item: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item],
    }));
  };

  const removeArrayItem = (field: keyof PatientRecord, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };

  const updateArrayItem = (
    field: keyof PatientRecord,
    index: number,
    fieldName: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) =>
        i === index ? { ...item, [fieldName]: value } : item
      ),
    }));
  };

  // Manejador de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await savePatientRecord(clientId, formData);

      if (result.success) {
        toast({
          title: "✅ Registro guardado",
          description: `La información del paciente se ${
            mode === "create" ? "creó" : "actualizó"
          } correctamente`,
        });
        router.push("/clients");
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error al guardar",
          description:
            result.error || "Ocurrió un error al guardar el registro",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Ocurrió un error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/clients");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Información Personal */}
        <PersonalInfoSection
          formData={formData}
          onInputChange={handleInputChange}
          isLoading={isLoading}
        />

        {/* Historial Médico - Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {/* Enfermedades Crónicas */}
          <ChronicDiseasesSection
            chronicDiseases={formData.chronicDiseases}
            onAdd={() =>
              addArrayItem("chronicDiseases", {
                diseaseName: "",
                diagnosisDate: "",
                treatment: "",
                severity: "",
              })
            }
            onRemove={(index) => removeArrayItem("chronicDiseases", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("chronicDiseases", index, field, value)
            }
            isLoading={isLoading}
          />

          {/* Alergias */}
          <AllergiesSection
            allergies={formData.allergies}
            onAdd={() =>
              addArrayItem("allergies", {
                allergen: "",
                reactionType: "",
                severity: "",
                notes: "",
              })
            }
            onRemove={(index) => removeArrayItem("allergies", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("allergies", index, field, value)
            }
            isLoading={isLoading}
          />

          {/* Hospitalizaciones */}
          <HospitalizationsSection
            hospitalizations={formData.hospitalizations}
            onAdd={() =>
              addArrayItem("hospitalizations", {
                admissionDate: "",
                dischargeDate: "",
                hospital: "",
                reason: "",
                diagnosis: "",
              })
            }
            onRemove={(index) => removeArrayItem("hospitalizations", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("hospitalizations", index, field, value)
            }
            isLoading={isLoading}
          />

          {/* Medicamentos Actuales */}
          <MedicationsSection
            medications={formData.currentMedications}
            onAdd={() =>
              addArrayItem("currentMedications", {
                medicationName: "",
                dosage: "",
                frequency: "",
                prescriptionDate: "",
                prescribingDoctor: "",
                purpose: "",
              })
            }
            onRemove={(index) => removeArrayItem("currentMedications", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("currentMedications", index, field, value)
            }
            isLoading={isLoading}
          />

          {/* Historial Familiar */}
          <FamilyHistorySection
            familyHistory={formData.familyHistory}
            onAdd={() =>
              addArrayItem("familyHistory", {
                relative: "",
                diseaseName: "",
                ageAtDiagnosis: 0,
                notes: "",
              })
            }
            onRemove={(index) => removeArrayItem("familyHistory", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("familyHistory", index, field, value)
            }
            isLoading={isLoading}
          />

          {/* Hábitos */}
          <HabitsSection
            habits={formData.habits}
            onAdd={() =>
              addArrayItem("habits", {
                habitType: "",
                frequency: "",
                description: "",
                quantity: "",
                notes: "",
                startDate: "",
                endDate: null,
              })
            }
            onRemove={(index) => removeArrayItem("habits", index)}
            onUpdate={(index, field, value) =>
              updateArrayItem("habits", index, field, value)
            }
            isLoading={isLoading}
          />
        </Accordion>

        {/* Botones de Acción */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {mode === "create"
                      ? "Guardar Registro Completo"
                      : "Actualizar Registro"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
