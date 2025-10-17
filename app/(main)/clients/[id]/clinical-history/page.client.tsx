"use client";

import { Header } from "@/components/header";
import { Client, PatientRecord } from "@/types";
import { ClientInfoHeader } from "@/components/client/clinical-history/ClientInfoHeader";
import { ClinicalHistoryForm } from "@/components/client/clinical-history/ClinicalHistoryForm";

interface PatientFormClientProps {
  clientId: string;
  client: Client;
  initialData?: PatientRecord | null;
  mode?: "create" | "update";
}

export default function PatientFormClient({
  clientId,
  client,
  initialData = null,
  mode = "create",
}: PatientFormClientProps) {
  return (
    <div>
      <Header
        title="Historia Clínica"
        backButtonHref="/clients"
        showBackButton
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client Information Header */}
        <ClientInfoHeader client={client} />

        {/* Clinical History Form */}
        <ClinicalHistoryForm
          clientId={clientId}
          initialData={initialData}
          mode={mode}
        />
      </div>
    </div>
  );
}
