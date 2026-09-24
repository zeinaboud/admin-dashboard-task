export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type UserRole = "ADMIN" | "USER";

export type SortField =
  | "name"
  | "email"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "role";

export type SortOrder = "asc" | "desc";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    activities: number;
  };
};

export type UsersStats = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
};

export type UsersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UsersResponse = {
  data: User[];
  pagination: UsersPagination;
  stats: UsersStats;
};
