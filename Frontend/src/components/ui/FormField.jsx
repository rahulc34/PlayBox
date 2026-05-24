import { cn } from "../../lib/cn";

export function FormLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium text-foreground"
    >
      {children}
    </label>
  );
}

export function FormInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30",
        className
      )}
      {...props}
    />
  );
}

export function FormTextarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30",
        className
      )}
      {...props}
    />
  );
}

export function FormFileInput({ className, ...props }) {
  return (
    <input
      type="file"
      className={cn(
        "w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary",
        className
      )}
      {...props}
    />
  );
}

export function VisibilityToggle({ value, onChange }) {
  return (
    <div className="flex gap-4">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <input
          type="radio"
          checked={value === "private"}
          onChange={() => onChange("private")}
          className="accent-primary"
        />
        Private
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <input
          type="radio"
          checked={value === "public"}
          onChange={() => onChange("public")}
          className="accent-primary"
        />
        Public
      </label>
    </div>
  );
}

export function ModalStatus({ loading, success, error, loadingText, successText }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">{loadingText || "Please wait…"}</p>
      </div>
    );
  }
  if (success) {
    return (
      <div className="py-6 text-center">
        <p className="font-semibold text-foreground">{successText}</p>
      </div>
    );
  }
  if (error) {
    return (
      <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-500">{error}</p>
    );
  }
  return null;
}
