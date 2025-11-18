import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, DollarSign } from "lucide-react";
import type { Service as ServiceType, User } from "@/types";
import { ServiceCardActions } from "./ServiceCardActions";
import formatCurrency from "@/utils/functions/formatCurrency";

export function ServicesCardsGrid({
  services,
  onEdit,
  onToggleStatus,
  onDelete,
  user,
}: {
  services: ServiceType[];
  onEdit: (s: ServiceType) => void;
  onToggleStatus: (s: ServiceType) => void;
  onDelete: (id: string) => void;
  user?: User;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => (
        <Card key={s.id} className="hover:shadow">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" /> {s.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {s.durationMinutes} minutos
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {formatCurrency(Number(s.price))}
                </p>
              </div>
              <ServiceCardActions
                service={s}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                user={user}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
