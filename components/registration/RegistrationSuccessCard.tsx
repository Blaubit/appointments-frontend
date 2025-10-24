import Link from "next/link";
import {
  CheckCircle,
  Building2,
  User,
  Star,
  Mail,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Plan } from "@/types";

interface RegistrationSuccessCardProps {
  companyName: string;
  companyType: string;
  adminFullName: string;
  selectedPlan: Plan | null;
  companyTypes: any[];
}

export const RegistrationSuccessCard = ({
  companyName,
  companyType,
  adminFullName,
  selectedPlan,
  companyTypes,
}: RegistrationSuccessCardProps) => {
  const companyTypeLabel = companyTypes.find(
    (t) => t.value === companyType
  )?.label;

  return (
    <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto">
            <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              ¡Empresa Registrada Exitosamente!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Bienvenido a CitasFácil, {adminFullName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 text-sm">
              <Building2 className="h-4 w-4 inline mr-2" />
              Empresa Creada
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              {companyName}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
              {companyTypeLabel}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2 text-sm">
              <User className="h-4 w-4 inline mr-2" />
              Usuario Administrador
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-400">
              {adminFullName}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
              Rol: Administrador de Empresa
            </p>
          </div>
        </div>

        {selectedPlan && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2 text-sm">
              <Star className="h-4 w-4 inline mr-2" />
              Plan Seleccionado
            </h4>
            <p className="text-sm text-green-800 dark:text-green-400">
              {selectedPlan.name} - ${selectedPlan.price}/
              {selectedPlan.billingCycle} días
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
              Suscripción activa
            </p>
          </div>
        )}

        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-300 mb-4 text-sm sm:text-base">
            ¿Qué sigue?
          </h4>
          <div className="space-y-3 text-xs sm:text-sm text-green-800 dark:text-green-400">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>Revisa tu email para verificar tu cuenta</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>Crea usuarios para doctores y secretarias</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>Configura servicios y horarios de trabajo</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>Personaliza tu perfil empresarial</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              Ir al Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full bg-transparent">
              Iniciar Sesión Más Tarde
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
