import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AppointmentsByHourChart({
  appointmentsByHour,
}: {
  appointmentsByHour: any[];
}) {
  const maxAppointments = Math.max(
    ...appointmentsByHour.map((item: any) => item.count)
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas por Hora</CardTitle>
        <CardDescription>Distribución de citas durante el día</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointmentsByHour.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                {data.hour}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {data.count} citas
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round((data.count / maxAppointments) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(data.count / maxAppointments) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
