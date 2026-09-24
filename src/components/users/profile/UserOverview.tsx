"use client";

import {
  CalendarDays,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  useUserOverview,
  type UserOverview as UserOverviewData,
} from "../hooks/useUserOverview";

import { useDetailUser } from "../hooks/useDetailUser";

import UserOverviewSkeleton from "./UserOverviewSkeleton";

type UserOverviewProps = {
  userId?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: string | number) {
  return `$${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function OrderStatusBadge({
  status,
}: {
  status: UserOverviewData["user"]["orders"][number]["status"];
}) {
  const styles = {
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
  };

  const labels = {
    COMPLETED: "Completed",
    PENDING: "Pending",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function UserOverview({ userId }: UserOverviewProps) {
  const query = userId ? useDetailUser(userId) : useUserOverview();

  const { data, isPending, isError, refetch } = query;

  if (isPending) {
    return <UserOverviewSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-medium text-red-700">Failed to load user.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm ring-1 ring-inset ring-red-200 transition hover:bg-red-50"
        >
          Try again
        </button>
      </div>
    );
  }

  const { user, stats, orderBreakdown } = data.data;

  const chartData = [
    {
      name: "Completed",
      value: orderBreakdown.COMPLETED,
    },
    {
      name: "Pending",
      value: orderBreakdown.PENDING,
    },
    {
      name: "Cancelled",
      value: orderBreakdown.CANCELLED,
    },
  ];

  const hasOrders = stats.totalOrders > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          {userId ? "Users" : "Account"}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {userId ? "User details" : "Profile"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {userId
            ? "User account overview and recent activity."
            : "Your account overview and recent activity."}
        </p>
      </div>

      {/* Profile Hero */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 text-2xl font-bold text-slate-700 shadow-md">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {user.name}
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">{user.email}</p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{user.department || "No department"}</span>

                  <span className="text-slate-300">•</span>

                  <span>
                    {user.role === "ADMIN" ? "Administrator" : "User"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 sm:pb-2">
              <CalendarDays className="h-4 w-4" />

              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Overview + Personal Information */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Orders Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Orders overview</h2>

            <p className="mt-1 text-sm text-slate-500">
              Breakdown of {userId ? "this user's" : "your"} orders by status.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <div className="relative h-52 w-52 shrink-0">
              {hasOrders ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#ef4444" />
                      </Pie>

                      <Tooltip formatter={(value) => [value, "Orders"]} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">
                      {stats.totalOrders}
                    </span>

                    <span className="text-xs text-slate-500">Orders</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center rounded-full border-[18px] border-slate-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-400">0</p>

                    <p className="text-xs text-slate-400">Orders</p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full max-w-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm text-slate-600">Completed</span>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {orderBreakdown.COMPLETED}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />

                  <span className="text-sm text-slate-600">Pending</span>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {orderBreakdown.PENDING}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                  <span className="text-sm text-slate-600">Cancelled</span>
                </div>

                <span className="text-sm font-semibold text-slate-900">
                  {orderBreakdown.CANCELLED}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Personal information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {userId ? "User account details." : "Your account details."}
            </p>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            <div className="flex items-center gap-4 py-4 first:pt-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <UserRound className="h-4 w-4 text-slate-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Full name</p>

                <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Mail className="h-4 w-4 text-slate-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Email</p>

                <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Phone className="h-4 w-4 text-slate-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Phone</p>

                <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <ShieldCheck className="h-4 w-4 text-slate-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Role</p>

                <p className="mt-0.5 text-sm font-medium text-slate-900">
                  {user.role === "ADMIN" ? "Administrator" : "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">Recent orders</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {userId
                    ? "This user's latest orders."
                    : "Your latest orders."}
                </p>
              </div>

              <Package className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          {user.orders.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {user.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <OrderStatusBadge status={order.status} />

                    <span className="text-sm font-semibold text-slate-900">
                      {formatAmount(order.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Package className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-900">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Recent orders will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserOverview;
