"use client";

import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List } from "lucide-react";
import { ClientForm } from "@/components/client-form";
import type { ClientFormData } from "@/types";

interface ClientsHeaderProps {
  onCreateClient: (data: ClientFormData) => Promise<void>;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
}

export function ClientsHeader({
  onCreateClient,
  viewMode,
  onViewModeChange,
}: ClientsHeaderProps) {
  return (
    <div className="flex flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
      <ClientForm
        trigger={
          <Button className="btn-gradient-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo paciente
          </Button>
        }
        onSubmit={onCreateClient}
      />

      <div className="flex border rounded-lg">
        <Button
          variant={viewMode === "cards" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("cards")}
          className="rounded-r-none"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="rounded-l-none"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
