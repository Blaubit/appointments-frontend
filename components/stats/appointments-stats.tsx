import { StatsCard } from "./stats-card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface AppointmentsStatsProps {
  stats: {
    todayCount: number;
    tomorrowCount: number;
    confirmedCount: number;
    cancelledCount: number;
    pendingCount: number;
  };
}

export function AppointmentsStats({ stats }: AppointmentsStatsProps) {
  const totalCount =
    stats.confirmedCount + stats.cancelledCount + stats.pendingCount;

  const confirmedPercentage =
    totalCount > 0 ? Math.round((stats.confirmedCount / totalCount) * 100) : 0;

  const pendingPercentage =
    totalCount > 0 ? Math.round((stats.pendingCount / totalCount) * 100) : 0;

  return (
    <div className="w-full">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Citas"
            count={totalCount}
            variant="total"
            icon={Calendar}
            subtitle={`${stats.todayCount + stats.tomorrowCount} próximas`}
          />
          <StatsCard
            title="Confirmadas"
            count={stats.confirmedCount}
            variant="confirmed"
            icon={CheckCircle}
            subtitle={`${confirmedPercentage}% del total`}
          />
          <StatsCard
            title="Pendientes"
            count={stats.pendingCount}
            variant="pending"
            icon={Clock}
            subtitle={`${pendingPercentage}% del total`}
          />
          <StatsCard
            title="Canceladas"
            count={stats.cancelledCount}
            variant="cancelled"
            icon={XCircle}
            subtitle="Requieren atención"
          />
        </div>
      </div>
    </div>
  );
}
