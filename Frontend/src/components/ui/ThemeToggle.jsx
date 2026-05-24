import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../lib/cn";

export default function ThemeToggle({ className }) {
  const { resolved, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {resolved === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
