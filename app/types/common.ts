import type React from "react"
export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  initials: string
  permissions: string[]
  lastLogin?: string
  isActive: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface Pagination {
  page: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface DataViewField {
  key: string
  label: string
  type: "text" | "email" | "phone" | "date" | "number" | "boolean" | "badge" | "avatar" | "custom" | "duration"
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  primary?: boolean
  secondary?: boolean
  showInTable?: boolean
  showInCard?: boolean
  width?: string
  align?: "left" | "center" | "right"
  render?: (value: any, item: any) => React.ReactNode
  avatarConfig?: {
    nameKey: string
    imageKey: string
  }
}

export interface DataViewAction {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (item: any) => void
  variant?: "default" | "destructive" | "outline" | "secondary"
  show?: (item: any) => boolean
  disabled?: (item: any) => boolean
}

export interface EmptyState {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SortOption {
  label: string
  value: string
  direction: "asc" | "desc"
}

export interface SearchConfig {
  placeholder: string
  fields: string[]
  debounceMs: number
}

export interface ExportConfig {
  formats: ("csv" | "pdf" | "excel")[]
  filename: string
  fields?: string[]
}
