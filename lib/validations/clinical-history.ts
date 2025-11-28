export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validación de Información Personal
export const validatePersonalInfo = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.nationalId?.trim()) {
    errors.push({ field: "nationalId", message: "El DPI es requerido" });
  }

  if (!data.gender?.trim()) {
    errors.push({ field: "gender", message: "El género es requerido" });
  }

  if (!data.birthDate?.trim()) {
    errors.push({
      field: "birthDate",
      message: "La fecha de nacimiento es requerida",
    });
  }

  if (!data.birthPlace?.trim()) {
    errors.push({
      field: "birthPlace",
      message: "El lugar de nacimiento es requerido",
    });
  }

  if (!data.address?.trim()) {
    errors.push({ field: "address", message: "La dirección es requerida" });
  }

  if (!data.occupation?.trim()) {
    errors.push({ field: "occupation", message: "La ocupación es requerida" });
  }

  if (!data.maritalStatus?.trim()) {
    errors.push({
      field: "maritalStatus",
      message: "El estado civil es requerido",
    });
  }

  return errors;
};

// Validación de Enfermedades Crónicas
export const validateChronicDiseases = (diseases: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  diseases.forEach((disease, index) => {
    if (!disease.diseaseName?.trim()) {
      errors.push({
        field: `chronicDiseases. ${index}.diseaseName`,
        message: `Enfermedad ${index + 1}: El nombre es requerido`,
      });
    }

    if (!disease.diagnosisDate?.trim()) {
      errors.push({
        field: `chronicDiseases.${index}.diagnosisDate`,
        message: `Enfermedad ${index + 1}: La fecha de diagnóstico es requerida`,
      });
    }

    if (!disease.treatment?.trim()) {
      errors.push({
        field: `chronicDiseases.${index}.treatment`,
        message: `Enfermedad ${index + 1}: El tratamiento es requerido`,
      });
    }

    if (!disease.severity?.trim()) {
      errors.push({
        field: `chronicDiseases.${index}.severity`,
        message: `Enfermedad ${index + 1}: La severidad es requerida`,
      });
    }
  });

  return errors;
};

// Validación de Alergias
export const validateAllergies = (allergies: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  allergies.forEach((allergy, index) => {
    if (!allergy.allergen?.trim()) {
      errors.push({
        field: `allergies.${index}.allergen`,
        message: `Alergia ${index + 1}: El alérgeno es requerido`,
      });
    }

    if (!allergy.reactionType?.trim()) {
      errors.push({
        field: `allergies.${index}.reactionType`,
        message: `Alergia ${index + 1}: El tipo de reacción es requerido`,
      });
    }

    if (!allergy.severity?.trim()) {
      errors.push({
        field: `allergies.${index}.severity`,
        message: `Alergia ${index + 1}: La severidad es requerida`,
      });
    }
  });

  return errors;
};

