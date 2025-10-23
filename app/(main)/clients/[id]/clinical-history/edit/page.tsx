import { Suspense } from "react";
import EditPatientFormClient from "./page.client";
import { findOne } from "@/actions/clients/findOne";
import { getClinicalHistory } from "@/actions/clients/findClinicalHistory";
import { transformClinicalHistoryToPatientRecord } from "@/types";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPatientRecordPage({ params }: PageProps) {
  const clientId = (await params).id;

  // Obtener datos del cliente
  const clientResult = await findOne(clientId);

  if (!clientResult || "error" in clientResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Cliente no encontrado
          </h2>
          <p className="text-muted-foreground">
            No se pudo cargar la información del cliente.
          </p>
        </div>
      </div>
    );
  }

  // Obtener historial clínico
  const clinicalHistoryResult = await getClinicalHistory(clientId);

  let clinicalHistory = null;

  if ("data" in clinicalHistoryResult && clinicalHistoryResult.data) {
    // Transformar SOLO al recibir (porque el API devuelve formato anidado)
    clinicalHistory = transformClinicalHistoryToPatientRecord(
      clinicalHistoryResult.data
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Historial clínico no encontrado
          </h2>
          <p className="text-muted-foreground">
            No se pudo cargar la información del historial clínico.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditPatientFormClient
        clientId={clientId}
        client={clientResult.data}
        initialData={clinicalHistory}
      />
    </Suspense>
  );
}
