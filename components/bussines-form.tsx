import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Company } from '@/types';

interface BusinessInfoFormProps {
  company?: Company;
  onSave: (companyData: Omit<Company, 'id' | 'createdAt'>) => Promise<void>;
  isLoading?: boolean;
}

const businessTypes = [
  { value: 'consultorio_medico', label: 'Consultorio Médico' },
  { value: 'clinica_dental', label: 'Clínica Dental' },
  { value: 'fisioterapia', label: 'Fisioterapia' },
  { value: 'psicologia', label: 'Psicología' },
  { value: 'veterinaria', label: 'Veterinaria' },
  { value: 'spa_wellness', label: 'Spa & Wellness' },
  { value: 'salon_belleza', label: 'Salón de Belleza' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'otro', label: 'Otro' },
];

export function BusinessInfoForm({ company, onSave, isLoading = false }: BusinessInfoFormProps) {
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'createdAt'>>({
    name: company?.name || '',
    companyType: company?.companyType || '',
    address: company?.address || '',
    city: company?.city || '',
    state: company?.state || '',
    postalCode: company?.postalCode || '',
    country: company?.country || '',
    description: company?.description || '',
  });

  const handleSubmit = async () => {
    await onSave(formData);
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.companyType !== '' && 
           formData.address.trim() !== '' && 
           formData.city.trim() !== '' && 
           formData.state.trim() !== '' && 
           formData.country.trim() !== '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Negocio</CardTitle>
        <CardDescription>Configura los detalles de tu consultorio o negocio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio *</Label>
              <Input
                id="businessName"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Tipo de Negocio *</Label>
              <Select
                value={formData.companyType}
                onValueChange={(value) => updateFormData('companyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de negocio" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Dirección</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Negocio</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Describe tu negocio y servicios..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}