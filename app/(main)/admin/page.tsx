import { Suspense } from "react";
import AdminPageClient from "./page.client";

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Cargando panel de administración...</div>}>
      <AdminPageClient />
    </Suspense>
  );
}
