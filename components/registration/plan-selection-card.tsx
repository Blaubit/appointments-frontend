"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Check,
  Star,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
  Crown,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import { Plan } from "@/types";

interface PlanSelectionCardProps {
  /** Lista de planes disponibles */
  plans?: Plan[];
  /** Función para obtener planes del backend */
  onFetchPlans?: () => Promise<Plan[]>;
  /** Plan seleccionado actualmente */
  selectedPlanId?: string;
  /** Función llamada cuando se selecciona un plan */
  onPlanSelect?: (plan: Plan) => void;
  /** Función para confirmar la selección */
  onConfirm?: (planId: string) => void;
  /** Si está en proceso de carga */
  loading?: boolean;
  /** Error al cargar planes */
  error?: string;
  /** Clase CSS adicional */
  className?: string;
  /** Mostrar precio anual además del mensual */
  showAnnualPricing?: boolean;
  /** Plan recomendado */
  recommendedPlanId?: string;
  /** Si mostrar botón de confirmación */
  showConfirmButton?: boolean;
  /** Texto del botón de confirmación */
  confirmButtonText?: string;
}

interface PlanFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function PlanSelectionCard({
  plans: initialPlans = [],
  onFetchPlans,
  selectedPlanId,
  onPlanSelect,
  onConfirm,
  loading = false,
  error,
  className = "",
  showAnnualPricing = true,
  recommendedPlanId,
  showConfirmButton = true,
  confirmButtonText = "Confirmar Plan",
}: PlanSelectionCardProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isLoading, setIsLoading] = useState(loading);
  const [fetchError, setFetchError] = useState(error);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Cargar planes al montar el componente
  useEffect(() => {
    if (onFetchPlans && plans.length === 0) {
      fetchPlans();
    }
  }, [onFetchPlans, plans.length]);

  // Configurar API del carousel
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const fetchPlans = async () => {
    if (!onFetchPlans) return;

    setIsLoading(true);
    setFetchError(undefined);

    try {
      const fetchedPlans = await onFetchPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Error al cargar los planes"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("premium") || name.includes("pro")) {
      return <Crown className="h-8 w-8" />;
    }
    if (name.includes("enterprise") || name.includes("empresarial")) {
      return <Shield className="h-8 w-8" />;
    }
    if (name.includes("starter") || name.includes("básico")) {
      return <Zap className="h-8 w-8" />;
    }
    return <Users className="h-8 w-8" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("premium") || name.includes("pro")) {
      return "from-purple-500 to-pink-500";
    }
    if (name.includes("enterprise") || name.includes("empresarial")) {
      return "from-gray-700 to-gray-900";
    }
    if (name.includes("starter") || name.includes("básico")) {
      return "from-green-500 to-emerald-500";
    }
    return "from-blue-500 to-indigo-500";
  };

  // Función para formatear precios con billing cycle en días
  const formatPrice = (price: number, billingCycleDays: number) => {
    const dailyPrice = price / billingCycleDays;
    const monthlyPrice = dailyPrice * 30; // Aproximadamente 30 días por mes
    const yearlyPrice = dailyPrice * 365; // 365 días por año

    return {
      daily: dailyPrice,
      monthly: monthlyPrice,
      yearly: yearlyPrice,
      total: price,
      cycle: billingCycleDays,
      // Ahorro comparando con plan mensual hipotético
      savings: billingCycleDays >= 365 ? monthlyPrice * 12 - price : 0,
    };
  };

  // Función para formatear el período del billing cycle
  const formatBillingPeriod = (days: number) => {
    if (days === 1) return "día";
    if (days === 7) return "semana";
    if (days === 30 || days === 31) return "mes";
    if (days === 90) return "3 meses";
    if (days === 365 || days === 366) return "año";
    return `${days} días`;
  };

  const getPlanFeatures = (planName: string): PlanFeature[] => {
    const name = planName.toLowerCase();

    const commonFeatures = [
      {
        icon: <Calendar className="h-4 w-4" />,
        title: "Gestión de Citas",
        description: "Sistema completo",
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: "Gestión de Pacientes",
        description: "Base de datos",
      },
    ];

    if (name.includes("premium") || name.includes("pro")) {
      return [
        ...commonFeatures,
        {
          icon: <Shield className="h-4 w-4" />,
          title: "Reportes Avanzados",
          description: "Análisis detallado",
        },
        {
          icon: <Star className="h-4 w-4" />,
          title: "Soporte Prioritario",
          description: "Atención 24/7",
        },
      ];
    }

    if (name.includes("enterprise") || name.includes("empresarial")) {
      return [
        ...commonFeatures,
        {
          icon: <Shield className="h-4 w-4" />,
          title: "Múltiples Sucursales",
          description: "Gestión centralizada",
        },
        {
          icon: <Crown className="h-4 w-4" />,
          title: "API Personalizada",
          description: "Integración completa",
        },
      ];
    }

    return commonFeatures;
  };

  const activePlans = plans.filter(
    (plan) => plan.status === "active" || plan.status === "available"
  );

  // Estado de carga
  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <Card className="mx-auto max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-muted-foreground">
                Cargando planes disponibles...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de error
  if (fetchError) {
    return (
      <div className={`w-full ${className}`}>
        <Card className="mx-auto max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
              <div>
                <p className="text-red-600 font-medium">
                  Error al cargar planes
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {fetchError}
                </p>
                <Button variant="outline" onClick={fetchPlans} className="mt-3">
                  Reintentar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No hay planes
  if (activePlans.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <Card className="mx-auto max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <DollarSign className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-muted-foreground">No hay planes disponibles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4 px-4 sm:px-8">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Elige tu Plan
          </h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a las necesidades de tu
            clínica
          </p>
        </div>
      </div>

      {/* Carousel - Una sola card por vista con espacio para badges */}
      <div className="px-4 sm:px-8 lg:px-12">
        <Carousel
          setApi={setApi}
          className="w-full max-w-4xl mx-auto"
          opts={{
            align: "center",
            loop: false,
          }}
        >
          <CarouselContent>
            {activePlans.map((plan, index) => {
              const isSelected = selectedPlanId === plan.id;
              const isRecommended = recommendedPlanId === plan.id;
              const pricing = formatPrice(plan.price, plan.billingCycle);
              const features = getPlanFeatures(plan.name);

              return (
                <CarouselItem key={plan.id} className="basis-full">
                  <div className="p-2">
                    {/* Contenedor con espacio superior para badges */}
                    <div className="relative pt-6">
                      {/* Badge recomendado */}
                      {isRecommended && (
                        <div className="absolute -top-2 left-6 z-20">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1 text-sm font-semibold shadow-lg border-0">
                            <Star className="h-4 w-4 mr-1" />
                            Más Popular
                          </Badge>
                        </div>
                      )}

                      {/* Badge seleccionado */}
                      {isSelected && (
                        <div className="absolute -top-2 right-6 z-20">
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 text-sm font-semibold shadow-lg border-0">
                            <Check className="h-4 w-4 mr-1" />
                            Seleccionado
                          </Badge>
                        </div>
                      )}

                      <Card
                        className={`relative transition-all duration-300 hover:shadow-xl cursor-pointer group h-auto ${
                          isSelected
                            ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
                            : "hover:shadow-lg"
                        } ${
                          isRecommended
                            ? "border-2 border-yellow-300 shadow-yellow-100 dark:border-yellow-600"
                            : "border border-gray-200 dark:border-gray-700"
                        }`}
                        onClick={() => onPlanSelect?.(plan)}
                      >
                        {/* Layout horizontal para hacer más ancho y menos alto */}
                        <div className="flex flex-col lg:flex-row lg:items-center p-6">
                          {/* Sección izquierda - Info del plan */}
                          <div className="flex-1 lg:pr-8">
                            <CardHeader className="p-0 pb-4 lg:pb-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Icono */}
                                <div className="flex justify-center sm:justify-start">
                                  <div
                                    className={`p-3 bg-gradient-to-r ${getPlanColor(plan.name)} rounded-full text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}
                                  >
                                    {getPlanIcon(plan.name)}
                                  </div>
                                </div>

                                {/* Nombre y precio */}
                                <div className="text-center sm:text-left">
                                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                  </CardTitle>

                                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                      ${pricing.monthly.toFixed(0)}
                                    </span>
                                    <span className="text-lg text-muted-foreground">
                                      /mes
                                    </span>
                                  </div>

                                  {/* Información del billing cycle */}
                                  <div className="mt-1">
                                    <p className="text-sm text-muted-foreground">
                                      ${pricing.total} cada{" "}
                                      {formatBillingPeriod(plan.billingCycle)}
                                    </p>
                                    {showAnnualPricing &&
                                      pricing.savings > 0 && (
                                        <p className="text-sm font-medium text-green-600">
                                          Ahorras ${pricing.savings.toFixed(0)}{" "}
                                          al año
                                        </p>
                                      )}
                                    {plan.billingCycle > 1 && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        ${pricing.daily.toFixed(2)}/día
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Descripción */}
                              <CardDescription className="text-center sm:text-left text-base leading-relaxed mt-4">
                                {plan.description}
                              </CardDescription>
                            </CardHeader>
                          </div>

                          {/* Sección derecha - Features y botón */}
                          <div className="lg:w-80 lg:flex-shrink-0">
                            <CardContent className="p-0">
                              {/* Features */}
                              <div className="space-y-3 mb-6">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-center lg:text-left">
                                  Características incluidas:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                  {features.map((feature, featureIndex) => (
                                    <div
                                      key={featureIndex}
                                      className="flex items-center space-x-3"
                                    >
                                      <div className="flex-shrink-0 text-green-500">
                                        {feature.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                          {feature.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {feature.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Botón */}
                              <CardFooter className="p-0">
                                <Button
                                  className={`w-full py-3 text-base font-semibold transition-all duration-200 ${
                                    isSelected
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                                      : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border-2 hover:border-blue-300"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPlanSelect?.(plan);
                                  }}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="h-5 w-3 mr-2" />
                                      Plan Seleccionado
                                    </>
                                  ) : (
                                    "Seleccionar Plan"
                                  )}
                                </Button>
                              </CardFooter>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Botones de navegación */}
          {activePlans.length > 1 && (
            <>
              <CarouselPrevious className="-left-4 lg:-left-8 h-10 w-10" />
              <CarouselNext className="-right-4 lg:-right-8 h-10 w-10" />
            </>
          )}
        </Carousel>

        {/* Indicadores de posición */}
        {activePlans.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === current - 1
                    ? "bg-blue-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="text-center space-y-6 px-4 sm:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Cancelación flexible</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-500" />
            <span>Sin compromisos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-green-500" />
            <span>Soporte incluido</span>
          </div>
        </div>

        {/* Botón de confirmación */}
        {showConfirmButton && selectedPlanId && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={() => onConfirm?.(selectedPlanId)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {confirmButtonText}
              <Check className="h-5 w-5 ml-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para manejar la lógica de planes
export function usePlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirm = async (
    planId: string,
    onConfirmPlan: (subscription: any) => Promise<any>
  ) => {
    if (!selectedPlan) return;

    setIsConfirming(true);
    try {
      const startDate = new Date().toISOString().split("T")[0];
      // Calcular fecha de fin basada en días de billing cycle
      const endDate = new Date(
        Date.now() + selectedPlan.billingCycle * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];

      const subscription = {
        planId: selectedPlan.id,
        startDate,
        endDate,
        createdById: "{{userId}}",
      };

      await onConfirmPlan(subscription);
    } catch (error) {
      console.error("Error al confirmar plan:", error);
      throw error;
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    selectedPlan,
    isConfirming,
    handlePlanSelect,
    handleConfirm,
  };
}
