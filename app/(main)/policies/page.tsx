"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Calendar, Shield, Menu, X, Mail, FileText } from "lucide-react";

export default function Component() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("privacy");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Planit
                </span>
              </div>
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <ThemeToggle />
              <div className="flex space-x-2">
                <Button
                  variant={activeSection === "privacy" ? "default" : "outline"}
                  onClick={() => setActiveSection("privacy")}
                  className="flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacidad</span>
                </Button>
                <Button
                  variant={activeSection === "terms" ? "default" : "outline"}
                  onClick={() => setActiveSection("terms")}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Términos</span>
                </Button>
              </div>
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
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="/login" className="w-full">
                  <Button
                    variant={
                      activeSection === "privacy" ? "default" : "outline"
                    }
                    onClick={() => setActiveSection("privacy")}
                    className="w-full"
                  >
                    Privacidad
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button
                    variant={activeSection === "terms" ? "default" : "outline"}
                    onClick={() => setActiveSection("terms")}
                    className="w-full bg-gradient-to-r  hover:from-blue-600"
                  >
                    Terminos
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {activeSection === "privacy" && (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl">
                  Política de Privacidad
                </CardTitle>
                <CardDescription className="text-lg">
                  Última actualización:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        1. Información que Recopilamos
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Recopilamos información que nos proporcionas
                          directamente, como cuando creas una cuenta, utilizas
                          nuestros servicios o te comunicas con nosotros.
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Información de cuenta (nombre, email, contraseña)
                          </li>
                          <li>Información de perfil y preferencias</li>
                          <li>
                            Contenido que compartes a través de nuestros
                            servicios
                          </li>
                          <li>Comunicaciones contigo</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        2. Cómo Utilizamos tu Información
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>Utilizamos la información recopilada para:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Proporcionar, mantener y mejorar nuestros servicios
                          </li>
                          <li>
                            Procesar transacciones y enviar confirmaciones
                          </li>
                          <li>
                            Enviar comunicaciones técnicas y actualizaciones
                          </li>
                          <li>Responder a comentarios y preguntas</li>
                          <li>Proteger contra fraude y abuso</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        3. Compartir Información
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          No vendemos, intercambiamos ni transferimos tu
                          información personal a terceros sin tu consentimiento,
                          excepto en las siguientes circunstancias:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Con proveedores de servicios que nos ayudan a operar
                          </li>
                          <li>Para cumplir con obligaciones legales</li>
                          <li>Para proteger nuestros derechos y seguridad</li>
                          <li>Con tu consentimiento explícito</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        4. Seguridad de Datos
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Implementamos medidas de seguridad técnicas y
                          organizativas apropiadas para proteger tu información
                          personal contra acceso no autorizado, alteración,
                          divulgación o destrucción.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        5. Tus Derechos
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>Tienes derecho a:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Acceder a tu información personal</li>
                          <li>Rectificar información inexacta</li>
                          <li>Solicitar la eliminación de tu información</li>
                          <li>Limitar el procesamiento de tu información</li>
                          <li>Portabilidad de datos</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        6. Contacto
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Si tienes preguntas sobre esta política de privacidad,
                          puedes contactarnos en:
                        </p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>privacidad@miapp.com</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {activeSection === "terms" && (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl">Términos de Uso</CardTitle>
                <CardDescription className="text-lg">
                  Última actualización:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        1. Aceptación de Términos
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Al acceder y utilizar esta aplicación, aceptas estar
                          sujeto a estos términos de uso. Si no estás de acuerdo
                          con alguno de estos términos, no debes usar nuestros
                          servicios.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        2. Descripción del Servicio
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Nuestra aplicación proporciona [descripción de tu
                          servicio]. Nos reservamos el derecho de modificar o
                          discontinuar el servicio en cualquier momento.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        3. Cuentas de Usuario
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Para utilizar ciertos aspectos del servicio, debes:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Proporcionar información precisa y completa</li>
                          <li>Mantener la seguridad de tu cuenta</li>
                          <li>
                            Notificar inmediatamente cualquier uso no autorizado
                          </li>
                          <li>
                            Ser responsable de toda actividad en tu cuenta
                          </li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        4. Uso Aceptable
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>Te comprometes a NO:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Usar el servicio para actividades ilegales</li>
                          <li>Interferir con el funcionamiento del servicio</li>
                          <li>Intentar acceder a cuentas de otros usuarios</li>
                          <li>Transmitir contenido ofensivo o dañino</li>
                          <li>Violar derechos de propiedad intelectual</li>
                        </ul>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        5. Propiedad Intelectual
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          El servicio y su contenido original, características y
                          funcionalidad son y seguirán siendo propiedad
                          exclusiva de [Tu Empresa] y sus licenciantes.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        6. Limitación de Responsabilidad
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          En ningún caso seremos responsables por daños
                          indirectos, incidentales, especiales, consecuentes o
                          punitivos, incluyendo pérdida de beneficios, datos,
                          uso, buena voluntad u otras pérdidas intangibles.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        7. Terminación
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Podemos terminar o suspender tu cuenta inmediatamente,
                          sin previo aviso o responsabilidad, por cualquier
                          motivo, incluyendo el incumplimiento de estos
                          términos.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        8. Cambios en los Términos
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Nos reservamos el derecho de modificar estos términos
                          en cualquier momento. Te notificaremos sobre cambios
                          significativos.
                        </p>
                      </div>
                    </section>

                    <Separator />

                    <section>
                      <h2 className="text-2xl font-semibold mb-3 text-primary">
                        9. Contacto
                      </h2>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          Si tienes preguntas sobre estos términos, puedes
                          contactarnos en:
                        </p>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>legal@miapp.com</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Última actualización: {new Date().toLocaleDateString("es-ES")}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 Mi Aplicación. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
