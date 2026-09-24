export function UsersTableSkeleton() {
  const rows = Array.from({ length: 7 });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-12 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="px-4 py-3">
                <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
              </th>

              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-4">
                  <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
