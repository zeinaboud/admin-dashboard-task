"use client";

import { useUserStatus } from "./hooks/useUserStatus";
import { UserStatusChart } from "./UserStatusChart";

export function UserStatusSection() {
  const { data, isLoading, isError } = useUserStatus();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-medium text-slate-500">User Status</p>

        <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
          User distribution
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Overview of users by their current status.
        </p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex h-[340px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          </div>
        ) : isError ? (
          <div className="flex h-[340px] items-center justify-center text-sm text-red-500">
            Failed to load user status data.
          </div>
        ) : (
          <UserStatusChart
            data={
              data?.data ?? {
                ACTIVE: 0,
                PENDING: 0,
                INACTIVE: 0,
              }
            }
          />
        )}
      </div>
    </section>
  );
}
