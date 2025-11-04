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
          title: "1. Aceptación de los Términos",
          content: `Al registrar una empresa médica, clínica o centro de salud (en adelante, “la Empresa”) en la plataforma planitgt, aceptas expresamente cumplir con los presentes Términos de Servicio, así como con nuestras Políticas de Privacidad, Políticas de Facturación y cualquier otro lineamiento o normativa complementaria que se publique dentro del sitio o aplicación.

El uso continuado del servicio constituye tu aceptación de los términos, condiciones y modificaciones que puedan realizarse de forma periódica. Si no estás de acuerdo con alguna parte de estos términos, deberás abstenerte de utilizar la plataforma.`,
        },
        {
          title: "2. Uso del Servicio",
          content: `planitgt es una plataforma tecnológica creada para la gestión de citas médicas y administración operativa de clínicas. El servicio está destinado exclusivamente a centros médicos, consultorios, clínicas, hospitales, laboratorios o profesionales de la salud autorizados.

Al utilizar la plataforma, te comprometes a:

• Proporcionar información veraz, actualizada y comprobable sobre tu empresa.
• Cumplir con las regulaciones locales y nacionales en materia de salud, protección de datos y ejercicio profesional.
• Gestionar las citas de pacientes de forma responsable, transparente y eficiente.
• Mantener la confidencialidad y seguridad de toda la información médica y personal a la que tengas acceso.
• Utilizar la plataforma de forma ética, profesional y dentro de los fines previstos por planitgt.

Cualquier uso indebido del sistema —como la manipulación de datos, suplantación de identidad o divulgación no autorizada de información— podrá derivar en la suspensión o cancelación inmediata de la cuenta.`,
        },
        {
          title: "3. Responsabilidades de la Empresa",
          content: `Como empresa médica registrada, reconoces y aceptas que eres únicamente responsable de la información, los datos y las acciones realizadas dentro de tu cuenta. En particular, te comprometes a:

• Verificar la identidad de los pacientes antes de generar, modificar o cancelar citas.
• Mantener registros médicos precisos y actualizados, cuando aplique.
• Cumplir con las leyes locales de confidencialidad de datos personales y médicos, incluyendo aquellas relacionadas con la protección de la privacidad.
• Brindar atención médica de calidad, conforme a los estándares éticos y profesionales aplicables.
• Resguardar de forma segura los datos de los pacientes, adoptando las medidas necesarias para prevenir accesos no autorizados, pérdidas o alteraciones.
• Capacitar a su personal sobre el uso adecuado de la plataforma y la correcta manipulación de la información.

planitgt no asume responsabilidad alguna por el incumplimiento de estas obligaciones por parte de la Empresa o de sus representantes.`,
        },
        {
          title: "4. Limitaciones del Servicio",
          content: `planitgt actúa exclusivamente como una herramienta tecnológica de apoyo para la gestión de citas, pacientes y procesos administrativos. La plataforma no sustituye ni reemplaza el criterio profesional médico ni constituye un servicio de salud.

En consecuencia, planitgt no:

• Proporciona diagnósticos, tratamientos ni consejos médicos.
• Se responsabiliza por las decisiones clínicas o administrativas tomadas por las empresas usuarias.
• Garantiza los resultados de tratamientos médicos o la satisfacción de los pacientes.
• Almacena ni procesa información médica sensible sin cifrado o medidas de seguridad adecuadas.

planitgt asume responsabilidad limitada por interrupciones temporales del servicio causadas por mantenimiento, actualizaciones, fallos técnicos o causas de fuerza mayor.`,
        },
        {
          title: "5. Facturación y Pagos",
          content: `El acceso a los servicios de planitgt puede estar sujeto a planes de suscripción o pagos periódicos, según las características elegidas al momento del registro.

Las condiciones de facturación incluyen:

• Pagos mensuales, anuales o según el plan contratado, realizados mediante los métodos de pago disponibles.
• La Empresa podrá cancelar su suscripción con un aviso previo de 30 días, mediante los canales habilitados.
• Los reembolsos estarán sujetos a las políticas específicas vigentes en la fecha de solicitud.

planitgt se reserva el derecho de suspender temporal o definitivamente el acceso a la cuenta en caso de falta de pago, incumplimiento de los términos o uso indebido del servicio.

Las tarifas y condiciones pueden ser modificadas con previo aviso, y la continuidad en el uso del servicio implicará la aceptación de los nuevos términos.`,
        },
      ],
    },
    // Aquí reemplazamos la política de privacidad resumida por la política completa que nos enviaste
    privacy: {
      title: "Política de Privacidad y Protección de Datos",
      sections: [
        {
          title: "Información general",
          content: `La presente Política de Privacidad y Protección de Datos tiene como finalidad informar a los usuarios, pacientes y personal médico sobre el tratamiento, manejo y resguardo de los datos personales y médicos recolectados por la plataforma planitgt (en adelante, “la Plataforma”).
El tratamiento de la información se realiza conforme a principios de confidencialidad, seguridad, responsabilidad y transparencia, garantizando la protección de los datos personales y médicos de todos los usuarios.`,
        },
        {
          title: "1. Recopilación de Datos",
          content: `La Plataforma recopila únicamente la información necesaria para la correcta prestación de los servicios y el cumplimiento de obligaciones administrativas y operativas.
Entre los tipos de datos recolectados se incluyen, según corresponda:

• Datos de identificación personal (nombre, DPI, número de teléfono, correo electrónico).
• Datos médicos y clínicos relacionados con la atención, diagnóstico y tratamiento.
• Información administrativa para la gestión de citas y expedientes.
• Registros de comunicación y uso de la Plataforma.

La recopilación se realiza mediante formularios digitales, interacciones directas con el usuario o sistemas de gestión médica integrados, garantizando siempre el consentimiento informado del titular de los datos.`,
        },
        {
          title: "2. Protección de Datos Médicos",
          content: `planitgt implementa medidas técnicas, administrativas y organizativas de seguridad para garantizar la confidencialidad, integridad y disponibilidad de la información.
Entre dichas medidas se incluyen:

• Encriptación de datos sensibles durante el almacenamiento y la transmisión.
• Acceso restringido mediante roles y permisos diferenciados.
• Auditorías periódicas de accesos y modificaciones.
• Copias de seguridad cifradas y mecanismos de recuperación ante desastres.
• Políticas internas de confidencialidad firmadas por el personal autorizado.
• Procedimientos de revisión y actualización continua en materia de seguridad de la información.`,
        },
        {
          title: "3. Uso de la Información",
          content: `Los datos personales y médicos se utilizan exclusivamente para fines legítimos relacionados con la prestación de servicios, tales como:

• Gestión, programación y seguimiento de citas médicas.
• Comunicación autorizada entre pacientes, personal médico y administrativo.
• Elaboración de reportes estadísticos y análisis internos (utilizando datos anonimizados).
• Cumplimiento de responsabilidades administrativas y operativas.
• Evaluación de calidad y mejora de procesos asistenciales.

Bajo ninguna circunstancia la información será utilizada para fines comerciales o publicitarios sin el consentimiento explícito del titular.`,
        },
        {
          title: "4. Compartición y Transferencia de Información",
          content: `planitgt no comparte, vende ni transfiere datos personales a terceros, salvo en los siguientes casos:

• Con autorización expresa del paciente o usuario.
• Por requerimiento de una autoridad competente.
• Con proveedores de servicios tecnológicos o médicos que colaboren en la operación de la Plataforma, bajo acuerdos que garanticen la confidencialidad y seguridad de la información.
• En casos de emergencia médica, cuando sea necesario salvaguardar la vida o integridad del paciente conforme a los protocolos establecidos.

En todo caso, se asegurará que los terceros receptores de los datos cumplan con las mismas obligaciones de confidencialidad y protección de la información.`,
        },
        {
          title: "5. Derechos del Titular de los Datos",
          content: `Los pacientes y usuarios tienen derecho a:

• Acceder a los datos personales que la Plataforma conserva sobre ellos.
• Rectificar la información que sea inexacta o desactualizada.
• Solicitar la eliminación de sus datos personales cuando ya no sean necesarios, salvo por motivos administrativos o médicos que requieran su conservación.
• Oponerse al tratamiento de sus datos por motivos legítimos.
• Solicitar la portabilidad de sus datos a otros sistemas o servicios.

Las solicitudes pueden realizarse a través de los canales oficiales de contacto indicados por la Plataforma, y serán atendidas con la debida diligencia y confidencialidad.`,
        },
        {
          title: "6. Conservación de los Datos",
          content: `Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir con los fines descritos en esta Política o mientras exista una relación activa entre el paciente y la Plataforma. Posteriormente, serán eliminados o anonimizados de forma segura.`,
        },
        {
          title: "7. Modificaciones de la Política",
          content: `planitgt se reserva el derecho de modificar esta Política de Privacidad en cualquier momento, con el fin de adaptarla a mejoras tecnológicas, cambios operativos o nuevos requerimientos del servicio. Cualquier modificación será publicada y notificada a los usuarios a través de los canales oficiales.`,
        },
        {
          title: "8. Contacto y Consultas",
          content: `Para consultas, solicitudes o ejercicio de derechos relacionados con la protección de datos, puede comunicarse con nuestro Responsable de Privacidad a través del correo electrónico: privacidad@planitgt.com.gt`,
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
                  <p>Al registrar tu empresa en planitgt, aceptas:</p>
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
