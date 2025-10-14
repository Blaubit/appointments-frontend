"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, Star } from "lucide-react";
import type { ClientStats } from "@/types";

interface ClientsStatsCardsProps {
  stats: ClientStats;
}

export function ClientsStatsCards({ stats }: ClientsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.totalClients}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalClients > 0
              ? `+${stats.newClientsLastDays} en los últimos días`
              : "Comienza agregando clientes"}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Clientes Activos
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.activeClients}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalClients > 0
              ? `${Math.round((stats.activeClients / stats.totalClients) * 100)}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Nuevos este Mes</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.newClientsLastDays}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalClients > 0
              ? "Crecimiento en los últimos días"
              : "Sin registros"}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Valoración Promedio
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {stats.averageRating}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalClients > 0 ? "De 5.0 estrellas" : "Sin valoraciones"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
