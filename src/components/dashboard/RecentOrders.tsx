"use client";

import Link from "next/link";
import { useRecentOrders } from "./hooks/useRecentOrders";

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600",
  },
} as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function RecentOrders() {
  const { data, isLoading, isError } = useRecentOrders(8);

  const orders = data?.data ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Orders</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
            Recent orders
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest orders across the platform.
          </p>
        </div>

        <Link
          href="/dashboard/orders"
          className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-sm text-red-500">
          Failed to load recent orders.
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center p-6 text-sm text-slate-400">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Order
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Customer
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Amount
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const status = statusConfig[order.status];

                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {order.user.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {order.user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {formatAmount(order.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
