import type { ReactNode } from "react";
import { Header } from "@/components/header";

export default function SupportLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header
        title="Soporte"
        subtitle="Preguntas Frecuentes y Ayuda"
        backButtonHref="/dashboard"
        showBackButton
      />
      <main className="min-h-screen bg-white dark:bg-gray-900">{children}</main>
    </>
  );
}
