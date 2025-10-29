import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SummaryTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Detallado</CardTitle>
        <CardDescription>
          Métricas clave del período seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Métrica
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Valor Actual
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Mes Anterior
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Cambio
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Ingresos Totales
                </td>
                <td className="py-3 px-4 text-right font-medium">$24,580</td>
                <td className="py-3 px-4 text-right text-gray-500">$21,840</td>
                <td className="py-3 px-4 text-right text-green-600">+12.5%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Total de Citas
                </td>
                <td className="py-3 px-4 text-right font-medium">342</td>
                <td className="py-3 px-4 text-right text-gray-500">316</td>
                <td className="py-3 px-4 text-right text-green-600">+8.2%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Nuevos pacientes
                </td>
                <td className="py-3 px-4 text-right font-medium">28</td>
                <td className="py-3 px-4 text-right text-gray-500">24</td>
                <td className="py-3 px-4 text-right text-green-600">+15.3%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Citas Canceladas
                </td>
                <td className="py-3 px-4 text-right font-medium">18</td>
                <td className="py-3 px-4 text-right text-gray-500">23</td>
                <td className="py-3 px-4 text-right text-green-600">-21.7%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  Ingreso Promedio por Cita
                </td>
                <td className="py-3 px-4 text-right font-medium">$71.87</td>
                <td className="py-3 px-4 text-right text-gray-500">$69.11</td>
                <td className="py-3 px-4 text-right text-green-600">+4.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
