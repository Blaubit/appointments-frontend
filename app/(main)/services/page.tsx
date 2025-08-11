import type { ReadonlyURLSearchParams } from "next/navigation";
import PageClient from "./page.client";
import findAll from "@/actions/services/findAll";
import { Service } from "@/types";
type Props = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function Page({ searchParams }: Props) {
  // Mock data - in real app this would come from database
  const responseServices = await findAll();
  const services: Service[] = responseServices.data;
  const pagination = responseServices.meta;
  return (
    
    <PageClient services={services} pagination={pagination} />
  );
}
