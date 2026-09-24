import { useQuery } from "@tanstack/react-query";

type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
};

type DashboardStatsResponse = {
  data: DashboardStats;
};

async function fetchDashboardStats(): Promise<DashboardStatsResponse> {
  const response = await fetch("/api/dashboard/stats");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],

    queryFn: fetchDashboardStats,

    staleTime: 30_000,
  });
}
