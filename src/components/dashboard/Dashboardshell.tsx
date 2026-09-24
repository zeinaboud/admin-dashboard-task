"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type DashboardShellProps = {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role: "ADMIN" | "USER";
  };
};

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar role={user.role} />

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
            <div className="h-full bg-white shadow-xl">
              <Sidebar role={user.role} mobile onNavigate={closeMobileMenu} />
            </div>
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          name={user.name}
          email={user.email}
          role={user.role}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
