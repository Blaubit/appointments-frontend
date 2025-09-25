import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  count: number;
  variant:
    | "total"
    | "confirmed"
    | "pending"
    | "cancelled"
    | "today"
    | "tomorrow";
  icon?: LucideIcon;
  subtitle?: string;
}

export function StatsCard({
  title,
  count,
  variant,
  icon: Icon,
  subtitle,
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "total":
        return "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700";
      case "confirmed":
        return "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700";
      case "pending":
        return "border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700";
      case "cancelled":
        return "border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700";
      case "today":
        return "border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700";
      case "tomorrow":
        return "border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700";
      default:
        return "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700";
    }
  };

  const getCountColor = () => {
    switch (variant) {
      case "total":
        return "text-blue-600 dark:text-blue-400";
      case "confirmed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      case "today":
        return "text-purple-600 dark:text-purple-400";
      case "tomorrow":
        return "text-indigo-600 dark:text-indigo-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getIconColor = () => {
    return "text-muted-foreground";
  };

  return (
    <div
      className={`
        rounded-lg border bg-card text-card-foreground shadow-sm 
        transition-all duration-200 hover:shadow-md hover:-translate-y-1
        ${getVariantStyles()}
      `}
    >
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {Icon && <Icon className={`h-4 w-4 ${getIconColor()}`} />}
      </div>
      <div className="px-6 pb-6">
        <div className={`text-xl sm:text-2xl font-bold ${getCountColor()}`}>
          {count}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
