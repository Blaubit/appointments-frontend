"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  FileText,
  Eye,
  Check,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Users,
  Lock,
  Bell,
  ExternalLink,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface TermsData {
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
  acceptCookies: boolean;
}

interface TermsAndConditionsCardProps {
  /** Datos de términos y condiciones */
  termsData: TermsData;
  /** Función para actualizar los datos */
  onTermsDataChange: (data: TermsData) => void;
  /** Errores de validación */
  errors?: Record<string, string>;
  /** Función llamada al avanzar al siguiente paso */
  onNext?: () => void;
  /** Función llamada al retroceder al paso anterior */
  onPrevious?: () => void;
  /** Si mostrar el botón de anterior */
  showPreviousButton?: boolean;
  /** Si mostrar el botón de siguiente */
  showNextButton?: boolean;
  /** Texto del botón siguiente */
  nextButtonText?: string;
  /** Texto del botón anterior */
  previousButtonText?: string;
  /** Si el botón siguiente está deshabilitado */
  nextButtonDisabled?: boolean;
  /** Clase CSS adicional para el card */
  className?: string;
  /** Título personalizado */
  title?: string;
  /** Descripción personalizada */
  description?: string;
  /** Tipo de empresa (para personalizar términos) */
  companyType?: string;
  /** Nombre de la empresa */
  companyName?: string;
}

const defaultTermsData: TermsData = {
  acceptTerms: false,
  acceptPrivacy: false,
  acceptMarketing: false,
  acceptCookies: false,
};

