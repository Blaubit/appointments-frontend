import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function TopClientsList({ topClients }: { topClients: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mejores Clientes</CardTitle>
        <CardDescription>
          Clientes con mayor frecuencia de visitas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/Avatar1.png?height=40&width=40" />
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${client.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {client.appointments} citas
                  </span>
                  <span className="text-xs text-gray-400">
                    Última: {client.lastVisit}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
