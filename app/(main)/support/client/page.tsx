import type { Metadata } from "next"
import ClientSupportPage from "./page.client"

export const metadata: Metadata = {
  title: "Soporte al Cliente - CitasFácil",
  description: "Envía tu consulta o reporte un problema. Nuestro equipo te ayudará lo antes posible.",
  keywords: ["soporte", "ayuda", "contacto", "Guatemala", "clínica", "consultorio"],
}

export default function SupportClientPage() {
  return <ClientSupportPage />
}
