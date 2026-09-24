import { useQuery } from "@tanstack/react-query";

type UserGrowthRange = "7d" | "30d" | "this-year";

type UserGrowthPoint = {
  date: string;
  value: number;
};

type UserGrowthResponse = {
  data: UserGrowthPoint[];
  range: UserGrowthRange;
};

async function fetchUserGrowth(
  range: UserGrowthRange,
): Promise<UserGrowthResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("range", range);

  const response = await fetch(`/api/dashboard?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user growth");
  }

  return response.json();
}

export function useUserGrowth(range: UserGrowthRange) {
  return useQuery({
    queryKey: [
      "dashboard",
      "user-growth",
      {
        range,
      },
    ],

    queryFn: () => fetchUserGrowth(range),

    staleTime: 30_000,
  });
}
