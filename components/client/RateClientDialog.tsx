import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Client } from "@/types";
import rateClient from "@/actions/clients/rateClient";
import { toast } from "sonner"; // Asumiendo que usas sonner para toasts

interface RateClientDialogProps {
  client: Client;
  onRate?: (clientId: string, rating: number) => void; // Ahora es opcional
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const RateClientDialog: React.FC<RateClientDialogProps> = ({
  client,
  onRate,
  trigger,
  open: externalOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0); // Inicializar con 0
  const [isLoading, setIsLoading] = React.useState(false);

  // Use external open state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  // Simple star rating control
  const renderStars = () => (
    <div className="flex gap-2 mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-300 disabled:cursor-not-allowed`}
          aria-label={`Calificar con ${star} estrellas`}
          disabled={isLoading}
        >
          <Star size={32} fill={star <= rating ? "#facc15" : "none"} />
        </button>
      ))}
    </div>
  );

  const handleSave = async () => {
    if (rating === 0) return;

    setIsLoading(true);

    try {
      const result = await rateClient({
        id: client.id,
        rating: rating,
      });

      if ("data" in result) {
        // Éxito
        toast.success("Cliente calificado exitosamente");

        // Llamar el callback opcional si existe
        if (onRate) {
          onRate(client.id, rating);
        }

        setOpen(false);
      } else {
        // Error
        toast.error(result.message || "Error al calificar el cliente");
      }
    } catch (error) {
      console.error("Error rating client:", error);
      toast.error("Error inesperado al calificar el cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(0); // Resetear a la calificación original
    setOpen(false);
  };

  // If no trigger is provided and we're controlling externally, don't render DialogTrigger
  if (!trigger && externalOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calificar Cliente</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={client.avatar} alt={client.fullName} />
              <AvatarFallback>{client.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{client.fullName}</div>
              <div className="text-sm text-gray-500">{client.email}</div>
            </div>
          </div>
          <div>
            <span className="block mt-4 font-medium">
              Selecciona la calificación:
            </span>
            {renderStars()}
            {client.rating && (
              <p className="text-sm text-gray-500 mt-2">
                Calificación actual: {client.rating} estrellas
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={rating === 0 || isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Calificar cliente</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Calificar Cliente</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={client.avatar} alt={client.fullName} />
            <AvatarFallback>{client.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{client.fullName}</div>
            <div className="text-sm text-gray-500">{client.email}</div>
          </div>
        </div>
        <div>
          <span className="block mt-4 font-medium">
            Selecciona la calificación:
          </span>
          {renderStars()}
          {client.rating && (
            <p className="text-sm text-gray-500 mt-2">
              Calificación actual: {client.rating} estrellas
            </p>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={rating === 0 || isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
