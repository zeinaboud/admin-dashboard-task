import { useQuery } from "@tanstack/react-query";

type RecentOrder = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

type RecentOrdersResponse = {
  data: RecentOrder[];
};

async function fetchRecentOrders(limit = 8): Promise<RecentOrdersResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("limit", String(limit));

  const response = await fetch(
    `/api/dashboard/recent-orders?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent orders");
  }

  return response.json();
}

export function useRecentOrders(limit = 8) {
  return useQuery({
    queryKey: [
      "dashboard",
      "recent-orders",
      {
        limit,
      },
    ],

    queryFn: () => fetchRecentOrders(limit),

    staleTime: 30_000,
  });
}
