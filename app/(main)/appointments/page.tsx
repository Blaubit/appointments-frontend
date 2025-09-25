import { PageClient } from "./page.client";
import findAll from "@/actions/appointments/findAll";
import { findAllProfessionals } from "@/actions/user/findAllProfessionals";
interface AppointmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  // Await searchParams before using it
  const resolvedSearchParams = await searchParams;

  // Convert searchParams to URLSearchParams
  const urlSearchParams = new URLSearchParams();

  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  });

  const appointmentsResponse = await findAll({ searchParams: urlSearchParams });
  const professionalsResponse = await findAllProfessionals();

  if ("error" in professionalsResponse) {
    return (
      <div>
        Error loading professionals: {professionalsResponse.error.message}
      </div>
    );
  }

  if ("error" in appointmentsResponse) {
    return (
      <div>
        Error loading appointments: {appointmentsResponse.error.message}
      </div>
    );
  }

  return (
    <PageClient
      appointments={appointmentsResponse.data}
      meta={appointmentsResponse.meta}
      professionals={professionalsResponse.data}
      stats={appointmentsResponse.stats}
    />
  );
}
