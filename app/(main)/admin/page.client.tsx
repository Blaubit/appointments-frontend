"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  CreditCard,
  Eye,
  Edit,
} from "lucide-react";
import type {
  Company,
  SaaSMetrics,
  CreatePaymentData,
  SubscriptionStatus,
} from "@/types/saas";

// Mock data para el SaaS
const mockMetrics: SaaSMetrics = {
  totalCompanies: 45,
  activeCompanies: 42,
  totalRevenue: 125000,
  monthlyRevenue: 15600,
  churnRate: 2.1,
  newSignups: 8,
  overduePayments: 3,
};

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Clínica San Rafael",
    companyType: "medical",
    address: "6a Avenida 12-23, Zona 10",
    city: "Guatemala",
    state: "Guatemala",
    postal_code: "01010",
    country: "Guatemala",
    description: "Clínica médica especializada en medicina general",
    contactEmail: "admin@clinicasanrafael.com",
    contactPhone: "+502 2345-6789",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    isActive: true,
    subscription: {
      id: "sub_1",
      companyId: "1",
      plan: "professional",
      status: "active",
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-01-31",
      nextBillingDate: "2024-02-01",
      amount: 299,
      currency: "USD",
      paymentMethod: "credit_card",
      lastPaymentDate: "2024-01-01",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    users: [
      {
        id: "u1",
        companyId: "1",
        name: "Dr. García",
        email: "garcia@clinica.com",
        role: "doctor",
        isActive: true,
        lastLogin: "2024-01-20",
        createdAt: "2024-01-15",
      },
      {
        id: "u2",
        companyId: "1",
        name: "María Secretaria",
        email: "maria@clinica.com",
        role: "secretary",
        isActive: true,
        lastLogin: "2024-01-21",
        createdAt: "2024-01-15",
      },
    ],
  },
  {
    id: "2",
    name: "Centro Dental Sonrisa",
    companyType: "dental",
    address: "12 Calle 5-67, Zona 9",
    city: "Guatemala",
    state: "Guatemala",
    postal_code: "01009",
    country: "Guatemala",
    description: "Centro dental especializado en ortodoncia",
    contactEmail: "info@dentalsonrisa.com",
    contactPhone: "+502 2456-7890",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    isActive: true,
    subscription: {
      id: "sub_2",
      companyId: "2",
      plan: "basic",
      status: "past_due",
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-01-31",
      nextBillingDate: "2024-02-01",
      amount: 149,
      currency: "USD",
      paymentMethod: "bank_transfer",
      lastPaymentDate: "2023-12-01",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    users: [
      {
        id: "u3",
        companyId: "2",
        name: "Dr. López",
        email: "lopez@dental.com",
        role: "doctor",
        isActive: true,
        lastLogin: "2024-01-19",
        createdAt: "2024-01-10",
      },
    ],
  },
  {
    id: "3",
    name: "Hospital Central",
    companyType: "medical",
    address: "Avenida Reforma 15-89, Zona 10",
    city: "Guatemala",
    state: "Guatemala",
    postal_code: "01010",
    country: "Guatemala",
    description: "Hospital general con múltiples especialidades",
    contactEmail: "admin@hospitalcentral.com",
    contactPhone: "+502 2567-8901",
    createdAt: "2023-12-01",
    updatedAt: "2023-12-01",
    isActive: true,
    subscription: {
      id: "sub_3",
      companyId: "3",
      plan: "enterprise",
      status: "active",
      currentPeriodStart: "2024-01-01",
      currentPeriodEnd: "2024-01-31",
      nextBillingDate: "2024-02-01",
      amount: 599,
      currency: "USD",
      paymentMethod: "credit_card",
      lastPaymentDate: "2024-01-01",
      createdAt: "2023-12-01",
      updatedAt: "2024-01-01",
    },
    users: [
      {
        id: "u4",
        companyId: "3",
        name: "Dr. Rodríguez",
        email: "rodriguez@hospital.com",
        role: "doctor",
        isActive: true,
        lastLogin: "2024-01-21",
        createdAt: "2023-12-01",
      },
      {
        id: "u5",
        companyId: "3",
        name: "Dr. Martínez",
        email: "martinez@hospital.com",
        role: "doctor",
        isActive: true,
        lastLogin: "2024-01-20",
        createdAt: "2023-12-01",
      },
      {
        id: "u6",
        companyId: "3",
        name: "Ana Admin",
        email: "ana@hospital.com",
        role: "admin",
        isActive: true,
        lastLogin: "2024-01-21",
        createdAt: "2023-12-01",
      },
    ],
  },
];

