import { Suspense } from "react"
import CalendarPageClient from "./page.client"
import { Header } from "@/components/header"
import findAll from "@/actions/appointments/findAll";
import {findAll as findAllServices} from "@/actions/services/findAll";
// Mock data que vendría de la base de datos

export default async function CalendarPage() {
  // Obtener datos del servidor
  const [appointments, services] = await Promise.all([findAll(), findAllServices()])
  console.log("Appointments:", appointments.data);
  console.log("Services:", services.data);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header del servidor */}
      <Header
        title="Calendario"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      {/* Componente cliente con datos del servidor */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <CalendarPageClient initialAppointments={appointments.data} services={services.data} />
      </Suspense>
    </div>
  )
}
