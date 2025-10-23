import { getUser } from "@/actions/auth";
import PageClientSupport from "./page.client";
import submitTicket from "@/actions/tickets/submit-ticket";

export default async function SupportPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">
        Debes iniciar sesión para enviar tickets de soporte.
      </div>
    );
  }

  const userData = {
    userId: user.id,
    userName: user.fullName,
    userEmail: user.email,
    userRole: user.role?.name || "",
    externalId: user.id,
    sourceSystem: "ERP-VENTAS",
  };

  return <PageClientSupport userData={userData} submitTicket={submitTicket} />;
}
