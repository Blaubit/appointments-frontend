import type { Metadata } from "next";
import AdminSupportPage from "./page.client";
import { getTickets } from "@/actions/tickets/get-tickets";

export const metadata: Metadata = {
  title: "Administración de Tickets - CitasFácil",
  description:
    "Panel de administración para gestionar tickets de soporte de clientes.",
  keywords: ["admin", "tickets", "soporte", "gestión"],
};

export default async function SupportAdminPage() {
  // Llama a la action para obtener los tickets del backend real
  const resp = await getTickets();
  if ("message" in resp) {
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar tickets: {resp.message}
      </div>
    );
  }

  // Los datos reales de tickets y conteo
  const tickets = resp.data;
  const count = resp.count;

  return <AdminSupportPage tickets={tickets} count={count} />;
}