export default function TermsAndConditionsCard({
  termsData = defaultTermsData,
  onTermsDataChange,
  errors = {},
  onNext,
  onPrevious,
  showPreviousButton = true,
  showNextButton = true,
  nextButtonText = "Continuar",
  previousButtonText = "Anterior",
  nextButtonDisabled = false,
  className = "",
  title = "Términos y Condiciones",
  description = "Revisa y acepta nuestros términos para completar el registro",
  companyType = "clínica",
  companyName = "tu empresa",
}: TermsAndConditionsCardProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const updateField = (field: keyof TermsData, value: boolean) => {
    onTermsDataChange({
      ...termsData,
      [field]: value,
    });
  };

  const isAllRequiredAccepted = () => {
    return termsData.acceptTerms && termsData.acceptPrivacy;
  };

  // Contenido de términos personalizados para empresas médicas
  const getTermsContent = () => ({
    terms: {
      title: "Términos de Servicio para Empresas Médicas",
      sections: [
        {
          title: "1. Aceptación de Términos",
          content: `Al registrar ${companyName} en CitasFácil, aceptas cumplir con estos términos de servicio y todas las políticas aplicables.`,
        },
        {
          title: "2. Uso del Servicio",
          content: `El servicio está diseñado para ${companyType}s y centros médicos. Te comprometes a:
          • Proporcionar información veraz sobre tu empresa
          • Cumplir con las regulaciones locales de salud
          • Gestionar responsablemente las citas de tus pacientes
          • Mantener la confidencialidad de los datos médicos
          • Usar la plataforma de manera ética y profesional`,
        },
        {
          title: "3. Responsabilidades de la Empresa",
          content: `Como empresa médica registrada, eres responsable de:
          • Verificar la identidad de los pacientes
          • Mantener registros médicos precisos
          • Cumplir con HIPAA y regulaciones locales
          • Proporcionar atención médica de calidad
          • Gestionar adecuadamente los datos de pacientes`,
        },
        {
          title: "4. Limitaciones del Servicio",
          content: `CitasFácil es una herramienta de gestión y no:
          • Proporciona consejos médicos
          • Se responsabiliza por decisiones clínicas
          • Garantiza resultados de tratamiento
          • Almacena información médica sensible sin cifrado`,
        },
        {
          title: "5. Facturación y Pagos",
          content: `Los términos de facturación incluyen:
          • Pagos mensuales o según el plan seleccionado
          • Cancelación con 30 días de anticipación
          • Reembolsos según política específica
          • Suspensión por falta de pago`,
        },
      ],
    },
    privacy: {
      title: "Política de Privacidad y Protección de Datos",
      sections: [
        {
          title: "1. Recopilación de Datos",
          content: `Recopilamos información necesaria para:
          • Funcionamiento del servicio de citas
          • Comunicación con pacientes y personal
          • Cumplimiento de regulaciones médicas
          • Mejora continua del servicio`,
        },
        {
          title: "2. Protección de Datos Médicos",
          content: `Implementamos medidas de seguridad estrictas:
          • Encriptación de datos médicos sensibles
          • Acceso controlado por roles y permisos
          • Auditoría de accesos y cambios
          • Backups seguros y recuperación de datos
          • Cumplimiento con normativas de privacidad`,
        },
        {
          title: "3. Uso de la Información",
          content: `Los datos se utilizan únicamente para:
          • Gestión de citas y pacientes
          • Comunicación autorizada
          • Reportes y análisis (datos anonimizados)
          • Cumplimiento legal y regulatorio`,
        },
        {
          title: "4. Compartir Información",
          content: `No compartimos datos personales excepto:
          • Con autorización explícita del paciente
          • Cuando la ley lo requiera
          • Con proveedores de servicios bajo acuerdos estrictos
          • En emergencias médicas según protocolos`,
        },
        {
          title: "5. Derechos del Usuario",
          content: `Los pacientes tienen derecho a:
          • Acceder a sus datos personales
          • Solicitar correcciones
          • Eliminar información (con limitaciones legales)
          • Portar datos a otros sistemas
          • Presentar quejas ante autoridades`,
        },
      ],
    },
    cookies: {
      title: "Política de Cookies y Tecnologías Similares",
      sections: [
        {
          title: "Cookies Esenciales",
          content: `Necesarias para el funcionamiento básico:
          • Autenticación de sesión
          • Seguridad de formularios
          • Configuraciones de usuario
          • Funcionalidad de citas`,
        },
        {
          title: "Cookies de Análisis",
          content: `Para mejorar nuestro servicio:
          • Estadísticas de uso
          • Rendimiento del sistema
          • Errores y problemas técnicos
          • Datos anonimizados únicamente`,
        },
      ],
    },
  });

  const termsContent = getTermsContent();

  const DialogContent_Terms = ({
    type,
  }: {
    type: "terms" | "privacy" | "cookies";
  }) => {
    const content =
      type === "terms"
        ? termsContent.terms
        : type === "privacy"
          ? termsContent.privacy
          : termsContent.cookies;

    return (
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === "terms" && <FileText className="h-5 w-5" />}
            {type === "privacy" && <Lock className="h-5 w-5" />}
            {type === "cookies" && <Eye className="h-5 w-5" />}
            <span>{content.title}</span>
          </DialogTitle>
          <DialogDescription>
            Información detallada sobre nuestras políticas y términos
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {section.content}
                </div>
                {index < content.sections.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    );
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base px-2">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Términos de Servicio */}
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-2 text-sm sm:text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Términos de Servicio para Empresas Médicas
                </h4>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Al registrar tu empresa en CitasFácil, aceptas:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Proporcionar información veraz sobre tu empresa</li>
                    <li>Cumplir con las regulaciones locales de salud</li>
                    <li>
                      Gestionar responsablemente las citas de tus pacientes
                    </li>
                    <li>Mantener la confidencialidad de los datos médicos</li>
                    <li>Usar la plataforma de manera ética y profesional</li>
                  </ul>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver completo
                  </Button>
                </DialogTrigger>
                <DialogContent_Terms type="terms" />
              </Dialog>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              checked={termsData.acceptTerms}
              onCheckedChange={(checked) =>
                updateField("acceptTerms", checked as boolean)
              }
              className={errors.acceptTerms ? "border-red-500" : ""}
            />
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="acceptTerms"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                He leído y acepto los términos y condiciones *
              </Label>
              <p className="text-xs text-gray-500">
                Al marcar esta casilla, confirmas que has leído y aceptas
                nuestros términos de servicio
              </p>
            </div>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 ml-6">{errors.acceptTerms}</p>
          )}
        </div>

        <Separator />

        {/* Política de Privacidad */}
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-2 text-sm sm:text-base flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-green-600" />
                  Política de Privacidad y Protección de Datos
                </h4>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Protegemos la información de tu empresa y pacientes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Encriptación de datos médicos sensibles</li>
                    <li>Cumplimiento con normativas de privacidad</li>
                    <li>Acceso controlado por roles y permisos</li>
                    <li>Backups seguros y recuperación de datos</li>
                    <li>Auditoría de accesos y cambios</li>
                  </ul>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver completo
                  </Button>
                </DialogTrigger>
                <DialogContent_Terms type="privacy" />
              </Dialog>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptPrivacy"
              checked={termsData.acceptPrivacy}
              onCheckedChange={(checked) =>
                updateField("acceptPrivacy", checked as boolean)
              }
              className={errors.acceptPrivacy ? "border-red-500" : ""}
            />
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="acceptPrivacy"
                className="text-xs sm:text-sm font-medium cursor-pointer"
              >
                He leído y acepto la política de privacidad *
              </Label>
              <p className="text-xs text-gray-500">
                Entiendo cómo se manejan y protegen los datos en la plataforma
              </p>
            </div>
          </div>
          {errors.acceptPrivacy && (
            <p className="text-sm text-red-600 ml-6">{errors.acceptPrivacy}</p>
          )}
        </div>

        <Separator />

        {/* Términos Opcionales */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            Preferencias Adicionales (Opcionales)
          </h4>

          {/* Marketing */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptMarketing"
              checked={termsData.acceptMarketing}
              onCheckedChange={(checked) =>
                updateField("acceptMarketing", checked as boolean)
              }
            />
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="acceptMarketing"
                className="text-xs sm:text-sm font-medium cursor-pointer flex items-center"
              >
                <Bell className="h-3 w-3 mr-2 text-blue-500" />
                Recibir actualizaciones y ofertas especiales
              </Label>
              <p className="text-xs text-gray-500">
                Mantente informado sobre nuevas funcionalidades, promociones y
                contenido educativo
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acceptCookies"
                checked={termsData.acceptCookies}
                onCheckedChange={(checked) =>
                  updateField("acceptCookies", checked as boolean)
                }
              />
              <div className="space-y-1 flex-1">
                <Label
                  htmlFor="acceptCookies"
                  className="text-xs sm:text-sm font-medium cursor-pointer flex items-center"
                >
                  <Eye className="h-3 w-3 mr-2 text-purple-500" />
                  Aceptar cookies de análisis y mejora
                </Label>
                <p className="text-xs text-gray-500">
                  Nos ayudas a mejorar la plataforma analizando cómo se usa
                  (datos anonimizados)
                </p>
              </div>
            </div>

            <div className="ml-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-blue-600"
                  >
                    Ver política de cookies
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent_Terms type="cookies" />
              </Dialog>
            </div>
          </div>
        </div>

        {/* Información legal adicional */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 text-sm">
                Información Importante
              </h5>
              <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <p>
                  • Puedes cambiar tus preferencias en cualquier momento desde
                  la configuración
                </p>
                <p>
                  • Los términos pueden actualizarse; te notificaremos sobre
                  cambios importantes
                </p>
                <p>• Para dudas legales, contacta a nuestro equipo jurídico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.general}
            </p>
          </div>
        )}

        {/* Botones de navegación */}
        {(showPreviousButton || showNextButton) && (
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            {showPreviousButton ? (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {previousButtonText}
              </Button>
            ) : (
              <div /> // Spacer para mantener el layout
            )}

            {showNextButton && (
              <Button
                type="button"
                onClick={onNext}
                disabled={nextButtonDisabled || !isAllRequiredAccepted()}
                className="order-1 sm:order-2"
              >
                {nextButtonText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Links de ayuda */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>¿Tienes preguntas sobre nuestros términos?</p>
          <div className="flex justify-center space-x-4">
            <Link href="/help/terms">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
              >
                Centro de Ayuda
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
            <span>•</span>
            <Link href="/contact">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
              >
                Contactar Soporte
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para manejar la validación de términos
export function useTermsValidation() {
  const validateTerms = (termsData: TermsData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!termsData.acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    if (!termsData.acceptPrivacy) {
      errors.acceptPrivacy = "Debes aceptar la política de privacidad";
    }

    return errors;
  };

  const isValidTerms = (termsData: TermsData): boolean => {
    const errors = validateTerms(termsData);
    return Object.keys(errors).length === 0;
  };

  return { validateTerms, isValidTerms };
}
