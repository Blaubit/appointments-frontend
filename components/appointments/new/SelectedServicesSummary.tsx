import React from "react";

type Service = {
  id: string | number;
  name: string;
  price: number | string;
  durationMinutes: number;
};

type Props = {
  selectedServicesData: string[];
  services: Service[];
  totalPrice: number;
  totalDuration: number;
  formatDuration: (totalMinutes: number) => string;
};

export const SelectedServicesSummary: React.FC<Props> = ({
  selectedServicesData,
  services,
  totalPrice,
  totalDuration,
  formatDuration,
}) => {
  if (selectedServicesData.length === 0) return null;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
        Servicios Seleccionados
      </h4>
      <ul className="space-y-2">
        {selectedServicesData.map((serviceName, index) => {
          const service = services.find((s) => s.name === serviceName);
          return (
            <li key={index} className="flex items-center justify-between">
              <span>{serviceName}</span>
              <span className="text-sm text-gray-500">
                ${service?.price ?? "0"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t pt-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total:</span>
          <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Duración Total:</span>
          <span className="font-medium">{formatDuration(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
};
