import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25",
  secondary:
    "bg-card text-foreground border border-border hover:bg-muted",
  ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/15",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  text,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children ?? text}
    </button>
  );
}
