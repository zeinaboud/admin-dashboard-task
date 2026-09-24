export default function UserOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
