"use client";

import { Calendar } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginHeaderProps {
  email?: string;
}

export function LoginHeader({ email }: LoginHeaderProps) {
  return (
    <CardHeader className="text-center space-y-6 pb-8">
      {/* Logo de Planit */}
      <div className="flex justify-center">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
          <Calendar className="h-8 w-8 text-white" />
        </div>
      </div>

      <div>
        <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white mb-2">
          Inicia sesión
        </CardTitle>
        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
          {email ? `Hola ${email}` : "Utiliza tu cuenta de Planit"}
        </CardDescription>
      </div>
    </CardHeader>
  );
}