// Validación de Hospitalizaciones
export const validateHospitalizations = (
  hospitalizations: any[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  hospitalizations.forEach((hosp, index) => {
    if (!hosp.hospital?.trim()) {
      errors.push({
        field: `hospitalizations.${index}.hospital`,
        message: `Hospitalización ${index + 1}: El nombre del hospital es requerido`,
      });
    }

    if (!hosp.admissionDate?.trim()) {
      errors.push({
        field: `hospitalizations.${index}.admissionDate`,
        message: `Hospitalización ${index + 1}: La fecha de admisión es requerida`,
      });
    }

    if (!hosp.dischargeDate?.trim()) {
      errors.push({
        field: `hospitalizations.${index}. dischargeDate`,
        message: `Hospitalización ${index + 1}: La fecha de alta es requerida`,
      });
    }

    if (!hosp.reason?.trim()) {
      errors.push({
        field: `hospitalizations.${index}.reason`,
        message: `Hospitalización ${index + 1}: El motivo es requerido`,
      });
    }

    if (!hosp.diagnosis?.trim()) {
      errors.push({
        field: `hospitalizations.${index}.diagnosis`,
        message: `Hospitalización ${index + 1}: El diagnóstico es requerido`,
      });
    }

    // Validar que la fecha de alta sea posterior a la de admisión
    if (hosp.admissionDate && hosp.dischargeDate) {
      const admission = new Date(hosp.admissionDate);
      const discharge = new Date(hosp.dischargeDate);
      if (discharge < admission) {
        errors.push({
          field: `hospitalizations.${index}.dischargeDate`,
          message: `Hospitalización ${index + 1}: La fecha de alta debe ser posterior a la de admisión`,
        });
      }
    }
  });

  return errors;
};

// Validación de Medicamentos
export const validateMedications = (medications: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  medications.forEach((med, index) => {
    if (!med.medicationName?.trim()) {
      errors.push({
        field: `currentMedications.${index}.medicationName`,
        message: `Medicamento ${index + 1}: El nombre es requerido`,
      });
    }

    if (!med.dosage?.trim()) {
      errors.push({
        field: `currentMedications.${index}.dosage`,
        message: `Medicamento ${index + 1}: La dosis es requerida`,
      });
    }

    if (!med.frequency?.trim()) {
      errors.push({
        field: `currentMedications.${index}.frequency`,
        message: `Medicamento ${index + 1}: La frecuencia es requerida`,
      });
    }

    if (!med.prescriptionDate?.trim()) {
      errors.push({
        field: `currentMedications.${index}. prescriptionDate`,
        message: `Medicamento ${index + 1}: La fecha de prescripción es requerida`,
      });
    }

    if (!med.prescribingDoctor?.trim()) {
      errors.push({
        field: `currentMedications.${index}.prescribingDoctor`,
        message: `Medicamento ${index + 1}: El médico prescriptor es requerido`,
      });
    }

    if (!med.purpose?.trim()) {
      errors.push({
        field: `currentMedications.${index}.purpose`,
        message: `Medicamento ${index + 1}: El propósito es requerido`,
      });
    }
  });

  return errors;
};

// Validación de Historial Familiar
export const validateFamilyHistory = (
  familyHistory: any[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  familyHistory.forEach((history, index) => {
    if (!history.relative?.trim()) {
      errors.push({
        field: `familyHistory.${index}.relative`,
        message: `Historial Familiar ${index + 1}: El familiar es requerido`,
      });
    }

    if (!history.diseaseName?.trim()) {
      errors.push({
        field: `familyHistory.${index}. diseaseName`,
        message: `Historial Familiar ${index + 1}: La enfermedad es requerida`,
      });
    }

    if (!history.ageAtDiagnosis || history.ageAtDiagnosis <= 0) {
      errors.push({
        field: `familyHistory.${index}.ageAtDiagnosis`,
        message: `Historial Familiar ${index + 1}: La edad al diagnóstico debe ser mayor a 0`,
      });
    }
  });

  return errors;
};

// Validación de Hábitos
export const validateHabits = (habits: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  habits.forEach((habit, index) => {
    if (!habit.habitType?.trim()) {
      errors.push({
        field: `habits.${index}.habitType`,
        message: `Hábito ${index + 1}: El tipo de hábito es requerido`,
      });
    }

    if (!habit.frequency?.trim()) {
      errors.push({
        field: `habits.${index}.frequency`,
        message: `Hábito ${index + 1}: La frecuencia es requerida`,
      });
    }

    if (!habit.quantity?.trim()) {
      errors.push({
        field: `habits.${index}.quantity`,
        message: `Hábito ${index + 1}: La cantidad es requerida`,
      });
    }

    if (!habit.description?.trim()) {
      errors.push({
        field: `habits.${index}.description`,
        message: `Hábito ${index + 1}: La descripción es requerida`,
      });
    }

    if (!habit.startDate?.trim()) {
      errors.push({
        field: `habits.${index}.startDate`,
        message: `Hábito ${index + 1}: La fecha de inicio es requerida`,
      });
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (habit.startDate && habit.endDate) {
      const start = new Date(habit.startDate);
      const end = new Date(habit.endDate);
      if (end < start) {
        errors.push({
          field: `habits.${index}.endDate`,
          message: `Hábito ${index + 1}: La fecha de fin debe ser posterior a la de inicio`,
        });
      }
    }
  });

  return errors;
};

// Validación completa del formulario
export const validatePatientRecord = (data: any): ValidationResult => {
  const allErrors: ValidationError[] = [
    ...validatePersonalInfo(data),
    ...validateChronicDiseases(data.chronicDiseases || []),
    ...validateAllergies(data.allergies || []),
    ...validateHospitalizations(data.hospitalizations || []),
    ...validateMedications(data.currentMedications || []),
    ...validateFamilyHistory(data.familyHistory || []),
    ...validateHabits(data.habits || []),
  ];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};
