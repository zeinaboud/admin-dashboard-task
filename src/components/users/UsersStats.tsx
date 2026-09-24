import { Users, UserCheck, UserPlus, UserX } from "lucide-react";

type UsersStatsProps = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
};
type StatCardProps = {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
};
export function UsersStats({
  total,
  active,
  pending,
  inactive,
}: UsersStatsProps) {
  const stats = [
    {
      key: "total",
      label: "Total Users",
      value: total,
      description: "All registered users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      key: "active",
      label: "Active",
      value: active,
      description: "Currently active users",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      key: "pending",
      label: "Pending",
      value: pending,
      description: "Users awaiting activation",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      key: "inactive",
      label: "Inactive",
      value: inactive,
      description: "Currently inactive users",
      icon: <UserX className="h-5 w-5" />,
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

export function StatCard({ label, value, description, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </div>
  );
}
