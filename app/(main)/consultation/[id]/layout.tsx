import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Consulta Activa",
  description: "Vista de consulta médica en progreso",
}

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>
}
