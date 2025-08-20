import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Star, CheckCircle, Search } from "lucide-react";
import type { User, FormDataType } from "@/types";

type Props = {
  professionals: User[];
  selectedProfessional: User | null;
  setSelectedProfessional: (professional: User | null) => void;
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  professionalSearch: string;
  setProfessionalSearch: (value: string) => void;
};

export const ProfessionalSelector: React.FC<Props> = ({
  professionals,
  selectedProfessional,
  setSelectedProfessional,
  formData,
  setFormData,
  professionalSearch,
  setProfessionalSearch,
}) => {
  const filteredProfessionals = professionals.filter((professional) =>
    professional.fullName
      .toLowerCase()
      .includes(professionalSearch.trim().toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".professional-dropdown-container")) {
        setProfessionalSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfessionalSearch]);

  const handleProfessionalSelect = (professional: User) => {
    setSelectedProfessional(professional);
    setFormData({
      ...formData,
      professionalId: professional.id.toString(),
    });
    setProfessionalSearch("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Seleccionar Profesional</span>
        </CardTitle>
        <CardDescription>
          Elige el profesional que atenderá la cita
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedProfessional && (
          <div className="relative professional-dropdown-container">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Buscar profesional por nombre..."
                value={professionalSearch}
                onChange={(e) => setProfessionalSearch(e.target.value)}
                onFocus={() =>
                  setProfessionalSearch(professionalSearch || " ")
                }
                className="pl-10"
              />
            </div>

            {(professionalSearch || professionalSearch === " ") && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {filteredProfessionals.length > 0 ? (
                  <div className="py-2">
                    {filteredProfessionals.map((professional) => (
                      <div
                        key={professional.id}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() =>
                          handleProfessionalSelect(professional)
                        }
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              professional.avatar || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                            {professional.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {professional.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {professional.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-400">
                              Especialista
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    {professionalSearch === " " ? (
                      <>
                        <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No hay profesionales disponibles
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No se encontraron profesionales con "
                        {professionalSearch}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedProfessional && (
          <div className="flex items-start sm:items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage
                src={selectedProfessional.avatar || "/placeholder.svg"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {selectedProfessional.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {selectedProfessional.fullName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {selectedProfessional.email}
              </p>
              <div className="flex items-center mt-1">
                <Star className="h-3 w-3 text-yellow-400 mr-1 flex-shrink-0" />
                <span className="text-xs text-gray-500">
                  Profesional seleccionado
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProfessional(null);
                  setFormData({
                    ...formData,
                    professionalId: "",
                  });
                  setProfessionalSearch("");
                }}
                className="text-xs px-2 py-1 h-auto"
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};