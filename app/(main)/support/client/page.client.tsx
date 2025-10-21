"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Send,
  Clock,
  Mail,
  Phone,
  AlertCircle,
  Users,
} from "lucide-react";

// Define the explicit type for priority
type Priority = "low" | "medium" | "high" | "urgent";

const priorityInfo: Record<
  Priority,
  { label: string; color: string; desc: string }
> = {
  low: {
    label: "Baja",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    desc: "No es urgente, puede esperar.",
  },
  medium: {
    label: "Media",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    desc: "Importante pero no crítico.",
  },
  high: {
    label: "Alta",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    desc: "Necesita atención pronto.",
  },
  urgent: {
    label: "Urgente",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    desc: "Crítico, afecta el trabajo diario.",
  },
};

export default function ClientSupportForm({
  userData,
  submitTicket,
}: {
  userData: any;
  submitTicket: (payload: any) => Promise<any>;
}) {
  const [form, setForm] = useState<{
    subject: string;
    description: string;
    priority: Priority;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userRole?: string;
    sourceSystem?: string;
    externalId?: string;
  }>({
    subject: "",
    description: "",
    priority: "medium",
    ...userData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handlePriority = (val: Priority) => setForm({ ...form, priority: val });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      subject: form.subject,
      description: form.description,
      priority: "medium", // sended medium always as default
      userId: form.userId,
      userName: form.userName,
      userEmail: form.userEmail,
      userRole: form.userRole,
      sourceSystem: form.sourceSystem,
      externalId: form.externalId,
    };

    const resp = await submitTicket(payload);

    if (resp && resp.status >= 200 && resp.status < 300) {
      setSubmitted(true);
    } else {
      setError(
        resp?.message ||
          "No se pudo enviar el ticket. Por favor intenta nuevamente."
      );
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ¡Ticket Enviado!
              </h2>
              <p className="text-muted-foreground mb-4">
                Hemos recibido tu solicitud. Te contactaremos pronto por email.
              </p>

              <Button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    subject: "",
                    description: "",
                    priority: "medium",
                    ...userData,
                  });
                }}
                className="w-full"
              >
                Enviar Otro Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Solicitud de Soporte
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Completa el formulario para reportar tu problema. ¡Responderemos
              lo antes posible!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Atención priorizada según urgencia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Notificación por email</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Nuevo Ticket de Soporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">
                    Asunto *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Ej: Error en sistema de facturación"
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Descripción Detallada *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe el problema, pasos para reproducirlo, mensajes de error, etc."
                    rows={6}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-foreground">
                      Nombre
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={form.userName}
                      readOnly
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="userEmail"
                      name="userEmail"
                      value={form.userEmail}
                      readOnly
                      className="bg-muted border-border"
                    />
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Otras Formas de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      WhatsApp
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +502 5926-9084
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Horario
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lun-Vie 8:00-18:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
