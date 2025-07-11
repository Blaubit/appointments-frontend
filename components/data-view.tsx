"use client";

import type React from "react";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Grid3X3,
  List,
  MoreHorizontal,
  Star,
  Calendar,
  Phone,
  Mail,
  Clock,
  DollarSign,
} from "lucide-react";
import { DataViewAction, DataViewField } from "@/types";

interface ViewToggleProps {
  value: "cards" | "table";
  onValueChange: (value: "cards" | "table") => void;
  className?: string;
}

export function ViewToggle({
  value,
  onValueChange,
  className = "",
}: ViewToggleProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(val) => {
        if (val === "cards" || val === "table") {
          onValueChange(val);
        }
      }}
      className={`w-auto ${className}`}
    >
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
  );
}

interface DataViewProps {
  data: any[];
  fields: DataViewField[];
  actions?: DataViewAction[];
  viewMode: "cards" | "table";
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  className?: string;
}

export function DataView({
  data,
  fields,
  actions = [],
  viewMode,
  emptyState,
  className = "",
}: DataViewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (fieldKey: string) => {
    const field = fields.find((f) => f.key === fieldKey);
    if (!field?.sortable) return;

    if (sortColumn === fieldKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(fieldKey);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Función para renderizar valores según el tipo
  const renderFieldValue = (field: DataViewField, value: any, item: any) => {
    if (field.render) {
      return field.render(value, item);
    }

    switch (field.type) {
      case "text":
        return <span>{value}</span>;

      case "email":
        return (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{value}</span>
          </div>
        );

      case "phone":
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        );

      case "date":
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{value ? new Date(value).toLocaleDateString() : "-"}</span>
          </div>
        );

      case "currency":
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">
              ${typeof value === "number" ? value.toLocaleString() : value}
            </span>
          </div>
        );

      case "number":
        return <span className="font-medium">{value}</span>;

      case "duration":
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{value} min</span>
          </div>
        );

      case "badge":
        const badgeColor =
          field.badgeConfig?.colors?.[value] || "bg-gray-100 text-gray-800";
        const badgeLabel = field.badgeConfig?.labels?.[value] || value;
        return <Badge className={badgeColor}>{badgeLabel}</Badge>;

      case "avatar":
        const config = field.avatarConfig || {};
        const name = item[config.nameKey || "name"] || "";
        const image =
          item[config.imageKey || "avatar"] || item[config.imageKey || "image"];
        const fallback =
          item[config.fallbackKey || "initials"] ||
          name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase();

        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={image || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
          </Avatar>
        );

      case "rating":
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{value}</span>
          </div>
        );

      case "tags":
        if (!Array.isArray(value)) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`text-xs ${field.tagsConfig?.colorMap?.[tag] || ""}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        );

      default:
        return <span>{value}</span>;
    }
  };

  if (data.length === 0 && emptyState) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        {emptyState.icon && <div className="mb-4">{emptyState.icon}</div>}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {emptyState.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md">
          {emptyState.description}
        </p>
        {emptyState.action && emptyState.action}
      </div>
    );
  }

  if (viewMode === "cards") {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      >
        {sortedData.map((item, index) => {
          const primaryField = fields.find((f) => f.primary);
          const secondaryField = fields.find((f) => f.secondary);
          const cardFields = fields.filter(
            (f) => f.showInCard !== false && !f.primary && !f.secondary,
          );

          return (
            <Card
              key={item.id || index}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar si existe */}
                    {fields.some((f) => f.type === "avatar") && (
                      <div className="flex-shrink-0">
                        {renderFieldValue(
                          fields.find((f) => f.type === "avatar")!,
                          item[fields.find((f) => f.type === "avatar")!.key],
                          item,
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {primaryField && (
                        <CardTitle className="text-base truncate">
                          {renderFieldValue(
                            primaryField,
                            item[primaryField.key],
                            item,
                          )}
                        </CardTitle>
                      )}
                      {secondaryField && (
                        <CardDescription className="text-sm">
                          {renderFieldValue(
                            secondaryField,
                            item[secondaryField.key],
                            item,
                          )}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  {/* Actions dropdown */}
                  {actions.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {actions.map((action, actionIndex) => {
                          if (action.show && !action.show(item)) return null;
                          return (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={
                                action.variant === "destructive"
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              <action.icon className="h-4 w-4 mr-2" />
                              {action.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Campos de la tarjeta */}
                <div className="space-y-2 text-sm">
                  {cardFields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">
                        {field.label}:
                      </span>
                      <div className="font-medium">
                        {renderFieldValue(field, item[field.key], item)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags si existen */}
                {fields.some((f) => f.type === "tags") && (
                  <>
                    <Separator />
                    <div>
                      {renderFieldValue(
                        fields.find((f) => f.type === "tags")!,
                        item[fields.find((f) => f.type === "tags")!.key],
                        item,
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Vista de tabla
  const tableFields = fields.filter((f) => f.showInTable !== false);

  return (
    <div className={`rounded-md border ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {tableFields.map((field) => (
                <th
                  key={field.key}
                  className={`h-12 px-4 text-left align-middle font-medium ${
                    field.sortable ? "cursor-pointer hover:bg-muted/80" : ""
                  }`}
                  onClick={() => field.sortable && handleSort(field.key)}
                >
                  <div className="flex items-center gap-2">
                    {field.label}
                    {field.sortable && sortColumn === field.key && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={item.id || index} className="border-b hover:bg-muted/50">
                {tableFields.map((field) => (
                  <td key={field.key} className="p-4">
                    {field.type === "avatar" && field.primary ? (
                      <div className="flex items-center gap-3">
                        {renderFieldValue(field, item[field.key], item)}
                        <div>
                          <div className="font-medium">
                            {
                              item[
                                fields.find(
                                  (f) => f.primary && f.key !== field.key,
                                )?.key || "name"
                              ]
                            }
                          </div>
                          {fields.find((f) => f.secondary) && (
                            <div className="text-sm text-muted-foreground">
                              {item[fields.find((f) => f.secondary)!.key]}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      renderFieldValue(field, item[field.key], item)
                    )}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {actions.map((action, actionIndex) => {
                          if (action.show && !action.show(item)) return null;
                          return (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={
                                action.variant === "destructive"
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              <action.icon className="h-4 w-4 mr-2" />
                              {action.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Hook para manejar el estado de la vista
export function useDataView(defaultView: "cards" | "table" = "cards") {
  const [viewMode, setViewMode] = useState<"cards" | "table">(defaultView);

  return {
    viewMode,
    setViewMode,
    ViewToggle: (props: Omit<ViewToggleProps, "value" | "onValueChange">) => (
      <ViewToggle {...props} value={viewMode} onValueChange={setViewMode} />
    ),
  };
}
