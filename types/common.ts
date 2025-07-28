import type React from "react";


export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: number;
  previousPage?: number;
}

type FieldType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "currency"
  | "number"
  | "badge"
  | "avatar"
  | "rating"
  | "tags"
  | "duration"
  | "custom"
  | string; // Permite tipos personalizados
export interface DataViewField {
  key: string;
  label: string;
  type: FieldType;

  // Visualización
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  primary?: boolean;
  secondary?: boolean;
  showInTable?: boolean;
  showInCard?: boolean;
  width?: string;
  align?: "left" | "center" | "right";

  // Render personalizado
  render?: (value: any, item: any) => React.ReactNode;

  // Configuraciones específicas
  badgeConfig?: {
    colors: Record<string, string>;
    labels?: Record<string, string>;
  };

  avatarConfig?: {
    nameKey?: string;
    imageKey?: string;
    fallbackKey?: string;
  };

  tagsConfig?: {
    colorMap?: Record<string, string>;
  };
}

export interface DataViewAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: any) => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  show?: (item: any) => boolean;
  disabled?: (item: any) => boolean;
}

export interface EmptyState {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
  direction: "asc" | "desc";
}

export interface SearchConfig {
  placeholder: string;
  fields: string[];
  debounceMs: number;
}

export interface ExportConfig {
  formats: ("csv" | "pdf" | "excel")[];
  filename: string;
  fields?: string[];
}
