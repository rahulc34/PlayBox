import { cn } from "../lib/cn";

export default function UserAvatar({
  src,
  name,
  size = "md",
  className,
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-20 w-20 text-xl",
    "2xl": "h-24 w-24 text-2xl",
  };

  const initial = (name || "?")[0].toUpperCase();

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-bold text-primary">
          {initial}
        </span>
      )}
    </div>
  );
}
