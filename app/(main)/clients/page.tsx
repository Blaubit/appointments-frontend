import { Header } from "@/components/header";
import ClientsPageClient from "./page.client";
import type { Client, ClientStats, Pagination } from "@/types";

// Mock data para clientes
const mockClients: Client[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612 345 678",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "active",
    dateOfBirth: "1985-03-15",
    gender: "female",
    address: {
      street: "Calle Mayor 123",
      city: "Madrid",
      state: "Madrid",
      zipCode: "28001",
      country: "España",
    },
    emergencyContact: {
      name: "Carlos González",
      phone: "+34 612 345 679",
      relationship: "Esposo",
    },
    medicalHistory: ["Hipertensión", "Diabetes tipo 2"],
    allergies: ["Penicilina", "Mariscos"],
    medications: ["Metformina", "Enalapril"],
    insuranceInfo: {
      provider: "Sanitas",
      policyNumber: "SAN123456",
      groupNumber: "GRP001",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: false,
    },
    notes: "Cliente VIP, prefiere citas por la mañana",
    tags: ["VIP", "Frecuente"],
    referralSource: "Recomendación médica",
    totalAppointments: 15,
    totalSpent: 1250.0,
    rating: 5,
    lastAppointment: "2024-01-15",
    createdAt: "2023-06-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+34 623 456 789",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "active",
    dateOfBirth: "1978-11-22",
    gender: "male",
    address: {
      street: "Avenida de la Paz 45",
      city: "Barcelona",
      state: "Barcelona",
      zipCode: "08001",
      country: "España",
    },
    emergencyContact: {
      name: "Ana Rodríguez",
      phone: "+34 623 456 790",
      relationship: "Esposa",
    },
    medicalHistory: ["Asma"],
    allergies: ["Polen"],
    medications: ["Salbutamol"],
    insuranceInfo: {
      provider: "Adeslas",
      policyNumber: "ADE789012",
      groupNumber: "GRP002",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: true,
      phone: true,
    },
    notes: "Prefiere citas después de las 18:00",
    tags: ["Regular"],
    referralSource: "Búsqueda online",
    totalAppointments: 8,
    totalSpent: 640.0,
    rating: 4,
    lastAppointment: "2024-01-10",
    createdAt: "2023-08-15",
    updatedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+34 634 567 890",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "inactive",
    dateOfBirth: "1992-07-08",
    gender: "female",
    address: {
      street: "Plaza España 12",
      city: "Valencia",
      state: "Valencia",
      zipCode: "46001",
      country: "España",
    },
    emergencyContact: {
      name: "Luis Martínez",
      phone: "+34 634 567 891",
      relationship: "Hermano",
    },
    medicalHistory: [],
    allergies: ["Látex"],
    medications: [],
    insuranceInfo: {
      provider: "DKV",
      policyNumber: "DKV345678",
      groupNumber: "GRP003",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: false,
      phone: false,
    },
    notes: "Cliente nuevo, primera consulta pendiente",
    tags: ["Nuevo"],
    referralSource: "Redes sociales",
    totalAppointments: 2,
    totalSpent: 160.0,
    rating: 3,
    lastAppointment: "2023-12-20",
    createdAt: "2023-12-01",
    updatedAt: "2023-12-20",
  },
  {
    id: "4",
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+34 645 678 901",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "active",
    dateOfBirth: "1965-04-30",
    gender: "male",
    address: {
      street: "Calle Serrano 89",
      city: "Madrid",
      state: "Madrid",
      zipCode: "28006",
      country: "España",
    },
    emergencyContact: {
      name: "Carmen Silva",
      phone: "+34 645 678 902",
      relationship: "Esposa",
    },
    medicalHistory: ["Artritis", "Colesterol alto"],
    allergies: [],
    medications: ["Ibuprofeno", "Simvastatina"],
    insuranceInfo: {
      provider: "Mapfre",
      policyNumber: "MAP901234",
      groupNumber: "GRP004",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: false,
      sms: true,
      whatsapp: false,
      phone: true,
    },
    notes: "Cliente de larga duración, muy puntual",
    tags: ["VIP", "Leal"],
    referralSource: "Cliente existente",
    totalAppointments: 25,
    totalSpent: 2100.0,
    rating: 5,
    lastAppointment: "2024-01-12",
    createdAt: "2022-03-15",
    updatedAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    phone: "+34 656 789 012",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "blocked",
    dateOfBirth: "1988-09-14",
    gender: "female",
    address: {
      street: "Calle Alcalá 200",
      city: "Madrid",
      state: "Madrid",
      zipCode: "28028",
      country: "España",
    },
    emergencyContact: {
      name: "Pedro Fernández",
      phone: "+34 656 789 013",
      relationship: "Padre",
    },
    medicalHistory: ["Migraña crónica"],
    allergies: ["Aspirina"],
    medications: ["Sumatriptán"],
    insuranceInfo: {
      provider: "Asisa",
      policyNumber: "ASI567890",
      groupNumber: "GRP005",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: true,
      phone: false,
    },
    notes: "Cliente bloqueado por no-show repetidos",
    tags: ["Problemático"],
    referralSource: "Publicidad",
    totalAppointments: 3,
    totalSpent: 180.0,
    rating: 2,
    lastAppointment: "2023-11-05",
    createdAt: "2023-10-01",
    updatedAt: "2023-11-05",
  },
  {
    id: "6",
    name: "Javier López",
    email: "javier.lopez@email.com",
    phone: "+34 667 890 123",
    avatar: "/Avatar1.png?height=40&width=40",
    status: "active",
    dateOfBirth: "1995-12-03",
    gender: "male",
    address: {
      street: "Gran Vía 28",
      city: "Bilbao",
      state: "Vizcaya",
      zipCode: "48001",
      country: "España",
    },
    emergencyContact: {
      name: "María López",
      phone: "+34 667 890 124",
      relationship: "Madre",
    },
    medicalHistory: [],
    allergies: ["Frutos secos"],
    medications: [],
    insuranceInfo: {
      provider: "Sanitas",
      policyNumber: "SAN678901",
      groupNumber: "GRP006",
    },
    preferredLanguage: "es",
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: false,
    },
    notes: "Cliente joven, muy activo en redes sociales",
    tags: ["Nuevo", "Joven"],
    referralSource: "Instagram",
    totalAppointments: 4,
    totalSpent: 320.0,
    rating: 4,
    lastAppointment: "2024-01-08",
    createdAt: "2023-11-15",
    updatedAt: "2024-01-08",
  },
];

