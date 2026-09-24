"use client";

import { useState } from "react";

import { UsersStats } from "@/components/users/UsersStats";
import { UsersToolbar } from "@/components/users/UsersToolbar";
import { UsersTable, type SortField } from "@/components/users/UsersTable";
import { UsersPagination } from "@/components/users/UsersPagination";

import { useUsers } from "./hooks/useUsers";
import { useDeleteUser } from "./hooks/useDeleteUser";
import { UsersHeader } from "./UserHeader";
import { UsersTableSkeleton } from "./UsersTableSkeleton";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState<SortField>("createdAt");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const usersQuery = useUsers({
    search,
    status,
    role,
    department,
    page,
    limit: 5,
    sortBy,
    sortOrder,
  });

  const deleteUserMutation = useDeleteUser();

  const users = usersQuery.data?.data ?? [];

  const stats = usersQuery.data?.stats ?? {
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  };

  const pagination = usersQuery.data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    setPage(1);

    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));

      return;
    }

    setSortBy(field);
    setSortOrder("asc");
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        setUserToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <UsersHeader
        onAddUser={() => {
          window.location.href = "/dashboard/users/new";
        }}
      />

      <UsersStats
        total={stats.total}
        active={stats.active}
        pending={stats.pending}
        inactive={stats.inactive}
      />

      <UsersToolbar
        search={search}
        status={status}
        role={role}
        department={department}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onDepartmentChange={handleDepartmentChange}
      />

      {usersQuery.isPending ? (
        <UsersTableSkeleton />
      ) : usersQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            Failed to load users.
          </p>

          <button
            type="button"
            onClick={() => usersQuery.refetch()}
            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <UsersTable
          users={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onUserAction={(action, user) => {
            if (action === "delete") {
              setUserToDelete({
                id: user.id,
                name: user.name,
              });
            }
          }}
        />
      )}

      {!usersQuery.isPending && !usersQuery.isError && (
        <UsersPagination
          page={page}
          totalPages={totalPages}
          total={pagination?.total ?? 0}
          limit={pagination?.limit ?? 10}
          onPageChange={setPage}
        />
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div>
              <h2
                id="delete-user-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete user?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-900">
                  {userToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {deleteUserMutation.isError && (
              <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteUserMutation.error instanceof Error
                  ? deleteUserMutation.error.message
                  : "Failed to delete user"}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteUserMutation.isPending}
                onClick={() => setUserToDelete(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleteUserMutation.isPending}
                onClick={handleDeleteUser}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
