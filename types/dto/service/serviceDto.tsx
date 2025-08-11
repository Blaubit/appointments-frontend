import { IsString, IsNotEmpty } from "class-validator";

export class serviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  durationMinutes: number; // Duration in minutes

  @IsNotEmpty()
  price: number; // Price in the local currency
}
