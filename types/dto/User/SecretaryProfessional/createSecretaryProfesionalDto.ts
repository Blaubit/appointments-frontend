// src/dto/create-secretary-professional.dto.ts
import { IsUUID, IsBoolean } from "class-validator";

export class CreateSecretaryProfessionalDto {
  @IsUUID("4", { message: "El ID de la secretaria debe ser un UUID válido" })
  secretaryId!: string;

  @IsUUID("4", { message: "El ID del profesional debe ser un UUID válido" })
  professionalId!: string;

  @IsBoolean({ message: "El estado debe ser un valor booleano" })
  isActive!: boolean;
}
