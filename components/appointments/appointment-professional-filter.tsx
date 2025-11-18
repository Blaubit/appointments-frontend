"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@/types";

interface AppointmentProfessionalFilterProps {
  professionals: User[];
  className?: string;
  currentUser?: User;
}

export function AppointmentProfessionalFilter({
  professionals,
  currentUser,
  className = "",
}: AppointmentProfessionalFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const professionalId = searchParams.get("professionalId");

  // If there are no professionals provided but there's a currentUser,
  // we preselect currentUser and make it immutable (can't change/clear).
  const noProfessionals = professionals.length === 0 && !!currentUser;

  const selectedProfessional = noProfessionals
    ? currentUser
    : professionals.find((p) => p.id.toString() === professionalId);

  const filteredProfessionals = professionals.filter((professional) =>
    professional.fullName
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  // Ensure that when we force-select currentUser (noProfessionals),
  // the professionalId is present in the URL so parent components and
  // server-side queries see the filter applied.
  useEffect(() => {
    if (noProfessionals && currentUser) {
      const params = new URLSearchParams(searchParams);
      const currentId = currentUser.id.toString();
      if (params.get("professionalId") !== currentId) {
        params.set("professionalId", currentId);
        params.delete("page"); // Reset pagination when applying filter
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        // Use replace to avoid adding a new history entry, but push is also OK.
        router.replace(newUrl);
      }
    }
    // We intentionally ignore searchParams in deps to avoid loops;
    // depend on noProfessionals and currentUser.id only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noProfessionals, currentUser?.id, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".professional-filter-container")) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfessionalSelect = (professional: User) => {
    // If there are no professionals to choose from (we're using currentUser as immutable),
    // prevent changing selection.
    if (noProfessionals) return;

    const params = new URLSearchParams(searchParams);
    params.set("professionalId", professional.id.toString());
    params.delete("page"); // Reset pagination when filtering

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);

    setIsOpen(false);
    setSearchTerm("");
  };

  const clearProfessionalFilter = () => {
    // When currentUser is forced as preselected (no professionals), don't allow clearing.
    if (noProfessionals) return;

    const params = new URLSearchParams(searchParams);
    params.delete("professionalId");
    params.delete("page"); // Reset pagination when clearing filter

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className={`relative professional-filter-container ${className}`}>
      {!selectedProfessional ? (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Filtrar por profesional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                // Only open the dropdown if there are professionals to choose from
                if (!noProfessionals) setIsOpen(true);
              }}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {filteredProfessionals.length > 0 ? (
                <div className="py-2">
                  {filteredProfessionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => handleProfessionalSelect(professional)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={professional.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {professional.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                          {professional.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {professional.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Users className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? `No se encontraron profesionales con "${searchTerm}"`
                      : "No hay profesionales disponibles"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            noProfessionals
              ? "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          }`}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={selectedProfessional.avatar || "/placeholder.svg"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
              {selectedProfessional.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span
            className={`text-sm font-medium text-gray-900 dark:text-white truncate max-w-32 ${
              noProfessionals ? "opacity-90" : ""
            }`}
          >
            {selectedProfessional.fullName}
          </span>

          {/* If we're in the "no professionals" state (currentUser preselected),
              do not render the clear button so the selection can't be changed. */}
          {!noProfessionals && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearProfessionalFilter}
              className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800"
              aria-label="Quitar filtro de profesional"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
