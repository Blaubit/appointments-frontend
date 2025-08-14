// src/dto/updateUserAvatarDto.ts
import { IsString, IsUUID, IsUrl } from "class-validator";

export class UpdateUserAvatarDto {
    @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
    userId!: string;

    @IsString({ message: "El avatar debe ser una URL válida" })
    @IsUrl({}, { message: "El avatar debe ser una URL válida" })
    avatar!: string;
}