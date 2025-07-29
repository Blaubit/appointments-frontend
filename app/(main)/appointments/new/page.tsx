import PageClient from "./page.client"
import findAll from "@/actions/services/findAll" // asegúrate que esta función exista
import {findAll as findAllClients} from "@/actions/clients/findAll" // nueva importación para clientes
import type { Service, Client } from "@/types"

export default async function Page() {
  const services: Service[] = (await findAll()).data
  const clients:Client[] = (await findAllClients()).data // obteniendo los clientes
  return <PageClient services={services} clients={clients} />
}