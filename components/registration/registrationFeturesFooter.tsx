import Link from "next/link";
import { Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RegistrationFeaturesFooter = () => {
  return (
    <>
      {/* Features Section */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
          <Shield className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-green-600" />
          <p className="text-xs text-muted-foreground">100% Seguro</p>
        </div>
        <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
          <Clock className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-blue-600" />
          <p className="text-xs text-muted-foreground">Configuración Rápida</p>
        </div>
        <div className="p-2 sm:p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
          <Star className="h-4 w-4 sm:h-6 sm:w-6 mx-auto mb-2 text-yellow-600" />
          <p className="text-xs text-muted-foreground">Soporte 24/7</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-muted-foreground px-4">
        <p>Al registrarte, aceptas nuestros</p>
        <div className="flex justify-center space-x-4 mt-1">
          <Link href="/terms">
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
            >
              Términos de Servicio
            </Button>
          </Link>
          <span>•</span>
          <Link href="/privacy">
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground hover:text-blue-600"
            >
              Política de Privacidad
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