export default function AdminPageClient() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [metrics] = useState<SaaSMetrics>(mockMetrics);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentData>({
    companyId: "",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "credit_card",
    transactionId: "",
    notes: "",
  });

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.subscription.status === statusFilter;
    const matchesPlan =
      planFilter === "all" || company.subscription.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "past_due":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "canceled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "unpaid":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "trialing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return "Activo";
      case "past_due":
        return "Vencido";
      case "canceled":
        return "Cancelado";
      case "unpaid":
        return "Sin Pagar";
      case "trialing":
        return "Prueba";
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "professional":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "enterprise":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "basic":
        return "Básico";
      case "professional":
        return "Profesional";
      case "enterprise":
        return "Empresarial";
      default:
        return plan;
    }
  };

  const handleMarkAsPaid = () => {
    if (!selectedCompany) return;

    // Actualizar la suscripción
    const updatedCompanies = companies.map((company) => {
      if (company.id === selectedCompany.id) {
        const currentDate = new Date();
        const nextMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate(),
        );

        return {
          ...company,
          subscription: {
            ...company.subscription,
            status: "active" as SubscriptionStatus,
            lastPaymentDate: paymentData.paymentDate,
            currentPeriodStart: paymentData.paymentDate,
            currentPeriodEnd: nextMonth.toISOString().split("T")[0],
            nextBillingDate: nextMonth.toISOString().split("T")[0],
            updatedAt: new Date().toISOString(),
          },
        };
      }
      return company;
    });

    setCompanies(updatedCompanies);
    setIsPaymentModalOpen(false);
    setSelectedCompany(null);
    setPaymentData({
      companyId: "",
      amount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "credit_card",
      transactionId: "",
      notes: "",
    });
  };

  const openPaymentModal = (company: Company) => {
    setSelectedCompany(company);
    setPaymentData({
      ...paymentData,
      companyId: company.id,
      amount: company.subscription.amount,
    });
    setIsPaymentModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Panel de Administración SaaS"
        subtitle="Gestiona todas las empresas clientes y suscripciones"
        showBackButton={true}
        backButtonText="Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Empresas
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.totalCompanies}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.activeCompanies} activas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ingresos Mensuales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.monthlyRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total: {formatCurrency(metrics.totalRevenue)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nuevos Registros
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.newSignups}</div>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagos Vencidos
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {metrics.overduePayments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requieren atención
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Empresas con pagos vencidos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Empresas con Pagos Vencidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies
                    .filter((c) => c.subscription.status === "past_due")
                    .map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {company.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Vencido desde:{" "}
                              {formatDate(company.subscription.nextBillingDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            {formatCurrency(company.subscription.amount)}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => openPaymentModal(company)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Marcar Pagado
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Gestión de Empresas
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar empresas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="past_due">Vencido</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                        <SelectItem value="unpaid">Sin Pagar</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los planes</SelectItem>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="professional">
                          Profesional
                        </SelectItem>
                        <SelectItem value="enterprise">Empresarial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Próximo Pago</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Usuarios</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((company) => {
                        const daysUntilDue = getDaysUntilDue(
                          company.subscription.nextBillingDate,
                        );
                        return (
                          <TableRow key={company.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                  <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {company.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {company.contactEmail}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getPlanColor(
                                  company.subscription.plan,
                                )}
                              >
                                {getPlanLabel(company.subscription.plan)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(
                                  company.subscription.status,
                                )}
                              >
                                {getStatusLabel(company.subscription.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="text-foreground">
                                  {formatDate(
                                    company.subscription.nextBillingDate,
                                  )}
                                </p>
                                <p
                                  className={`text-xs ${daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 7 ? "text-yellow-600" : "text-muted-foreground"}`}
                                >
                                  {daysUntilDue < 0
                                    ? `${Math.abs(daysUntilDue)} días vencido`
                                    : daysUntilDue === 0
                                      ? "Vence hoy"
                                      : `${daysUntilDue} días restantes`}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-foreground">
                                {formatCurrency(company.subscription.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="text-foreground">
                                  {company.users.length} usuarios
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {
                                    company.users.filter((u: any) => u.isActive)
                                      .length
                                  }{" "}
                                  activos
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {company.subscription.status === "past_due" && (
                                  <Button
                                    size="sm"
                                    onClick={() => openPaymentModal(company)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Historial de Pagos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Historial de Pagos
                  </h3>
                  <p className="text-muted-foreground">
                    Aquí aparecerá el historial completo de todos los pagos
                    realizados por las empresas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Pago</DialogTitle>
            </DialogHeader>
            {selectedCompany && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-foreground">
                    {selectedCompany.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Plan: {getPlanLabel(selectedCompany.subscription.plan)}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={paymentData.amount}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            amount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">Fecha de Pago</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={paymentData.paymentDate}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            paymentDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select
                      value={paymentData.paymentMethod}
                      onValueChange={(value) =>
                        setPaymentData({ ...paymentData, paymentMethod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">
                          Tarjeta de Crédito
                        </SelectItem>
                        <SelectItem value="bank_transfer">
                          Transferencia Bancaria
                        </SelectItem>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="check">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId">
                      ID de Transacción (Opcional)
                    </Label>
                    <Input
                      id="transactionId"
                      placeholder="TXN123456789"
                      value={paymentData.transactionId}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          transactionId: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Input
                      id="notes"
                      placeholder="Notas adicionales..."
                      value={paymentData.notes}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleMarkAsPaid}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Pago
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
