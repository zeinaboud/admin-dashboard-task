export default function ProfileLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
      <div className="space-y-2">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        <div className="h-9 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 animate-pulse bg-slate-200" />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex items-end gap-4">
            <div className="h-24 w-24 shrink-0 animate-pulse rounded-2xl border-4 border-white bg-slate-200 shadow-md" />
            <div className="mb-1 space-y-2">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-52 max-w-[60vw] animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}