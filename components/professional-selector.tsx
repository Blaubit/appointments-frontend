import React, { useState, useEffect, useRef } from "react";
import { Users, Star, CheckCircle, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";

interface ProfessionalSelectorCardProps {
  professionals: User[];
  selectedProfessional: User | null;
  onSelectionChange: (professional: User | null) => void;
  title?: string;
  description?: string;
  className?: string;
  isLocked?: boolean;
}

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
  selectedProfessional,
  onSelectionChange,
  title = "Seleccionar Profesional",
  description = "Elige el profesional que atenderá la cita",
  className = "",
  isLocked = false,
}: ProfessionalSelectorCardProps) {
  // Locked mode: solo muestra la tarjeta del profesional seleccionado, sin input ni cambiar
  if (isLocked && selectedProfessional) {
    return (
      <Card
        className={`mb-6 sm:mb-8 border-blue-200 dark:border-blue-800 ${className}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Users className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start sm:items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-2">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage
                src={selectedProfessional.avatar || "/placeholder.svg"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(selectedProfessional.fullName || "")}
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
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Selector normal con input y dropdown
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProfessionals = professionals.filter((professional) =>
    professional.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Abrir dropdown al focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // Seleccionar profesional y cerrar dropdown
  const handleSelectProfessional = (professional: User) => {
    onSelectionChange(professional);
    setIsDropdownOpen(false);
    setSearch("");
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <Card
      className={`mb-6 sm:mb-8 border-blue-200 dark:border-blue-800 ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" ref={containerRef}>
        {/* Buscador y dropdown */}
        {!selectedProfessional && (
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Buscar profesional por nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={handleInputFocus}
              className="pl-10"
              autoComplete="off"
            />
            {/* Dropdown solo si está abierto */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors
                        hover:bg-gray-50 dark:hover:bg-gray-700
                      `}
                      onClick={() => handleSelectProfessional(professional)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={professional.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                          {getInitials(professional.fullName || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {professional.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
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
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No se encontraron profesionales
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profesional seleccionado */}
        {selectedProfessional && !isLocked && (
          <div className="flex items-start sm:items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-2">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage
                src={selectedProfessional.avatar || "/placeholder.svg"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(selectedProfessional.fullName || "")}
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
              <button
                type="button"
                className="text-xs px-2 py-1 h-auto border rounded bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800"
                onClick={() => {
                  onSelectionChange(null);
                  setSearch("");
                }}
              >
                Cambiar
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
