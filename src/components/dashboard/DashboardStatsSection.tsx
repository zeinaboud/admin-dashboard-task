"use client";

import { useDashboardStats } from "./hooks/useDashboardStats";
import { DashboardStats } from "./DashboardStats";

export function DashboardStatsSection() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                {/* label */}
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                {/* value */}
                <div className="mt-3 h-8 w-28 animate-pulse rounded bg-slate-200" />
              </div>

              {/* icon */}
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
            </div>

            {/* change */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />

              <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[142px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-red-500 shadow-sm">
        Failed to load dashboard stats.
      </div>
    );
  }

  const stats = data.data;

  return (
    <DashboardStats
      stats={{
        totalUsers: {
          label: "Total Users",
          value: stats.totalUsers,
          change: 0,
        },

        activeUsers: {
          label: "Active Users",
          value: stats.activeUsers,
          change: 0,
        },

        totalOrders: {
          label: "Total Orders",
          value: stats.totalOrders,
          change: 0,
        },

        revenue: {
          label: "Revenue",
          value: stats.revenue,
          change: 0,
          prefix: "$",
        },
      }}
    />
  );
}
