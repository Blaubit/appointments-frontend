"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, Lock, Eye, EyeOff, Clock, Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <ThemeToggle className="rounded-full" />
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Planit
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Gestiona tus citas de forma inteligente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Recordar mi sesión
                </Label>
              </div>

              <Link href="/dashboard">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-lg"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </form>

            <div className="text-center">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-blue-600">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Acceso rápido</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="h-12 justify-start">
                <Stethoscope className="mr-3 h-4 w-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Soy Profesional</div>
                  <div className="text-xs text-muted-foreground">Médico, dentista, peluquero, etc.</div>
                </div>
              </Button>
              <Button variant="outline" className="h-12 justify-start">
                <Clock className="mr-3 h-4 w-4 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Soy Cliente</div>
                  <div className="text-xs text-muted-foreground">Quiero reservar una cita</div>
                </div>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register">
                <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700">
                  Regístrate aquí
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xs text-muted-foreground">Agenda Online</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-xs text-muted-foreground">24/7 Disponible</p>
          </div>
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <Stethoscope className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-xs text-muted-foreground">Multi-Servicios</p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Al continuar, aceptas nuestros</p>
          <div className="flex justify-center space-x-4 mt-1">
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600">
              Términos de Servicio
            </Button>
            <span>•</span>
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600">
              Política de Privacidad
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
