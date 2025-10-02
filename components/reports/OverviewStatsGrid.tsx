import { DollarSign, Calendar, Users, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/stats/stats-card";

const iconMap = {
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
};

export function OverviewStatsGrid({ overviewStats }: { overviewStats: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {overviewStats.map((stat, index) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] || DollarSign;
        return (
          <StatsCard
            key={index}
            title={stat.title}
            count={stat.count}
            variant={stat.variant}
            icon={Icon}
            trend={stat.trend}
            change={stat.change}
          />
        );
      })}
    </div>
  );
}
