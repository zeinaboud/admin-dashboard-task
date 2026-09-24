import { useQuery } from "@tanstack/react-query";

export type UserOverview = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    department: string | null;
    createdAt: string;
    orders: {
      id: string;
      amount: string;
      status: "PENDING" | "COMPLETED" | "CANCELLED";
      createdAt: string;
    }[];
    activities: {
      id: string;
      action: string;
      description: string;
      createdAt: string;
    }[];
  };

  stats: {
    totalOrders: number;
    monthlyOrders: number;
    totalSpent: string | number;
  };

  orderBreakdown: {
    COMPLETED: number;
    PENDING: number;
    CANCELLED: number;
  };
};

async function fetchUserOverview(): Promise<{
  data: UserOverview;
}> {
  const response = await fetch("/api/profile");

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export function useUserOverview() {
  return useQuery({
    queryKey: ["user-overview"],
    queryFn: fetchUserOverview,
    staleTime: 30_000,
  });
}
