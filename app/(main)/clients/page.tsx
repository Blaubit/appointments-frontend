import { ReadonlyURLSearchParams } from "next/navigation";
import ClientsPageClient from "./page.client";

// Mock functions - estas deberían ser reemplazadas por tus acciones reales
async function getClients(searchParams?: URLSearchParams) {
  // Simular filtros desde searchParams
  const query = searchParams?.get('query') || '';
  const status = searchParams?.get('status') || 'all';
  const page = parseInt(searchParams?.get('page') || '1');
  const limit = parseInt(searchParams?.get('limit') || '10');

  // Datos mock de clientes
  const allClients = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+34 612 345 678",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active" as const,
      totalAppointments: 12,
      lastAppointment: "2024-01-15",
      nextAppointment: "2024-01-25",
      totalSpent: 850,
      rating: 4.8,
      notes: "Cliente preferencial, siempre puntual",
      address: "Calle Mayor 123, Madrid",
      birthDate: "1985-03-15",
      joinDate: "2023-06-10",
      preferredServices: ["Corte", "Tinte"],
      tags: ["VIP", "Frecuente"],
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+34 687 654 321",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active" as const,
      totalAppointments: 8,
      lastAppointment: "2024-01-10",
      nextAppointment: null,
      totalSpent: 420,
      rating: 4.5,
      notes: "Prefiere citas por la mañana",
      address: "Avenida de la Paz 45, Barcelona",
      birthDate: "1990-07-22",
      joinDate: "2023-08-15",
      preferredServices: ["Corte", "Barba"],
      tags: ["Regular"],
    },
    {
      id: 3,
      name: "Ana Martín",
      email: "ana.martin@email.com",
      phone: "+34 654 987 321",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "inactive" as const,
      totalAppointments: 3,
      lastAppointment: "2023-11-20",
      nextAppointment: null,
      totalSpent: 180,
      rating: 4.2,
      notes: "Cliente nueva, necesita seguimiento",
      address: "Plaza del Sol 8, Valencia",
      birthDate: "1992-12-03",
      joinDate: "2023-10-05",
      preferredServices: ["Manicura"],
      tags: ["Nuevo"],
    },
    {
      id: 4,
      name: "David López",
      email: "david.lopez@email.com",
      phone: "+34 698 123 456",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active" as const,
      totalAppointments: 15,
      lastAppointment: "2024-01-18",
      nextAppointment: "2024-01-28",
      totalSpent: 1200,
      rating: 5.0,
      notes: "Cliente muy satisfecho, recomienda a otros",
      address: "Calle de la Rosa 67, Sevilla",
      birthDate: "1988-05-10",
      joinDate: "2023-04-20",
      preferredServices: ["Corte", "Tratamiento"],
      tags: ["VIP", "Embajador"],
    },
    {
      id: 5,
      name: "Laura Fernández",
      email: "laura.fernandez@email.com",
      phone: "+34 633 789 456",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "active" as const,
      totalAppointments: 7,
      lastAppointment: "2024-01-12",
      nextAppointment: "2024-01-30",
      totalSpent: 350,
      rating: 4.3,
      notes: "Prefiere servicios de relajación",
      address: "Calle de la Luna 89, Bilbao",
      birthDate: "1987-09-18",
      joinDate: "2023-09-05",
      preferredServices: ["Masaje", "Tratamiento facial"],
      tags: ["Regular", "Relajación"],
    },
    {
      id: 6,
      name: "Javier Moreno",
      email: "javier.moreno@email.com",
      phone: "+34 645 321 987",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "inactive" as const,
      totalAppointments: 2,
      lastAppointment: "2023-12-05",
      nextAppointment: null,
      totalSpent: 120,
      rating: 3.8,
      notes: "Cliente ocasional",
      address: "Plaza Mayor 15, Salamanca",
      birthDate: "1995-01-25",
      joinDate: "2023-11-20",
      preferredServices: ["Corte"],
      tags: ["Ocasional"],
    },
  ];

  // Aplicar filtros
  let filteredClients = allClients;

  // Filtro por búsqueda
  if (query) {
    filteredClients = filteredClients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.email.toLowerCase().includes(query.toLowerCase()) ||
      client.phone.includes(query)
    );
  }

  // Filtro por estado
  if (status !== 'all') {
    filteredClients = filteredClients.filter(client => client.status === status);
  }

  // Simular paginación
  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  return {
    data: paginatedClients,
    meta: {
      totalItems,
      totalPages,
      page,
      limit,
    }
  };
}

async function getClientsStats() {
  // Simular llamada a API/base de datos para obtener estadísticas
  return {
    totalClients: 156,
    activeClients: 142,
    newThisMonth: 23,
    averageRating: 4.6,
  };
}

async function getUserInfo() {
  // Simular obtener información del usuario autenticado
  return {
    name: "Dr. Roberto Silva",
    email: "roberto.silva@email.com",
    role: "Médico General",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DR",
  };
}

type Props = {
  searchParams?: ReadonlyURLSearchParams;
};

export default async function ClientsPage({ searchParams }: Props) {
  try {
    const params = searchParams ? new URLSearchParams() : new URLSearchParams();
    
    // Ejecutar todas las consultas en paralelo para mejor rendimiento
    const [clientsResponse, stats, user] = await Promise.all([
      getClients(params),
      getClientsStats(),
      getUserInfo()
    ]);

    const clientsData = {
      clients: clientsResponse.data,
      pagination: clientsResponse.meta,
      stats,
      user,
      initialFilters: {
        query: params.get('query') || '',
        status: params.get('status') || 'all',
      }
    };

    return <ClientsPageClient {...clientsData} />;
    
  } catch (error) {
    console.error("Error loading clients data:", error);
    throw new Error("Failed to load clients data");
  }
}