import { cn } from "../lib/cn"

export function Card(p: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl bg-white shadow-sm border border-slate-200", p.className)}>{p.children}</div>
}

export function CardBody(p: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-5", p.className)}>{p.children}</div>
}
