"use client";

import { LogOut, Menu, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";

type HeaderProps = {
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "USER";
  onMenuClick?: () => void;
};

export function Header({ name, email, role, onMenuClick }: HeaderProps) {
  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm font-semibold text-slate-900">Dashboard</p>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{name}</p>

          <p className="text-xs text-slate-500">{email}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          {initials}
        </div>

        <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:inline-flex">
          {role}
        </span>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
