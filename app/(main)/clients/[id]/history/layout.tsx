import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Historial del Cliente - Sistema de Citas",
  description: "Historial completo de citas del cliente",
}

export default function ClientHistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
