import PageClient from "./page.client";
import { findAll } from "@/actions/services/findAll";
import { Service } from "@/types";
import { getUser } from "@/actions/auth/getUser";
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  // Await searchParams before accessing properties
  const resolvedSearchParams = await searchParams;

  // Extraer parámetros de búsqueda
  const page =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const limit =
    typeof resolvedSearchParams.limit === "string"
      ? parseInt(resolvedSearchParams.limit)
      : 9;
  // CAMBIO: usar 'q' en vez de 'search'
  const q =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const status =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "all";

  // Crear URLSearchParams para enviar al backend
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (q) params.set("q", q);
  if (status && status !== "all") params.set("status", status);
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const responseServices = await findAll({ searchParams: params });

  const services: Service[] = responseServices.data || [];
  const pagination = responseServices.meta;

  return (
    <PageClient
      user={user}
      services={services}
      pagination={pagination}
      initialSearchParams={{
        page,
        limit,
        q,
        status,
      }}
    />
  );
}
