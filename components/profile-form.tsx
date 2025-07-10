import React, { useState } from 'react';
import type { User } from '@/types/common';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera } from 'lucide-react';

interface ProfileFormProps {
  initialData?: Partial<User>;
  onSave?: (userData: Partial<User>) => void | Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  initialData = {}, 
  onSave = () => {}, 
  isLoading = false,
  title = "Información Personal",
  description = "Actualiza tu información personal y profesional"
}) => {
  const [profileData, setProfileData] = useState<Partial<User>>({
    id: '',
    fullName: '',
    email: '',
    bio: '',
    avatar: '',
    createdAt: new Date(),
    company: {
      id: '',
      name: '',
      companyType: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      description: '',
      createdAt: new Date()
    },
    role: {
      id: '',
      name: '',
      description: ''
    },
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.fullName?.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }
    
    if (!profileData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!profileData.company?.name?.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido';
    }
    
    if (!profileData.role?.name?.trim()) {
      newErrors.roleName = 'El rol es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('company.')) {
      const companyField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        company: {
          ...prev.company!,
          [companyField]: value
        }
      }));
    } else if (field.startsWith('role.')) {
      const roleField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        role: {
          ...prev.role!,
          [roleField]: value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSave(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAvatarChange = () => {
    // Aquí puedes implementar la lógica para cambiar la foto
    console.log('Cambiar foto clicked');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'US'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={handleAvatarChange}
              >
                <Camera className="h-4 w-4 mr-2" />
                Cambiar Foto
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG o GIF. Máximo 2MB.</p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                value={profileData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleName">Rol *</Label>
              <Input
                id="roleName"
                value={profileData.role?.name || ''}
                onChange={(e) => handleInputChange('role.name', e.target.value)}
                className={errors.roleName ? 'border-red-500' : ''}
              />
              {errors.roleName && (
                <p className="text-sm text-red-500">{errors.roleName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía Personal</Label>
            <Textarea
              id="bio"
              value={profileData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Describe tu experiencia y especialidades..."
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
