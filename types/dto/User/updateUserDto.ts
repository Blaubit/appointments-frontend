// src/dto/update-user.dto.ts
import { IsString, IsEmail, IsUUID, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
    userId!: string;

    @IsOptional()
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    email?: string;

    @IsOptional()
    @IsString({ message: "La contraseña debe ser un texto" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    @MaxLength(50, { message: "La contraseña no debe superar los 50 caracteres" })
    password?: string;

    @IsOptional()
    @IsString({ message: "El avatar debe ser una URL válida" })
    avatar?: string;
}

// DTO específico para actualización de perfil
export class UpdateProfileDto {
    @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
    userId!: string;

    @IsOptional()
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    email?: string;

    @IsOptional()
    @IsString({ message: "El avatar debe ser una URL válida" })
    avatar?: string;

    @IsOptional()
    @IsString({ message: "El nombre completo debe ser un texto" })
    @MinLength(1, { message: "El nombre completo debe tener al menos 1 caracter" })
    @MaxLength(100, { message: "El nombre completo no debe superar los 100 caracteres" })
    fullName?: string;

    @IsOptional()
    @IsString({ message: "La biografía debe ser un texto" })
    @MaxLength(500, { message: "La biografía no debe superar los 500 caracteres" })
    bio?: string;

    @IsOptional()
    @IsUUID("4", { message: "El ID del rol debe ser un UUID válido" })
    roleId?: string;
}