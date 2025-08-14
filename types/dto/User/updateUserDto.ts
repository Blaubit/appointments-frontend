// src/dto/create-user.dto.ts
import { IsString, IsEmail, IsUUID, MinLength, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
    userId!: string;
    // en el body de el  no se envia el fullName
    // @IsString({ message: "El nombre completo debe ser un texto" })
    // @MinLength(3, { message: "El nombre completo debe tener al menos 3 caracteres" })
    // @MaxLength(100, { message: "El nombre completo no debe superar los 100 caracteres" })
    // fullName!: string;

    @IsEmail({}, { message: "El correo electrónico no es válido" })
    email!: string;

    @IsString({ message: "La contraseña debe ser un texto" })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    @MaxLength(50, { message: "La contraseña no debe superar los 50 caracteres" })
    password!: string;

    // @IsString({ message: "La biografía debe ser un texto" })
    // @MinLength(10, { message: "La biografía debe tener al menos 10 caracteres" })
    // @MaxLength(500, { message: "La biografía no debe superar los 500 caracteres" })
    // bio!: string;
}
