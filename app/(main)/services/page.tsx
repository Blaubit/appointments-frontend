import type { ReadonlyURLSearchParams } from "next/navigation";
import PageClient from "./page.client";
import { findAll } from "@/actions/services/findAll";
import { Service } from "@/types";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  // Extraer parámetros de búsqueda
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 10;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const status = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  // Crear URLSearchParams para enviar al backend
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  if (search) params.set('search', search);
  if (status && status !== 'all') params.set('status', status);

  const responseServices = await findAll({ searchParams: params });
  
  const services: Service[] = responseServices.data || [];
  const pagination = responseServices.meta;

  return (
    <PageClient 
      services={services} 
      pagination={pagination}
      initialSearchParams={{
        page,
        limit,
        search,
        status
      }}
    />
  );
}