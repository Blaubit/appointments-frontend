import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle, Clock, DollarSign } from "lucide-react";

type Service = {
  id: string | number;
  name: string;
  price: number | string;
  durationMinutes: number;
};

type Props = {
  services: Service[];
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  formatDuration: (totalMinutes: number) => string;
};

export const ServiceSelector: React.FC<Props> = ({
  services,
  selectedServices,
  setSelectedServices,
  formatDuration,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Servicios</span>
        </CardTitle>
        <CardDescription>
          Selecciona uno o más servicios para la cita
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const id = service.id.toString();
            const isSelected = selectedServices.includes(id);
            return (
              <div
                key={id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedServices(selectedServices.filter((s) => s !== id));
                  } else {
                    setSelectedServices([...selectedServices, id]);
                  }
                }}
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
                    <DollarSign className="h-4 w-4 mr-1" />
                    {service.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};