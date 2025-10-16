"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { Client, PatientRecord } from "@/types";
import { ClientInfoHeader } from "@/components/client/clinical-history/ClientInfoHeader";
import { ClinicalHistoryForm } from "@/components/client/clinical-history/ClinicalHistoryForm";

interface EditPatientFormClientProps {
  clientId: string;
  client: Client;
  initialData: PatientRecord | null; // Cambiar de opcional a obligatorio pero puede ser null
}

export default function EditPatientFormClient({
  clientId,
  client,
  initialData,
}: EditPatientFormClientProps) {
  // Debug: verificar qué datos llegan
  useEffect(() => {}, [clientId, client, initialData]);

  return (
    <div>
      <Header
        title="Editar Historia Clínica"
        backButtonHref="/clients"
        showBackButton
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Information Header */}
        <ClientInfoHeader client={client} />

        {/* Clinical History Form in Update Mode */}
        <ClinicalHistoryForm
          clientId={clientId}
          initialData={initialData}
          mode="update"
        />
      </div>
    </div>
  );
}
