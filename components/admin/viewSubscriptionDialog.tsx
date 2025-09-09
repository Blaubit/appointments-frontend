import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/types";
import { Building2, CreditCard, Users } from "lucide-react";

interface ViewDialogProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ViewDialog({ open, onClose, subscription }: ViewDialogProps) {
  if (!subscription) return null;

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    past_due: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    canceled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    unpaid:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    trialing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  const planColors: Record<string, string> = {
    basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    professional:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    enterprise:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  const getStatusColor = (status: string) =>
    statusColors[status.toLowerCase()] ?? statusColors.canceled;
  const getPlanColor = (planName: string) =>
    planColors[planName.toLowerCase()] ?? planColors.basic;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-6 w-6 text-blue-500" />
            {subscription.company.name}
          </DialogTitle>
          <DialogDescription className="text-base mt-1 mb-4">
            Información detallada de la empresa y la suscripción.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground">
                Usuarios actuales
              </span>
              <div className="flex items-center gap-1 font-medium text-foreground">
                <Users className="h-4 w-4 mr-1 text-blue-500" />
                {subscription.currentUsers}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Plan</span>
              <Badge className={getPlanColor(subscription.plan.name)}>
                {subscription.plan.name}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Estado</span>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Próximo pago
              </span>
              <div className="font-medium text-foreground">
                {formatDate(subscription.endDate)}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Monto</span>
              <div className="flex items-center gap-1 font-medium text-foreground">
                <CreditCard className="h-4 w-4 mr-1 text-green-500" />
                {formatCurrency(subscription.plan.price)}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
