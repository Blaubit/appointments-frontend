"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  BarChart3,
  Shield,
  Zap,
  Menu,
  X,
  Stethoscope,
  Accessibility,
  Hospital,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Agenda Inteligente",
      description:
        "Gestiona todas tus citas desde un solo lugar con calendario interactivo y recordatorios automáticos.",
    },
    {
      icon: BarChart3,
      title: "Reportes Detallados",
      description:
        "Analiza tu negocio con estadísticas de citas, ingresos y rendimiento mensual.",
    },
    {
      icon: Shield,
      title: "Datos Seguros",
      description:
        "Tus datos están protegidos mediante encriptación avanzada y protocolos de seguridad.",
    },
    {
      icon: Zap,
      title: "Configuración Rápida",
      description:
        "Comienza en menos de 5 minutos. Sin instalaciones complicadas ni configuraciones técnicas.",
    },
  ];

  const services = [
    {
      icon: Stethoscope,
      name: "Consultorios Médicos",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      icon: Accessibility,
      name: "Centros de fisioterapia",
      color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
    },
    {
      icon: Hospital,
      name: "Hospitales",
      color:
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
  ];

  const plans = [
    {
      name: "Básico",
      price: "$29",
      period: "/mes",
      description: "Perfecto para profesionales independientes",
      features: [
        "Hasta 100 citas/mes",
        "Recordatorios por email",
        "Calendario básico",
        "Soporte por email",
      ],
      popular: false,
    },
    {
      name: "Profesional",
      price: "$59",
      period: "/mes",
      description: "Ideal para clínicas y consultorios",
      features: [
        "Citas ilimitadas",
        "Recordatorios SMS + Email",
        "Múltiples profesionales",
        "Reportes avanzados",
        "Soporte prioritario",
      ],
      popular: true,
    },
    {
      name: "Empresa",
      price: "$99",
      period: "/mes",
      description: "Para grandes organizaciones",
      features: [
        "Todo lo del plan Profesional",
        "API personalizada",
        "Integración con sistemas",
        "Soporte 24/7",
        "Capacitación incluida",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/favicon.png"
                  alt="Logo Planit"
                  className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                />

                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  PlanitGt
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                Características
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                Servicios
              </a>
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="#features"
                className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </a>
              <a
                href="#services"
                className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Servicios
              </a>
              <a
                href="#pricing"
                className="block text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </a>
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Gestiona tus citas de forma{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                inteligente
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              La plataforma todo-en-uno para profesionales que quieren optimizar
              su tiempo, reducir ausencias y hacer crecer su negocio. Sin
              complicaciones técnicas.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perfecto para cualquier tipo de servicio
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div
                  className={`inline-flex p-4 rounded-full ${service.color} mb-4`}
                >
                  <service.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  {service.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Todo lo que necesitas en una sola plataforma
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para hacer tu trabajo más fácil y
              eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow h-full"
              >
                <CardHeader className="pb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg w-fit mb-4">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Únete a miles de profesionales que ya optimizaron su gestión de
            citas
          </p>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              href="https://wa.me/50232470635?text=Hola%20quiero%20más%20información"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Contacta con Soporte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/favicon.png"
                  alt="Logo Planit"
                  className="h-8 w-8 sm:h-8 sm:w-8 object-contain"
                />

                <span className="text-lg sm:text-xl font-bold">PlanitGt</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                La plataforma líder en gestión de citas para profesionales.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2025 Planit. Desarrollado por Blaubit.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
