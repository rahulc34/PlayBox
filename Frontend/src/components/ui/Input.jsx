import { cn } from "../../lib/cn";

export default function Input({
  type = "text",
  name,
  value,
  setValue,
  placeholder,
  label,
  className,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground capitalize"
      >
        {label ?? name}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required
        className={cn(
          "w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30",
          className
        )}
        {...props}
      />
    </div>
  );
}
