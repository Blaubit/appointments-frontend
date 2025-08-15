import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

// Lista de avatares predeterminados
const AVATAR_OPTIONS = [
  "/Avatar1.png",
  "/Professional1.png",
  "/Avatar1.png",
  "/Professional1.png",
  "/Avatar1.png",
  "/Professional1.png",
  "/Avatar1.png",
  "/Professional1.png",
  "/Avatar1.png",
  "/Professional1.png",
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentAvatar,
}) => {
  const handleSelect = (avatarUrl: string) => {
    onSelect(avatarUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Avatar</DialogTitle>
          <DialogDescription>
            Elige un avatar de la colección disponible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 py-4">
          {AVATAR_OPTIONS.map((avatarUrl, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => handleSelect(avatarUrl)}
            >
              <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-blue-500 transition-colors">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  A{index + 1}
                </AvatarFallback>
              </Avatar>
              
              {/* Indicador de selección */}
              {currentAvatar === avatarUrl && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-1">
                    <Check className="h-4 w-4 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};