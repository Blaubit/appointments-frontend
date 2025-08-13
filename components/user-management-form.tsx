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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  UserPlus,
  Edit3,
  Trash2,
  Users,
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";

import { User } from "@/types";

interface UserManagementFormProps {
  currentUserRole: "admin" | "profesional";
  doctors: User[];
  users: User[];
  onSave: (userData: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export function UserManagementForm({
  currentUserRole,
  doctors,
  users: initialUsers,
  onSave,
  onDeleteUser,
  isLoading,
}: UserManagementFormProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "secretaria" as "admin" | "profesional" | "secretaria",
    assignedDoctors: [] as string[],
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "secretaria",
      assignedDoctors: [],
      password: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDoctorAssignment = (doctorId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedDoctors: checked
        ? [...prev.assignedDoctors, doctorId]
        : prev.assignedDoctors.filter(id => id !== doctorId)
    }));
  };

  const handleCreateUser = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

   
  };

  const handleEditUser = (user: User) => {
    console.log("Editing user:", user);
  };

  const handleUpdateUser = async () => {
    console.log("Updating user:", editingUser);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await onDeleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getDoctorNames = (doctorIds: string[]) => {
    return doctors
      .filter(doctor => doctorIds.includes(doctor.id))
      .map(doctor => doctor.fullName)
      .join(", ");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "profesional":
        return "bg-blue-100 text-blue-800";
      case "secretaria":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "profesional":
        return "Profesional";
      case "secretaria":
        return "Secretaria";
      default:
        return role;
    }
  };

  const canCreateRole = (role: string) => {
    if (currentUserRole === "admin") return true;
    if (currentUserRole === "profesional" && role === "secretaria") return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Crea y administra usuarios del sistema. Asigna secretarias a doctores específicos.
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Completa la información del nuevo usuario y asígnalo a doctores.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Información Personal */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Ej: María González"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="maria@clinica.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+502 1234-5678"
                      />
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="space-y-2">
                    <Label>Rol del Usuario *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {canCreateRole("admin") && (
                          <SelectItem value="admin">Administrador</SelectItem>
                        )}
                        {canCreateRole("profesional") && (
                          <SelectItem value="profesional">Profesional</SelectItem>
                        )}
                        {canCreateRole("secretaria") && (
                          <SelectItem value="secretaria">Secretaria</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Asignación de Doctores */}
                  {formData.role === "secretaria" && doctors.length > 0 && (
                    <div className="space-y-3">
                      <Label>Doctores Asignados</Label>
                      <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                        {doctors.map((doctor) => (
                          <div key={doctor.id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`doctor-${doctor.id}`}
                              checked={formData.assignedDoctors.includes(doctor.id)}
                              onCheckedChange={(checked) => 
                                handleDoctorAssignment(doctor.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`doctor-${doctor.id}`} className="flex-1 cursor-pointer">
                              <div className="text-sm font-medium">{doctor.fullName}</div>
                              
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Contraseña */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Repetir contraseña"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Usuario"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            Lista de todos los usuarios del sistema y sus asignaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay usuarios registrados</p>
              <p className="text-sm">Crea el primer usuario usando el botón de arriba</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Doctores Asignados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role.name)}>
                          {getRoleDisplayName(user.role.name)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el usuario{" "}
                                  <strong>{user.fullName}</strong>. Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar Usuario
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edición (Similar al de creación) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario y sus asignaciones.
            </DialogDescription>
          </DialogHeader>

          {/* Aquí iría el mismo formulario que en el dialog de creación */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Nombre Completo *</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Correo Electrónico *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            {formData.role === "secretaria" && doctors.length > 0 && (
              <div className="space-y-3">
                <Label>Doctores Asignados</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`edit-doctor-${doctor.id}`}
                        checked={formData.assignedDoctors.includes(doctor.id)}
                        onCheckedChange={(checked) => 
                          handleDoctorAssignment(doctor.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-doctor-${doctor.id}`} className="flex-1 cursor-pointer">
                        <div className="text-sm font-medium">{doctor.fullName}</div>
                        
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}