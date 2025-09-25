"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounceSearch } from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";

interface AppointmentSearchProps {
  placeholder?: string;
  className?: string;
}

export function AppointmentSearch({
  placeholder = "Search appointments...",
  className = "",
}: AppointmentSearchProps) {
  const searchParams = useSearchParams();
  const initialValue = searchParams.get("q") || "";

  const { searchTerm, handleSearch, clearSearch } = useDebounceSearch(
    initialValue,
    {
      delay: 500,
      minLength: 2, // Permite búsquedas desde el primer carácter
      resetPage: true, // Resetea la página cuando se hace una nueva búsqueda
      skipInitialSearch: false, // No omite la búsqueda inicial si hay un valor en la URL
    }
  );

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-gray-100"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}
