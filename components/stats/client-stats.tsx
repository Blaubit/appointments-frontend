import { ClientAppointmentsStats } from "@/types/appointments";
import { StatsCard } from "@/components/stats/stats-card";
import { Calendar, CheckCircle, DollarSign, XCircle } from "lucide-react";

interface ClientStatsSectionProps {
  stats: ClientAppointmentsStats;
}

export function ClientStatsSection({ stats }: ClientStatsSectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <StatsCard
        title="Total Citas"
        count={stats.totalCount}
        variant="total"
        icon={Calendar}
      />

      <StatsCard
        title="Completadas"
        count={stats.completed}
        variant="confirmed"
        icon={CheckCircle}
      />

      <StatsCard
        title="Total Gastado"
        count={stats.totalAmountSpent}
        variant="today"
        icon={DollarSign}
        subtitle="Q"
      />

      <StatsCard
        title="Canceladas"
        count={stats.cancelled}
        variant="cancelled"
        icon={XCircle}
      />
    </div>
  );
}
