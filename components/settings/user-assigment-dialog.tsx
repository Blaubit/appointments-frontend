"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2 } from "lucide-react";

import { User } from "@/types";
import { getSecretaryProfessionals } from "@/actions/user/secretary-professional/get-professionals";
import { getProfessionalSecretaries } from "@/actions/user/secretary-professional/get-secretaries";

interface UserAssignmentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  type: "secretary" | "professional";
}

export function UserAssignmentsDialog({
  isOpen,
  onClose,
  user,
  type,
}: UserAssignmentsDialogProps) {
  const [assignments, setAssignments] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Cargar asignaciones cuando se abre el diálogo
  useEffect(() => {
    if (isOpen && user) {
      loadAssignments();
    } else {
      // Limpiar datos cuando se cierra
      setAssignments([]);
    }
  }, [isOpen, user]);

  const loadAssignments = async () => {
    if (!user) return;

    setIsLoading(true);
    setAssignments([]);

    try {
      const result =
        type === "secretary"
          ? await getSecretaryProfessionals(user.id)
          : await getProfessionalSecretaries(user.id);

      if ("message" in result) {
        toast({
          title: `Error al cargar ${type === "secretary" ? "profesionales" : "secretarias"}`,
          description: result.message,
          variant: "destructive",
        });
        setAssignments([]);
      } else {
        setAssignments(result.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: `No se pudieron cargar ${type === "secretary" ? "los profesionales" : "las secretarias"} asignados.`,
        variant: "destructive",
      });
      setAssignments([]);
    } finally {
      setIsLoading(false);
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

  const getDialogTitle = () => {
    if (!user) return "";
    return type === "secretary"
      ? `Profesionales asignados a ${user.fullName}`
      : `Secretarias asignadas a ${user.fullName}`;
  };

  const getDialogDescription = () => {
    return type === "secretary"
      ? "Lista de doctores que atiende esta secretaria"
      : "Lista de secretarias que atienden a este profesional";
  };

  const getEmptyMessage = () => {
    return type === "secretary"
      ? {
          title: "No hay profesionales asignados",
          description:
            "Esta secretaria no tiene doctores asignados actualmente",
        }
      : {
          title: "No hay secretarias asignadas",
          description:
            "Este profesional no tiene secretarias asignadas actualmente",
        };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">
                Cargando{" "}
                {type === "secretary" ? "profesionales" : "secretarias"}...
              </span>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{getEmptyMessage().title}</p>
              <p className="text-sm">{getEmptyMessage().description}</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {assignment.avatar && (
                            <img
                              src={assignment.avatar}
                              alt={assignment.fullName}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          <span className="font-medium">
                            {assignment.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {assignment.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getRoleBadgeColor(
                            assignment.role?.name || ""
                          )}
                        >
                          {getRoleDisplayName(assignment.role?.name || "")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
