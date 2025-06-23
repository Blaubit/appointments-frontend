"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid3X3, List } from "lucide-react"

interface ViewToggleProps {
  value: "cards" | "table"
  onValueChange: (value: "cards" | "table") => void
  className?: string
}

export function ViewToggle({ value, onValueChange, className = "" }: ViewToggleProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={`w-auto ${className}`}>
      <TabsList>
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4" />
          <span className="hidden sm:inline">Tarjetas</span>
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Tabla</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (item: any) => React.ReactNode
}

interface DataViewProps {
  data: any[]
  viewMode: "cards" | "table"
  columns: Column[]
  cardComponent: (item: any) => React.ReactNode
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
  }
  className?: string
}

export function DataView({ data, viewMode, columns, cardComponent, emptyState, className = "" }: DataViewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (data.length === 0 && emptyState) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        {emptyState.icon && <div className="mb-4">{emptyState.icon}</div>}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{emptyState.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md">{emptyState.description}</p>
        {emptyState.action && emptyState.action}
      </div>
    )
  }

  if (viewMode === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {sortedData.map((item, index) => (
          <div key={item.id || index}>{cardComponent(item)}</div>
        ))}
      </div>
    )
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`h-12 px-4 text-left align-middle font-medium ${
                    column.sortable ? "cursor-pointer hover:bg-muted/80" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={item.id || index} className="border-b hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={column.key} className="p-4">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Hook para manejar el estado de la vista
export function useDataView(defaultView: "cards" | "table" = "cards") {
  const [viewMode, setViewMode] = useState<"cards" | "table">(defaultView)

  return {
    viewMode,
    setViewMode,
    ViewToggle: (props: Omit<ViewToggleProps, "value" | "onValueChange">) => (
      <ViewToggle {...props} value={viewMode} onValueChange={setViewMode} />
    ),
  }
}
