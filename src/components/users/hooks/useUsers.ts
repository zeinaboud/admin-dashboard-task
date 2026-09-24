import { SortField, UsersResponse } from "@/types/userTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type UseUsersParams = {
  search: string;
  status: string;
  role: string;
  department: string;
  page: number;
  limit?: number;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
};

async function fetchUsers(params: UseUsersParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.department.trim()) {
    searchParams.set("department", params.department.trim());
  }

  searchParams.set("page", String(params.page));

  searchParams.set("limit", String(params.limit ?? 10));

  searchParams.set("sortBy", params.sortBy);

  searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/users?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export function useUsers(params: UseUsersParams) {
  return useQuery({
    queryKey: [
      "users",
      {
        search: params.search.trim(),
        status: params.status,
        role: params.role,
        department: params.department.trim(),
        page: params.page,
        limit: params.limit ?? 5,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    ],

    queryFn: () => fetchUsers(params),

    placeholderData: keepPreviousData,

    staleTime: 30_000,
  });
}
