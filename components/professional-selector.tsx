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
import { getUser } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounceSearch } from "@/hooks/useDebounce";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Si está bloqueado y existe seleccionado, mostramos sólo la tarjeta bloqueada
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

  // Selector normal con debounce usando useDebounceSearch
  // Usamos window.location.href al actualizar la URL para asegurarnos de
  // leer los params actuales al momento del push y NO sobrescribir tab
  const initialProfQ =
    typeof window !== "undefined"
      ? new URL(window.location.href).searchParams.get("professionalSearch") ||
        ""
      : (searchParams?.get("professionalSearch") as string) || "";

  const {
    searchTerm: professionalSearchTerm,
    setSearchTerm: setProfessionalSearch,
  } = useDebounceSearch(initialProfQ, {
    delay: 400,
    minLength: 2,
    resetPage: true,
    skipInitialSearch: true,
    onSearch: (value: string) => {
      // Leer params actuales de la URL en el momento del push (evita races)
      const currentParams = new URL(window.location.href).searchParams;
      const params = new URLSearchParams(currentParams.toString());
      if (value && value.trim().length >= 2) {
        params.set("professionalSearch", value.trim());
      } else {
        params.delete("professionalSearch");
      }
      params.set("page", "1");
      const query = params.toString();
      router.push(query ? `?${query}` : `${window.location.pathname}`);
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrado local para mejor UX mientras el servidor responde
  const filteredProfessionals = professionals.filter((professional) =>
    professional.fullName
      .toLowerCase()
      .includes((professionalSearchTerm || "").toLowerCase())
  );

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

  // Si no hay profesionales y no hay seleccionado, intentamos seleccionar al user actual
  useEffect(() => {
    let mounted = true;
    const trySelectCurrentUser = async () => {
      if (!mounted) return;
      try {
        if (
          (!professionals || professionals.length === 0) &&
          !selectedProfessional
        ) {
          const current = await getUser();
          if (!mounted || !current) return;
          onSelectionChange(current);
          // Push professionalId to URL for deep-link without removing other params
          const currentParams = new URL(window.location.href).searchParams;
          const params = new URLSearchParams(currentParams.toString());
          params.set("professionalId", current.id);
          router.push(
            params.toString()
              ? `?${params.toString()}`
              : window.location.pathname
          );
        }
      } catch {
        // ignore
      }
    };
    trySelectCurrentUser();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionals, selectedProfessional, onSelectionChange]);

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleSelectProfessional = (professional: User) => {
    onSelectionChange(professional);
    setIsDropdownOpen(false);
    setProfessionalSearch(""); // limpia el input

    // Añadir professionalId al URL y limpiar professionalSearch para deep-link
    const currentParams = new URL(window.location.href).searchParams;
    const params = new URLSearchParams(currentParams.toString());
    params.set("professionalId", professional.id);
    params.delete("professionalSearch");
    params.set("page", "1");
    router.push(
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );

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
        {!selectedProfessional && (
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Buscar profesional por nombre..."
              value={professionalSearchTerm || ""}
              onChange={(e) => {
                setProfessionalSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={handleInputFocus}
              className="pl-10"
              autoComplete="off"
            />
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700`}
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
                  setProfessionalSearch("");
                  // Remove professionalId from URL but preserve other params (including tab)
                  const currentParams = new URL(window.location.href)
                    .searchParams;
                  const params = new URLSearchParams(currentParams.toString());
                  params.delete("professionalId");
                  router.push(
                    params.toString()
                      ? `?${params.toString()}`
                      : window.location.pathname
                  );
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
