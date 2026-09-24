import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardStatsSection } from "@/components/dashboard/DashboardStatsSection";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { UserGrowthSection } from "@/components/dashboard/UserGrowthSection";
import { UserStatusSection } from "@/components/dashboard/UserStatusSection";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Platform overview
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor users, orders, revenue, and platform activity.
        </p>
      </div>

      <DashboardStatsSection />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UserGrowthSection />
        </div>

        <div className="xl:col-span-1">
          <UserStatusSection />
        </div>
      </div>
      <RecentOrders />
    </div>
  );
}
