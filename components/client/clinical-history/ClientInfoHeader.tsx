"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building } from "lucide-react";
import { Client } from "@/types";

interface ClientInfoHeaderProps {
  client: Client;
}

export function ClientInfoHeader({ client }: ClientInfoHeaderProps) {
  return (
    <Card className="mb-6 border-border bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={client.avatar || "/default-avatar.png"}
              alt={client.fullName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
            />
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground truncate">
                {client.fullName}
              </h2>
              {client.status && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : client.status === "inactive"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {client.status === "active"
                    ? "Activo"
                    : client.status === "inactive"
                      ? "Inactivo"
                      : "Bloqueado"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground/70" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground/70" />
                <span>{client.phone}</span>
              </div>
              {client.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground/70" />
                  <span className="truncate">{client.company.name}</span>
                </div>
              )}
            </div>

            {client.tags && client.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {client.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
