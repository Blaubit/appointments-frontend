import {
  IsString,
  IsNotEmpty,
  IsDateString,
  Matches,
  IsUUID,
  IsNumber,
  IsPositive,
} from "class-validator";

export class appointmentDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string[];

  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string; // Formato: YYYY-MM-DD

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: "startTime must be in the format HH:mm",
  })
  @IsNotEmpty()
  startTime: string; // Formato: HH:mm

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  notes?: string;

  // costo de la cita
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class updateAppointmentStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
