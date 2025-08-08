import { IsString, IsNotEmpty, IsDateString, Matches } from 'class-validator';

export class appointmentDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string; // Formato: YYYY-MM-DD

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in the format HH:mm',
  })
  @IsNotEmpty()
  startTime: string; // Formato: HH:mm

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  notes?: string;
}
