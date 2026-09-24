import { useQuery } from "@tanstack/react-query";

type UserStatusData = {
  ACTIVE: number;
  PENDING: number;
  INACTIVE: number;
};

type UserStatusResponse = {
  data: UserStatusData;
};

async function fetchUserStatus(): Promise<UserStatusResponse> {
  const response = await fetch("/api/dashboard/user-status");

  if (!response.ok) {
    throw new Error("Failed to fetch user status");
  }

  return response.json();
}

export function useUserStatus() {
  return useQuery({
    queryKey: ["dashboard", "user-status"],

    queryFn: fetchUserStatus,

    staleTime: 30_000,
  });
}
