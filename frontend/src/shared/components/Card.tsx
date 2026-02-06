import { cn } from "../lib/cn"

export function Card(p: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-slate-200 shadow-soft",
        "transition-shadow hover:shadow-glow",
        p.className,
      )}
    >
      {p.children}
    </div>
  )
}

export function CardBody(p: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5 md:p-6", p.className)}>{p.children}</div>
}
