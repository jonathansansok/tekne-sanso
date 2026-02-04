import { cn } from "../lib/cn"

export function Page(p: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-slate-50 text-slate-900", p.className)}>
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{p.title}</h1>
        </header>
        <main className="space-y-6">{p.children}</main>
      </div>
    </div>
  )
}
