"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  LayoutDashboard,
  Lock,
  UserCircle,
  Users,
} from "lucide-react";

type UserRole = "ADMIN" | "USER";

type SidebarProps = {
  role: UserRole;
  mobile?: boolean;
  onNavigate?: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    roles: ["ADMIN", "USER"],
  },
] as const;

export function Sidebar({ role, mobile = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const items = navigation.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-72 shrink-0 flex-col bg-white"
          : "hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col"
      }
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Almahy</p>

            <p className="text-xs text-slate-500">Admin Portal</p>
          </div>
        </Link>

        {!mobile && (
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;

            const isUsersDisabled = item.label === "Users" && role === "USER";

            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            if (isUsersDisabled) {
              return (
                <div
                  key={item.href}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px]" />

                    <span>{item.label}</span>
                  </div>

                  <Lock className="h-3.5 w-3.5" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-900">System status</p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs text-slate-500">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
