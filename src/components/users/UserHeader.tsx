import { Plus } from "lucide-react";
import Link from "next/link";

type UsersHeaderProps = {
  onAddUser?: () => void;
};

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor your users
        </p>
      </div>
      <Link
        href="/dashboard/users/new"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        <Plus className="h-4 w-4" />
        Add User
      </Link>
    </div>
  );
}
