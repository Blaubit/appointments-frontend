import type { Metadata } from "next";
import AdminSupportPage from "./page.client";

export const metadata: Metadata = {
  title: "Administración de Tickets - CitasFácil",
  description:
    "Panel de administración para gestionar tickets de soporte de clientes.",
  keywords: ["admin", "tickets", "soporte", "gestión"],
};

export default function SupportAdminPage() {
  return <AdminSupportPage />;
}
