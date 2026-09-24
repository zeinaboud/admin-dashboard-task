import { Search, SlidersHorizontal } from "lucide-react";

type UsersToolbarProps = {
  search: string;
  status: string;
  role: string;
  department: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
};

export function UsersToolbar({
  search,
  status,
  role,
  department,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onDepartmentChange,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search users..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {/* Role */}
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>

        {/* Department */}
        <input
          type="text"
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          placeholder="Department"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />

        {/* Filters */}
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  );
}
