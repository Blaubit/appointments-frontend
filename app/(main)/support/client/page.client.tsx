"use client";

import type React from "react";

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
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Upload,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import type {
  TicketPriority,
  TicketCategory,
  CreateTicketData,
} from "@/types/support";

const categoryInfo = {
  technical_issue: {
    label: "Problema Técnico",
    description: "Errores, fallos del sistema, problemas de acceso",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    responseTime: "2-4 horas",
  },
  billing: {
    label: "Facturación",
    description: "Consultas sobre pagos, facturas, planes",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    responseTime: "4-8 horas",
  },
  feature_request: {
    label: "Solicitud de Función",
    description: "Nuevas características, mejoras sugeridas",
    icon: Zap,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    responseTime: "1-2 días",
  },
  bug_report: {
    label: "Reporte de Error",
    description: "Comportamientos inesperados, bugs",
    icon: Shield,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    responseTime: "1-3 horas",
  },
  account_access: {
    label: "Acceso a Cuenta",
    description: "Problemas de login, recuperación de contraseña",
    icon: Users,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    responseTime: "1-2 horas",
  },
  training: {
    label: "Capacitación",
    description: "Ayuda para usar el sistema, tutoriales",
    icon: HelpCircle,
    color:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    responseTime: "4-6 horas",
  },
  other: {
    label: "Otro",
    description: "Consultas generales, otros temas",
    icon: MessageSquare,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    responseTime: "6-12 horas",
  },
};

const priorityInfo = {
  low: {
    label: "Baja",
    description: "No es urgente, puede esperar",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
  medium: {
    label: "Media",
    description: "Importante pero no crítico",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  high: {
    label: "Alta",
    description: "Necesita atención pronto",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  urgent: {
    label: "Urgente",
    description: "Crítico, afecta el trabajo diario",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

export default function ClientSupportPage() {
  const [formData, setFormData] = useState<CreateTicketData>({
    title: "",
    description: "",
    priority: "medium",
    category: "technical_issue",
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFormData((prev) => ({ ...prev, attachments: newFiles }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              ¡Ticket Enviado!
            </h2>
            <p className="text-muted-foreground mb-4">
              Hemos recibido tu solicitud. Te contactaremos pronto por email con
              una respuesta.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                Número de ticket:
              </p>
              <p className="font-mono font-bold text-foreground">
                #TK-{Date.now().toString().slice(-6)}
              </p>
            </div>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: "",
                  description: "",
                  priority: "medium",
                  category: "technical_issue",
                  attachments: [],
                });
                setSelectedFiles([]);
              }}
              className="w-full"
            >
              Enviar Otro Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedCategory = categoryInfo[formData.category];
  const selectedPriority = priorityInfo[formData.priority];
  const CategoryIcon = selectedCategory.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Centro de Soporte
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            ¿Necesitas ayuda? Envíanos tu consulta y te responderemos lo antes
            posible.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Respuesta en 24 horas</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Crear Nuevo Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">
                      Título del Problema *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Describe brevemente tu problema..."
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: value as TicketCategory,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {Object.entries(categoryInfo).map(([key, info]) => {
                          const Icon = info.icon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{info.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {selectedCategory.description}
                    </p>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label className="text-foreground">Prioridad *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: value as TicketPriority,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {Object.entries(priorityInfo).map(([key, info]) => (
                          <SelectItem key={key} value={key}>
                            {info.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {selectedPriority.description}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Descripción Detallada *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe tu problema con el mayor detalle posible. Incluye pasos para reproducir el error, mensajes de error exactos, etc."
                      rows={6}
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="attachments" className="text-foreground">
                      Archivos Adjuntos (Opcional)
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrastra archivos aquí o haz clic para seleccionar
                      </p>
                      <input
                        id="attachments"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("attachments")?.click()
                        }
                        className="border-border"
                      >
                        Seleccionar Archivos
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Máximo 5MB por archivo. Formatos: JPG, PNG, PDF, DOC,
                        TXT
                      </p>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded border-border"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Category Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5" />
                  {selectedCategory.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className={selectedCategory.color}>
                  {selectedCategory.label}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Tiempo de respuesta:
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedCategory.responseTime}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Consejos para un Mejor Soporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Para problemas técnicos:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Incluye capturas de pantalla</li>
                    <li>• Describe los pasos exactos</li>
                    <li>• Menciona el navegador que usas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    Para consultas generales:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sé específico en tu pregunta</li>
                    <li>• Proporciona contexto</li>
                    <li>• Incluye tu información de contacto</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Otras Formas de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      soporte@citasfacil.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      WhatsApp
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +502 1234-5678
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
