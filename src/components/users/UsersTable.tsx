"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  department: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    orders: number;
    activities: number;
  };
};

export type SortField =
  | "name"
  | "email"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "role";

type UsersTableProps = {
  users: User[];
  sortBy: SortField;
  sortOrder: "asc" | "desc";

  onSort: (field: SortField) => void;
  onUserAction?: (action: string, user: User) => void;
};

function StatusBadge({ status }: { status: User["status"] }) {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    INACTIVE: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  const labels = {
    ACTIVE: "Active",
    PENDING: "Pending",
    INACTIVE: "Inactive",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function RoleBadge({ role }: { role: User["role"] }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/20">
      {role === "ADMIN" ? "Admin" : "User"}
    </span>
  );
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: SortField;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
}) {
  if (field !== sortBy) {
    return null;
  }

  return sortOrder === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
}

export function UsersTable({
  users,
  sortBy,
  sortOrder,
  onSort,
  onUserAction,
}: UsersTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort("name")}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  User
                  <SortIcon
                    field="name"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>

              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort("email")}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Email
                  <SortIcon
                    field="email"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>

              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort("role")}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Role
                  <SortIcon
                    field="role"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>

              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort("status")}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Status
                  <SortIcon
                    field="status"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>

              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort("createdAt")}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Created
                  <SortIcon
                    field="createdAt"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </th>

              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>

                    {user.phone && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {user.phone}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {user.email}
                </td>

                <td className="px-4 py-4">
                  <RoleBadge role={user.role} />
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={user.status} />
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {user.department || "—"}
                </td>

                <td className="px-4 py-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId((current) =>
                          current === user.id ? null : user.id,
                        )
                      }
                      aria-label={`Actions for ${user.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === user.id && (
                      <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onUserAction?.("delete", user);
                          }}
                          disabled={user.role === "ADMIN"}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>

                        <Link
                          href={`/dashboard/users/${user.id}`}
                          onClick={() => setOpenMenuId(null)}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                          View details
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    No users found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try adjusting your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
