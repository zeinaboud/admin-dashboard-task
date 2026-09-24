"use client";

import { useState } from "react";
import { useUserGrowth } from "./hooks/useUserGrowth";
import { UserGrowthChart } from "./UserGrowthChart";

type UserGrowthRange = "7d" | "30d" | "this-year";

const ranges: Array<{
  label: string;
  value: UserGrowthRange;
}> = [
  {
    label: "Last 7 days",
    value: "7d",
  },
  {
    label: "Last 30 days",
    value: "30d",
  },
  {
    label: "This year",
    value: "this-year",
  },
];

export function UserGrowthSection() {
  const [range, setRange] = useState<UserGrowthRange>("30d");

  const { data, isLoading, isError } = useUserGrowth(range);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">User Growth</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
            New users over time
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Track how many users joined the platform.
          </p>
        </div>

        <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
          {ranges.map((item) => {
            const isActive = range === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setRange(item.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:flex-none ${
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex h-[340px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          </div>
        ) : isError ? (
          <div className="flex h-[340px] items-center justify-center text-sm text-red-500">
            Failed to load user growth data.
          </div>
        ) : (
          <UserGrowthChart data={data?.data ?? []} />
        )}
      </div>
    </section>
  );
}
