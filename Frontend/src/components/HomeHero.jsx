import { Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function HomeHero() {
  const { user, isAuthenticated } = useAuth();
  const name = isAuthenticated ? user?.fullname || user?.username : "there";

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
          <Sparkles size={14} className="text-accent" />
          Your creative feed
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Welcome back, {name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Explore fresh uploads from creators you follow — curated for discovery,
          not endless scrolling.
        </p>
      </div>
    </section>
  );
}
