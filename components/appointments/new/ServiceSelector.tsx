import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Service } from "@/types";
import formatCurrency from "@/utils/functions/formatCurrency";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  services: Service[];
  selectedServices: string[];
  onSelectService: (serviceId: string) => void;
  isLoading: boolean;
  error: string | null;
  isLocked?: boolean;
  showError?: boolean; // Nueva prop para mostrar error
};

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
}

export const ServiceSelectorCard: React.FC<Props> = ({
  services,
  selectedServices,
  onSelectService,
  isLoading,
  error,
  isLocked = false,
  showError = false,
}) => {
  const hasError =
    showError && selectedServices.length === 0 && services.length > 0;

  return (
    <Card className={hasError ? "border-red-500 border-2" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Servicios</span>
          {hasError && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardTitle>
        <CardDescription>
          {services.length === 0
            ? "Primero selecciona un profesional para ver sus servicios disponibles"
            : "Selecciona uno o más servicios para la cita"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Alerta de error cuando no se han seleccionado servicios */}
        {hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debes seleccionar al menos un servicio para continuar
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Cargando servicios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400 opacity-50" />
            <p className="text-gray-500">
              Primero debes seleccionar un profesional para ver sus servicios
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const isSelected = selectedServices.includes(
                  service.id.toString()
                );
                return (
                  <div
                    key={service.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                        : hasError
                          ? "border-red-300 hover:border-red-400 dark:border-red-800"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-700 hover:shadow-sm"
                    }`}
                    onClick={() =>
                      !isLocked && onSelectService(service.id.toString())
                    }
                    style={
                      isLocked ? { pointerEvents: "none", opacity: 0.6 } : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </h4>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(service.durationMinutes)}
                      </span>
                      <span className="flex items-center font-medium">
                        {formatCurrency(Number(service.price))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contador de servicios seleccionados */}
            {selectedServices.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {selectedServices.length}{" "}
                  {selectedServices.length === 1
                    ? "servicio seleccionado"
                    : "servicios seleccionados"}
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
