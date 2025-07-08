"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, X, User, Phone, MapPin, Heart, Shield, Languages, Bell } from "lucide-react"
import type { Client, ClientFormData } from "@/app/types"

interface ClientFormProps {
  client?: Client // Si se pasa un cliente, está en modo edición
  trigger?: React.ReactNode // Elemento que abre el dialog
  onSubmit?: (data: ClientFormData) => void
  onCancel?: () => void
}

export function ClientForm({ client, trigger, onSubmit, onCancel }: ClientFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: undefined,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "España",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: [],
    allergies: [],
    medications: [],
    insuranceInfo: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: false,
      phone: false,
    },
    notes: "",
    tags: [],
    referralSource: "",
  })

  const [newTag, setNewTag] = useState("")
  const [newMedicalHistory, setNewMedicalHistory] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")

  const isEditMode = !!client

  // Llenar el formulario con datos del cliente si está en modo edición
  useEffect(() => {
    if (client) {
      const names = client.name.split(" ")
      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: client.email,
        phone: client.phone,
        dateOfBirth: client.dateOfBirth || "",
        gender: client.gender,
        address: client.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "España",
        },
        emergencyContact: client.emergencyContact || {
          name: "",
          phone: "",
          relationship: "",
        },
        medicalHistory: client.medicalHistory || [],
        allergies: client.allergies || [],
        medications: client.medications || [],
        insuranceInfo: client.insuranceInfo || {
          provider: "",
          policyNumber: "",
          groupNumber: "",
        },
        preferredLanguage: client.preferredLanguage,
        communicationPreferences: client.communicationPreferences,
        notes: client.notes || "",
        tags: client.tags || [],
        referralSource: client.referralSource || "",
      })
    }
  }, [client])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setOpen(false)

    // Reset form if not in edit mode
    if (!isEditMode) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: undefined,
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "España",
        },
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
        medicalHistory: [],
        allergies: [],
        medications: [],
        insuranceInfo: {
          provider: "",
          policyNumber: "",
          groupNumber: "",
        },
        preferredLanguage: "es",
        communicationPreferences: {
          email: true,
          sms: true,
          whatsapp: false,
          phone: false,
        },
        notes: "",
        tags: [],
        referralSource: "",
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev:any) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev:any) => ({
      ...prev,
      tags: prev.tags?.filter((tag:any) => tag !== tagToRemove) || [],
    }))
  }

  const addMedicalHistory = () => {
    if (newMedicalHistory.trim() && !formData.medicalHistory?.includes(newMedicalHistory.trim())) {
      setFormData((prev:any) => ({
        ...prev,
        medicalHistory: [...(prev.medicalHistory || []), newMedicalHistory.trim()],
      }))
      setNewMedicalHistory("")
    }
  }

  const removeMedicalHistory = (item: string) => {
    setFormData((prev:any) => ({
      ...prev,
      medicalHistory: prev.medicalHistory?.filter((h:any) => h !== item) || [],
    }))
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies?.includes(newAllergy.trim())) {
      setFormData((prev:any) => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setFormData((prev:any) => ({
      ...prev,
      allergies: prev.allergies?.filter((a:any) => a !== allergy) || [],
    }))
  }

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications?.includes(newMedication.trim())) {
      setFormData((prev:any) => ({
        ...prev,
        medications: [...(prev.medications || []), newMedication.trim()],
      }))
      setNewMedication("")
    }
  }

  const removeMedication = (medication: string) => {
    setFormData((prev:any) => ({
      ...prev,
      medications: prev.medications?.filter((m:any) => m !== medication) || [],
    }))
  }

  const defaultTrigger = (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{isEditMode ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Actualizar información del cliente" : "Agregar un nuevo cliente al sistema"}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditMode ? `Editar Cliente: ${client?.name}` : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza la información del cliente existente"
              : "Completa la información para agregar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "male" | "female" | "other") =>
                      setFormData((prev:any) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Calle</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ""}
                  onChange={(e) =>
                    setFormData((prev:any) => ({
                      ...prev,
                      address: { ...prev.address!, street: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        address: { ...prev.address!, city: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Provincia</Label>
                  <Input
                    id="state"
                    value={formData.address?.state || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        address: { ...prev.address!, state: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input
                    id="zipCode"
                    value={formData.address?.zipCode || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        address: { ...prev.address!, zipCode: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto de Emergencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Nombre</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact?.name || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact!, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Teléfono</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact?.phone || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact!, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relación</Label>
                  <Input
                    id="relationship"
                    value={formData.emergencyContact?.relationship || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact!, relationship: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Médica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Historial Médico */}
              <div className="space-y-2">
                <Label>Historial Médico</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar condición médica"
                    value={newMedicalHistory}
                    onChange={(e) => setNewMedicalHistory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMedicalHistory())}
                  />
                  <Button type="button" onClick={addMedicalHistory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medicalHistory?.map((item) => (
                    <Badge key={item} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMedicalHistory(item)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Alergias */}
              <div className="space-y-2">
                <Label>Alergias</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar alergia"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                  />
                  <Button type="button" onClick={addAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies?.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergy(allergy)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medicamentos */}
              <div className="space-y-2">
                <Label>Medicamentos</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar medicamento"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMedication())}
                  />
                  <Button type="button" onClick={addMedication} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medications?.map((medication) => (
                    <Badge key={medication} variant="outline" className="flex items-center gap-1">
                      {medication}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMedication(medication)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seguro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Información del Seguro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Proveedor</Label>
                  <Input
                    id="provider"
                    value={formData.insuranceInfo?.provider || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        insuranceInfo: { ...prev.insuranceInfo!, provider: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Número de Póliza</Label>
                  <Input
                    id="policyNumber"
                    value={formData.insuranceInfo?.policyNumber || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        insuranceInfo: { ...prev.insuranceInfo!, policyNumber: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupNumber">Número de Grupo</Label>
                  <Input
                    id="groupNumber"
                    value={formData.insuranceInfo?.groupNumber || ""}
                    onChange={(e) =>
                      setFormData((prev:any) => ({
                        ...prev,
                        insuranceInfo: { ...prev.insuranceInfo!, groupNumber: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4" />
                Preferencias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Idioma Preferido</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => setFormData((prev:any) => ({ ...prev, preferredLanguage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                    <SelectItem value="fr">Francés</SelectItem>
                    <SelectItem value="de">Alemán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Preferencias de Comunicación
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={formData.communicationPreferences.email}
                      onCheckedChange={(checked) =>
                        setFormData((prev:any) => ({
                          ...prev,
                          communicationPreferences: {
                            ...prev.communicationPreferences,
                            email: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sms"
                      checked={formData.communicationPreferences.sms}
                      onCheckedChange={(checked) =>
                        setFormData((prev:any) => ({
                          ...prev,
                          communicationPreferences: {
                            ...prev.communicationPreferences,
                            sms: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp"
                      checked={formData.communicationPreferences.whatsapp}
                      onCheckedChange={(checked) =>
                        setFormData((prev:any) => ({
                          ...prev,
                          communicationPreferences: {
                            ...prev.communicationPreferences,
                            whatsapp: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="phone"
                      checked={formData.communicationPreferences.phone}
                      onCheckedChange={(checked) =>
                        setFormData((prev:any) => ({
                          ...prev,
                          communicationPreferences: {
                            ...prev.communicationPreferences,
                            phone: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="phone">Teléfono</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etiquetas y Notas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Etiquetas y Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Etiquetas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar etiqueta"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag:any) => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralSource">Fuente de Referencia</Label>
                <Input
                  id="referralSource"
                  value={formData.referralSource}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, referralSource: e.target.value }))}
                  placeholder="¿Cómo nos conoció?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas adicionales sobre el cliente..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">{isEditMode ? "Actualizar Cliente" : "Crear Cliente"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
