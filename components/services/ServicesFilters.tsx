import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, Search } from "lucide-react";

export function ServicesFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  handleStatusFilter,
  viewMode,
  setViewMode,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  handleStatusFilter: (value: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Buscar servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex border rounded-lg">
        <Button
          variant={viewMode === "cards" ? "default" : "ghost"}
          onClick={() => setViewMode("cards")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "default" : "ghost"}
          onClick={() => setViewMode("table")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
