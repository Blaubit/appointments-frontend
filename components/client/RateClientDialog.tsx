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

interface RateClientDialogProps {
  client: Client;
  onRate: (clientId: string, rating: number) => void;
  trigger?: React.ReactNode; // Optional custom trigger (button, icon, etc.)
  open?: boolean; // Add this prop to control dialog state externally
  onOpenChange?: (open: boolean) => void; // Add this prop to handle state changes
}

export const RateClientDialog: React.FC<RateClientDialogProps> = ({
  client,
  onRate,
  trigger,
  open: externalOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [rating, setRating] = React.useState(Number(client.rating) || 0);

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
          className={star <= rating ? "text-yellow-400" : "text-gray-300"}
          aria-label={`Calificar con ${star} estrellas`}
        >
          <Star size={32} fill={star <= rating ? "#facc15" : "none"} />
        </button>
      ))}
    </div>
  );

  const handleSave = () => {
    onRate(client.id, rating);
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
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={rating === 0}>
              Guardar
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
        </div>
        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={rating === 0}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
