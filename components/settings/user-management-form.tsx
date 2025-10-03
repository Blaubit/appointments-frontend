"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Edit3,
  Trash2,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";

import { Role, User, Pagination } from "@/types";
import { UserForm } from "@/components/settings/user-form";
import { UserAssignmentsDialog } from "@/components/settings/user-assigment-dialog";

interface UserManagementFormProps {
  currentUserRole: "admin" | "profesional";
  doctors: User[];
  users: User[];
  roles: Role[];
  onSave: (userData: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  isLoading: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  meta?: Pagination;
  useBackendPagination?: boolean;
  canEdit?: boolean;
}

export function UserManagementForm({
  currentUserRole,
  doctors,
  users: initialUsers,
  onSave,
  onDeleteUser,
  isLoading,
  roles,
  currentPage: initialCurrentPage = 1,
  onPageChange,
  meta,
  useBackendPagination = false,
  canEdit = true,
}: UserManagementFormProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Estados para el modal de asignaciones
  const [showAssignmentsDialog, setShowAssignmentsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [assignmentType, setAssignmentType] = useState<
    "secretary" | "professional"
  >("secretary");

  const { toast } = useToast();

  // Actualizar usuarios cuando cambien los props
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Lógica de filtrado y paginación
  const filteredAndPaginatedData = useMemo(() => {
    if (useBackendPagination && meta) {
      let filteredUsers = users;

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedRole && selectedRole !== "all") {
        filteredUsers = filteredUsers.filter((user) => {
          const userRole = user.role?.name || "";
          return userRole.toLowerCase().includes(selectedRole.toLowerCase());
        });
      }

      return {
        users: filteredUsers,
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
        hasNextPage: meta.hasNextPage,
        hasPrevPage: meta.hasPreviousPage,
        currentPage: meta.currentPage,
        itemsPerPage: meta.itemsPerPage,
        nextPage: meta.nextPage,
        previousPage: meta.previousPage,
      };
    } else {
      const ITEMS_PER_PAGE = 10;
      let filteredUsers = users;

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedRole && selectedRole !== "all") {
        filteredUsers = filteredUsers.filter((user) => {
          const userRole = user.role?.name || "";
          return userRole.toLowerCase().includes(selectedRole.toLowerCase());
        });
      }

      const totalItems = filteredUsers.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      const startIndex = (initialCurrentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      return {
        users: paginatedUsers,
        totalItems,
        totalPages,
        hasNextPage: initialCurrentPage < totalPages,
        hasPrevPage: initialCurrentPage > 1,
        currentPage: initialCurrentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        nextPage:
          initialCurrentPage < totalPages ? initialCurrentPage + 1 : null,
        previousPage: initialCurrentPage > 1 ? initialCurrentPage - 1 : null,
      };
    }
  }, [
    users,
    searchTerm,
    selectedRole,
    initialCurrentPage,
    useBackendPagination,
    meta,
  ]);

  const handleCreateUser = () => {
    if (!canEdit) return;
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    if (!canEdit) return;
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const handleUserFormSuccess = async (userData: User) => {
    if (!canEdit) return;

    try {
      if (editingUser) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id ? { ...user, ...userData } : user
          )
        );
        await onSave({ type: "update", user: userData });
      } else {
        let roleObj = null;
        if (typeof userData.role === "string") {
          roleObj =
            roles.find((r) => r.id === userData.role.id) || roles[0] || null;
        } else if (
          userData.role &&
          typeof userData.role === "object" &&
          typeof userData.role.id === "string"
        ) {
          roleObj = userData.role;
        } else {
          roleObj = roles[0] || null;
        }
        const enrichedUser = {
          ...userData,
          role: roleObj,
        };
        setUsers((prev) => [...prev, enrichedUser]);
        await onSave({ type: "create", user: enrichedUser });
      }
    } catch (error) {
      console.error("Error in handleUserFormSuccess:", error);
      toast({
        title: "Error de sincronización",
        description: "Hubo un problema al sincronizar los datos.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!canEdit) return;

    try {
      await onDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error al eliminar usuario",
        description: "No se pudo eliminar el usuario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Función para abrir el modal de asignaciones
  const handleViewAssignments = (
    user: User,
    type: "secretary" | "professional"
  ) => {
    setSelectedUser(user);
    setAssignmentType(type);
    setShowAssignmentsDialog(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case "admin_empresa":
      case "administrador":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "profesional":
      case "professional":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "secretaria":
      case "secretary":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case "admin":
      case "administrador":
      case "admin_empresa":
        return "Administrador";
      case "profesional":
      case "professional":
        return "Profesional";
      case "secretaria":
      case "secretary":
        return "Secretaria";
      default:
        return role;
    }
  };

  const getUserRoleName = (user: User): string => {
    return user.role?.name || "Sin rol";
  };

  const uniqueRoles = useMemo(() => {
    const roleNames = users
      .map((user) => getUserRoleName(user))
      .filter(Boolean);
    return [...new Set(roleNames)];
  }, [users]);

  const getDisplayRange = () => {
    if (useBackendPagination && meta) {
      const start = (meta.currentPage - 1) * meta.itemsPerPage + 1;
      const end = Math.min(
        meta.currentPage * meta.itemsPerPage,
        meta.totalItems
      );
      return { start, end, total: meta.totalItems };
    } else {
      const start =
        (filteredAndPaginatedData.currentPage - 1) *
          filteredAndPaginatedData.itemsPerPage +
        1;
      const end = Math.min(
        filteredAndPaginatedData.currentPage *
          filteredAndPaginatedData.itemsPerPage,
        filteredAndPaginatedData.totalItems
      );
      return { start, end, total: filteredAndPaginatedData.totalItems };
    }
  };

  const displayRange = getDisplayRange();

  const isSecretary = (user: User) => {
    return getUserRoleName(user).toLowerCase().includes("secretaria");
  };

  const isProfessional = (user: User) => {
    return getUserRoleName(user).toLowerCase().includes("profesional");
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
                Crea y administra usuarios del sistema. Asigna secretarias a
                doctores específicos.
              </CardDescription>
            </div>
            {canEdit && (
              <Button onClick={handleCreateUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={selectedRole || undefined}
                onValueChange={(value) => setSelectedRole(value || "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || (selectedRole && selectedRole !== "all")) && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {(searchTerm || (selectedRole && selectedRole !== "all")) && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <span>Filtros activos:</span>
              {searchTerm && (
                <Badge variant="secondary">Búsqueda: "{searchTerm}"</Badge>
              )}
              {selectedRole && selectedRole !== "all" && (
                <Badge variant="secondary">
                  Rol: {getRoleDisplayName(selectedRole)}
                </Badge>
              )}
              <span className="ml-2">
                ({filteredAndPaginatedData.totalItems} resultado
                {filteredAndPaginatedData.totalItems !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usuarios Registrados</CardTitle>
              <CardDescription>
                Lista de todos los usuarios del sistema y sus asignaciones.
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              Mostrando {displayRange.start} - {displayRange.end} de{" "}
              {displayRange.total} usuarios
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndPaginatedData.users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {filteredAndPaginatedData.totalItems === 0 &&
              !searchTerm &&
              (!selectedRole || selectedRole === "all") ? (
                <>
                  <p>No hay usuarios registrados</p>
                  <p className="text-sm">
                    Crea el primer usuario usando el botón de arriba
                  </p>
                </>
              ) : (
                <>
                  <p>No se encontraron usuarios</p>
                  <p className="text-sm">
                    Prueba ajustando los filtros de búsqueda
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Asignaciones</TableHead>
                      {canEdit && <TableHead>Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndPaginatedData.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getRoleBadgeColor(getUserRoleName(user))}
                          >
                            {getRoleDisplayName(getUserRoleName(user))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isSecretary(user) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAssignments(user, "secretary")
                              }
                            >
                              <Eye className="h-3 w-3 mr-2" />
                              Ver profesionales
                            </Button>
                          ) : isProfessional(user) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAssignments(user, "professional")
                              }
                            >
                              <Eye className="h-3 w-3 mr-2" />
                              Ver secretarias
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        {canEdit && (
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
                                    <AlertDialogTitle>
                                      ¿Eliminar usuario?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción eliminará permanentemente el
                                      usuario <strong>{user.fullName}</strong>.
                                      Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
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
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {filteredAndPaginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Página {filteredAndPaginatedData.currentPage} de{" "}
                    {filteredAndPaginatedData.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(
                          filteredAndPaginatedData.previousPage ||
                            filteredAndPaginatedData.currentPage - 1
                        )
                      }
                      disabled={!filteredAndPaginatedData.hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>

                    <div className="flex gap-1">
                      {Array.from(
                        {
                          length: Math.min(
                            5,
                            filteredAndPaginatedData.totalPages
                          ),
                        },
                        (_, i) => {
                          let pageNum;
                          if (filteredAndPaginatedData.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (
                            filteredAndPaginatedData.currentPage <= 3
                          ) {
                            pageNum = i + 1;
                          } else if (
                            filteredAndPaginatedData.currentPage >=
                            filteredAndPaginatedData.totalPages - 2
                          ) {
                            pageNum =
                              filteredAndPaginatedData.totalPages - 4 + i;
                          } else {
                            pageNum =
                              filteredAndPaginatedData.currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pageNum === filteredAndPaginatedData.currentPage
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(
                          filteredAndPaginatedData.nextPage ||
                            filteredAndPaginatedData.currentPage + 1
                        )
                      }
                      disabled={!filteredAndPaginatedData.hasNextPage}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Asignaciones (componente separado) */}
      <UserAssignmentsDialog
        isOpen={showAssignmentsDialog}
        onClose={() => setShowAssignmentsDialog(false)}
        user={selectedUser}
        type={assignmentType}
      />

      {/* Formulario de Usuario (Modal) */}
      {canEdit && (
        <UserForm
          isOpen={isUserFormOpen}
          onClose={() => setIsUserFormOpen(false)}
          onSuccess={handleUserFormSuccess}
          editingUser={editingUser}
          doctors={doctors}
          roles={roles}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
