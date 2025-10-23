import { Suspense } from "react";
import PatientFormClient from "./page.client";
import { findOne } from "@/actions/clients/findOne";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientRecordPage({ params }: PageProps) {
  const clientId = (await params).id;
  const client = await findOne(clientId);

  if (!client || "error" in client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PatientFormClient clientId={clientId} client={client.data} />
    </Suspense>
  );
}
