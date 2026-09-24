import { useQuery } from "@tanstack/react-query";

type UserDetailsResponse = {
  data: {
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
        amount: number | string;
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
      totalSpent: number | string;
    };

    orderBreakdown: {
      COMPLETED: number;
      PENDING: number;
      CANCELLED: number;
    };
  };
};

async function fetchDetailUser(id: string): Promise<UserDetailsResponse> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export function useDetailUser(id: string) {
  return useQuery({
    queryKey: ["user", "detail", id],
    queryFn: () => fetchDetailUser(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
