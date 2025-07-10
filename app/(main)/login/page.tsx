"use server";
import type React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginClient from "./page.client";

// Función para verificar autenticación en el servidor
async function checkAuth() {
  // Si ya está autenticado, redirigir al dashboard
  // Aquí podrías validar el token con tu API/base de datos
  // Por simplicidad, asumimos que si existe el token, está autenticado
  //redirect('/dashboard')
}

// Función para manejar el login en el servidor
async function handleServerLogin(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const remember = formData.get("remember") === "on";
  redirect("/dashboard");
  // Validación básica
  if (!email || !password) {
    return {
      error: "Email y contraseña son requeridos",
    };
  }

  // Aquí harías la validación real con tu API/base de datos
  try {
    // Simulación de validación (reemplaza con tu lógica real)
    const isValidUser = await validateUser(email, password);

    if (!isValidUser) {
      return {
        error: "Credenciales inválidas",
      };
    }

    // Si la validación es exitosa, crear sesión

    const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 días o 1 día

    // En un caso real, aquí generarías un JWT o token de sesión
    const sessionToken = generateSessionToken(email);

    // Redirigir al dashboard
  } catch (error) {
    console.error("Error durante el login:", error);
    return {
      error: "Error interno del servidor",
    };
  }
}

// Función simulada para validar usuario (reemplaza con tu lógica real)
async function validateUser(email: string, password: string): Promise<boolean> {
  // Simulación - en un caso real consultarías tu base de datos
  // y verificarías el hash de la contraseña
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay de DB

  // Credenciales de ejemplo (NUNCA hardcodees en producción)
  return email === "admin@planit.com" && password === "password123";
}

// Función para generar token de sesión (usa una librería real como JWT)
function generateSessionToken(email: string): string {
  // En producción, usa una librería como jsonwebtoken
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return Buffer.from(`${email}:${timestamp}:${randomString}`).toString(
    "base64",
  );
}

// Función para obtener metadatos del servidor
async function getServerMetadata() {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "1.0.0",
  };
}

export default async function LoginPage() {
  // Verificar autenticación antes de renderizar
  await checkAuth();

  // Obtener datos del servidor si es necesario
  const serverMetadata = await getServerMetadata();

  return (
    <LoginClient
      serverAction={handleServerLogin}
      serverMetadata={serverMetadata}
    />
  );
}
