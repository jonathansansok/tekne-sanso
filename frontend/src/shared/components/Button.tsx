import { cn } from "../lib/cn"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
  loading?: boolean
}

export function Button({ className, variant = "primary", loading, disabled, ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 h-10 text-sm font-medium transition border"
  const styles =
    variant === "primary"
      ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
      : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(base, styles, (disabled || loading) && "opacity-60 cursor-not-allowed", className)}
    >
      {loading ? "Loading..." : rest.children}
    </button>
  )
}
