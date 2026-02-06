import { cn } from "../lib/cn";

export function Page(p: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-slate-50 text-slate-900", p.className)}>
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
          <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                {p.title}
              </h1>
              <div className="text-sm text-slate-500">
                Tekne Policies • traceable uploads • AI insights
              </div>
            </div>

            <div className="hidden md:flex items-center">
              <div className="px-3 h-10 inline-flex items-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-soft">
                J. Sansó
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="px-5 py-3 text-xs text-slate-500 leading-relaxed">
            Correlation-ready UI • consistent errors • clean pagination
          </div>
        </header>

        <main className="space-y-6">{p.children}</main>
      </div>
    </div>
  );
}
