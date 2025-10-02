import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  count: string | number;
  variant:
    | "total"
    | "confirmed"
    | "pending"
    | "cancelled"
    | "today"
    | "tomorrow"
    | string;
  icon?: LucideIcon;
  subtitle?: string; // muestra el cambio porcentual y referencia
  trend?: "up" | "down" | string; // nueva prop para tendencia
  change?: string; // nueva prop para el % de cambio (ej: "+12.5%")
}

export function StatsCard({
  title,
  count,
  variant,
  icon: Icon,
  subtitle,
  trend,
  change,
}: StatsCardProps) {
  // Colores y fondos según variante
  const getVariantStyles = () => {
    switch (variant) {
      case "total":
        return {
          border:
            "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
          iconBg: "bg-blue-100 dark:bg-blue-900",
          iconColor: "text-blue-600 dark:text-blue-400",
        };
      case "confirmed":
        return {
          border:
            "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700",
          iconBg: "bg-green-100 dark:bg-green-900",
          iconColor: "text-green-600 dark:text-green-400",
        };
      case "pending":
        return {
          border:
            "border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700",
          iconBg: "bg-yellow-100 dark:bg-yellow-900",
          iconColor: "text-yellow-600 dark:text-yellow-400",
        };
      case "cancelled":
        return {
          border:
            "border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700",
          iconBg: "bg-red-100 dark:bg-red-900",
          iconColor: "text-red-600 dark:text-red-400",
        };
      case "today":
        return {
          border:
            "border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700",
          iconBg: "bg-purple-100 dark:bg-purple-900",
          iconColor: "text-purple-600 dark:text-purple-400",
        };
      case "tomorrow":
        return {
          border:
            "border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700",
          iconBg: "bg-indigo-100 dark:bg-indigo-900",
          iconColor: "text-indigo-600 dark:text-indigo-400",
        };
      default:
        return {
          border:
            "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
          iconBg: "bg-gray-100 dark:bg-gray-900",
          iconColor: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Flecha y color de cambio
  const renderTrend = () => {
    if (!trend || !change) return null;
    return (
      <div className="flex items-center mt-2">
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span
          className={`text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
      </div>
    );
  };

  return (
    <div
      className={`
        rounded-lg border bg-card text-card-foreground shadow-sm 
        transition-all duration-200 hover:shadow-md hover:-translate-y-1
        ${variantStyles.border}
      `}
    >
      <div className="flex items-center justify-between space-y-0 pb-2 p-6">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {Icon && (
          <div
            className={`p-3 rounded-full ${variantStyles.iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${variantStyles.iconColor}`} />
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        <div className={`text-3xl font-bold text-gray-900 dark:text-white`}>
          {typeof count === "number" ? count : count}
        </div>
        {renderTrend()}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
