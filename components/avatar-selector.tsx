"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarPath: string) => void;
  disabled?: boolean;
}

const AVATAR_OPTIONS = [
  {
    id: "avatar1",
    path: "/Avatar1.png",
    name: "Avatar Predeterminado",
  },
  {
    id: "professional1", 
    path: "/Professional1.png",
    name: "Avatar Profesional",
  },
];

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar = "/Avatar1.png",
  onAvatarChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleAvatarSelect = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    onAvatarChange(avatarPath);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
        >
          <User className="h-4 w-4 mr-2" />
          Cambiar Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Avatar</DialogTitle>
          <DialogDescription>
            Elige un avatar de las opciones disponibles
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {AVATAR_OPTIONS.map((option) => (
            <div key={option.id} className="space-y-2">
              <Label className="text-sm font-medium">{option.name}</Label>
              <div
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-colors hover:bg-gray-50 ${
                  selectedAvatar === option.path
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleAvatarSelect(option.path)}
              >
                <div className="flex justify-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={option.path} alt={option.name} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                {selectedAvatar === option.path && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};