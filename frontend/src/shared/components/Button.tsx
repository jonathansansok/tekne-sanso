import { cn } from "../lib/cn"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
  loading?: boolean
}

export function Button({ className, variant = "primary", loading, disabled, ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 h-10 text-sm font-medium transition border select-none"
  const primary =
    "text-white border-transparent bg-gradient-to-r from-indigo-600 to-purple-500 hover:opacity-95 shadow-soft"
  const ghost = "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        base,
        variant === "primary" ? primary : ghost,
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        "active:scale-[0.99]",
        className,
      )}
    >
      {loading ? "Loading..." : rest.children}
    </button>
  )
}
