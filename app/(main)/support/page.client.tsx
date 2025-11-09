"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, MessageCircle, Mail, Send } from "lucide-react";

// FAQ DATA
const faqs = [
  {
    question: "¿Qué es PlanitGT?",
    answer:
      "PlanitGT es una plataforma web diseñada para la gestión de citas médicas de forma segura, práctica y centralizada. Permite a las clínicas y profesionales de la salud organizar sus servicios, horarios y citas en un solo lugar.",
  },
  {
    question: "¿Quién puede registrarse en PlanitGT?",
    answer:
      "El registro está disponible únicamente para clínicas y profesionales de la salud. Los pacientes no pueden crear cuentas directamente. Para iniciar el proceso de registro, es necesario contactar a uno de nuestros asesores, quien se encargará de crear la cuenta inicial y guiar la configuración del sistema.",
  },
  {
    question: "¿Qué información se solicita durante el registro?",
    answer: (
      <ul className="list-disc list-inside pl-4 space-y-1">
        <li>
          Información básica de la clínica: nombre, tipo de empresa y dirección.
        </li>
        <li>
          Datos del administrador principal: correo electrónico (necesario para
          el envío de las credenciales de acceso).
        </li>
        <li>
          El administrador principal también funciona como profesional dentro de
          la plataforma.
        </li>
      </ul>
    ),
  },
  {
    question: "¿Cómo se crea la cuenta del administrador?",
    answer:
      "El administrador solo debe proporcionar un correo electrónico válido. PlanitGT genera una contraseña aleatoria y segura que se envía directamente al correo registrado. Esto garantiza que las credenciales no sean comprometidas y que el acceso inicial sea seguro.",
  },
  {
    question: "¿Qué son los servicios profesionales en PlanitGT?",
    answer: (
      <>
        <p className="mb-2">
          Los servicios representan las actividades que realiza cada
          profesional. Por ejemplo:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Médico general → Consulta médica.</li>
          <li>Odontólogo → Limpieza dental.</li>
          <li>Nutricionista → Evaluación nutricional.</li>
        </ul>
        <p className="mt-2">
          Cada profesional puede establecer la duración y disponibilidad de sus
          servicios según sus propias necesidades.
        </p>
      </>
    ),
  },
  {
    question: "¿Qué función tienen las secretarias dentro del sistema?",
    answer: (
      <>
        <p className="mb-2">
          Las secretarias pueden ser asignadas a uno o varios profesionales.
          Esto les permite:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Visualizar las citas de los profesionales a su cargo.</li>
          <li>Gestionar los horarios y reservas.</li>
          <li>Apoyar en la organización de la agenda diaria de la clínica.</li>
        </ul>
        <p className="mt-2">
          De esta forma, la administración es más ordenada y eficiente.
        </p>
      </>
    ),
  },
  {
    question: "¿Quién puede ver las citas agendadas?",
    answer: (
      <>
        <p className="mb-2">
          El acceso a la información está organizado según el rol del usuario:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>
            <strong>Administrador:</strong> puede ver todas las citas de la
            clínica.
          </li>
          <li>
            <strong>Profesional:</strong> solo puede ver sus propias citas.
          </li>
          <li>
            <strong>Secretaria:</strong> puede ver las citas de los
            profesionales que tiene asignados.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "¿Cómo se configuran los horarios de atención?",
    answer:
      "Cada profesional puede definir sus propios horarios de atención desde su cuenta. En caso de no hacerlo, el sistema aplicará automáticamente los horarios generales establecidos por la clínica.",
  },
  {
    question: "¿Los pacientes pueden registrarse en PlanitGT?",
    answer:
      "No. Los pacientes no tienen acceso al registro ni al inicio de sesión. Las citas se gestionan exclusivamente a través del personal autorizado (administrador, profesionales o secretarias de la clínica).",
  },
  {
    question: "¿PlanitGT es un sistema seguro?",
    answer:
      "Sí. PlanitGT protege los datos de cada usuario mediante contraseñas generadas de forma automática y almacenamiento seguro. Además, solo el personal autorizado tiene acceso a la información de las citas, reduciendo el riesgo de accesos no autorizados.",
  },
  {
    question: "¿Cómo puedo obtener una cuenta para mi clínica?",
    answer:
      "Puede contactar a uno de nuestros asesores a través de los canales oficiales de PlanitGT. Ellos lo guiarán durante el proceso de registro, configuración inicial y activación de la cuenta.",
  },
  {
    question: "¿Qué ventajas ofrece PlanitGT?",
    answer: (
      <ul className="list-disc list-inside pl-4 space-y-1">
        <li>Organización centralizada de citas y horarios.</li>
        <li>
          Control de accesos según rol (administrador, profesional, secretaria).
        </li>
        <li>Mayor orden y transparencia en la gestión diaria.</li>
        <li>Seguridad en el manejo de credenciales e información médica.</li>
      </ul>
    ),
  },
];

export default function SupportPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <HelpCircle className="mx-auto mb-4 h-10 w-10 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Preguntas Frecuentes —{" "}
              <span className="text-blue-600">Soporte</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre el uso de
              PlanitGT. Si necesitas ayuda adicional, ¡contáctanos!
            </p>
            {/* <div className="flex justify-center mt-8">
              <Link href="/support/client" passHref>
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 px-4 py-2"
                  size="lg"
                >
                  <Send className="h-5 w-5" />
                  Enviar ticket de soporte
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800"
        id="faq"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Haz clic sobre una pregunta para ver la respuesta.
            </p>
          </div>
          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className={`transition-shadow ${openIndex === idx ? "shadow-lg border-blue-500" : "hover:shadow-md"}`}
              >
                <CardHeader
                  className="cursor-pointer flex flex-row items-center justify-between py-4"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                >
                  <CardTitle className="text-base sm:text-lg font-semibold flex-1">
                    {faq.question}
                  </CardTitle>
                  <span className="ml-2 text-blue-600">
                    {openIndex === idx ? "-" : "+"}
                  </span>
                </CardHeader>
                {openIndex === idx && (
                  <CardContent className="py-2 text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                    {typeof faq.answer === "string" ? (
                      <p>{faq.answer}</p>
                    ) : (
                      faq.answer
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Contact Support */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="h-7 w-7 text-white" />
            ¿Necesitas más ayuda?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Nuestro equipo de soporte está listo para resolver tus dudas y
            ayudarte a aprovechar al máximo PlanitGT.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="https://wa.me/50232470635?text=Hola%20necesito%20soporte%20PlanitGT"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 text-base px-6 py-3"
              >
                Chatear por WhatsApp
              </Button>
            </Link>
            <Link
              href="mailto:soporte@planitgt.com"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 text-base px-6 py-3 flex items-center gap-2"
              >
                <Mail className="h-5 w-5" />
                soporte@planitgt.com
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
