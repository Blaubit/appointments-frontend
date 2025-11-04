// types/dto/service/updateServiceDto.ts
export interface updateServiceDto {
  id: string;
  name: string;
  durationMinutes: number;
  price: number; // Cambiar a number para coincidir con tu DTO
  professionalsIds?: string[]; // Agregado campo opcional professionalsIds
}
