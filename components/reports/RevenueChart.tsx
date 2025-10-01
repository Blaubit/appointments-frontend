import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RevenueChart({ monthlyData }: { monthlyData: any[] }) {
  const maxRevenue = Math.max(...monthlyData.map((item: any) => item.revenue));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <CardDescription>
          Evolución de ingresos en los últimos 6 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                {data.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${data.revenue.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {data.appointments} citas
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(data.revenue / maxRevenue) * 100}%`,
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