// Estadísticas calculadas
const mockStats: ClientStats = {
  totalClients: mockClients.length,
  activeClients: mockClients.filter((c) => c.status === "active").length,
  newThisMonth: mockClients.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length,
  averageRating:
    mockClients.reduce((acc, c) => acc + c.rating, 0) / mockClients.length,
};

const mockPagination: Pagination = {
  page: 1,
  itemsPerPage: 10,
  totalItems: mockClients.length,
  totalPages: Math.ceil(mockClients.length / 10),
  hasNext: mockClients.length > 10,
  hasPrev: false,
};

// Función para filtrar clientes (simulando server-side filtering)
function getFilteredClients(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  let filteredClients = [...mockClients];

  // Filtro por búsqueda
  if (searchParams.search && typeof searchParams.search === "string") {
    const search = searchParams.search.toLowerCase();
    filteredClients = filteredClients.filter(
      (client) =>
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone.includes(search),
    );
  }

  // Filtro por estado
  if (
    searchParams.status &&
    typeof searchParams.status === "string" &&
    searchParams.status !== "all"
  ) {
    filteredClients = filteredClients.filter(
      (client) => client.status === searchParams.status,
    );
  }

  // Filtro por etiquetas
  if (searchParams.tags && typeof searchParams.tags === "string") {
    const tags = searchParams.tags.split(",");
    filteredClients = filteredClients.filter((client) =>
      tags.some((tag) => client.tags?.includes(tag)),
    );
  }

  return filteredClients;
}

export default function ClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const filteredClients = getFilteredClients(searchParams);

  // Recalcular estadísticas basadas en clientes filtrados
  const stats: ClientStats = {
    totalClients: filteredClients.length,
    activeClients: filteredClients.filter((c) => c.status === "active").length,
    newThisMonth: filteredClients.filter((c) => {
      const createdDate = new Date(c.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length,
    averageRating:
      filteredClients.length > 0
        ? filteredClients.reduce((acc, c) => acc + c.rating, 0) /
          filteredClients.length
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Clientes"
        subtitle="Gestiona la información de tus clientes"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientsPageClient
          clients={filteredClients}
          stats={stats}
          pagination={mockPagination}
        />
      </main>
    </div>
  );
}
