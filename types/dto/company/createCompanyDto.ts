import { IsString, IsUUID, IsOptional, IsDateString } from "class-validator";

export class createCompanyDto {
  @IsUUID("4", { message: "El id debe ser un UUID válido (versión 4)." })
  id: string;

  @IsString({ message: "El nombre es obligatorio y debe ser un texto." })
  name: string;

  @IsString({
    message: "El tipo de empresa es obligatorio y debe ser un texto.",
  })
  companyType: string;

  @IsString({ message: "La dirección es obligatoria y debe ser un texto." })
  address: string;

  @IsString({ message: "La ciudad es obligatoria y debe ser un texto." })
  city: string;

  @IsString({
    message: "El estado o provincia es obligatorio y debe ser un texto.",
  })
  state: string;

  @IsString({ message: "El código postal es obligatorio y debe ser un texto." })
  postalCode: string;

  @IsString({ message: "El país es obligatorio y debe ser un texto." })
  country: string;

  @IsOptional()
  @IsString({ message: "La descripción debe ser un texto." })
  description?: string;
}
