import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopServicesList({ topServices }: { topServices: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios Más Populares</CardTitle>
        <CardDescription>
          Ranking de servicios por número de citas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topServices.map((service, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${service.revenue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {service.appointments} citas
                  </span>
                  <Badge variant="secondary">{service.percentage}%</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
