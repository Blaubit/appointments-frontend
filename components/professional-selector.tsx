import React from "react";
import { Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/types";

interface ProfessionalSelectorCardProps {
  professionals: User[];
  selectedProfessionalId: string;
  onSelectionChange: (value: string) => void;
  title?: string;
  description?: string;
  className?: string;
}

// Función auxiliar
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfessionalSelectorCard({
  professionals,
  selectedProfessionalId,
  onSelectionChange,
  title = "Seleccionar Profesional",
  description = 'Elige un profesional para ver sus datos específicos o selecciona "Todos" para una vista general',
  className = "",
}: ProfessionalSelectorCardProps) {
  return (
    <Card
      className={`mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Stethoscope className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedProfessionalId}
          onValueChange={onSelectionChange}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {professionals.map((professional: User) => (
              <SelectItem key={professional.id} value={professional.id}>
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={professional.avatar || "/placeholder.svg"}
                      alt={professional.fullName}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                      {getInitials(professional.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{professional.fullName}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
