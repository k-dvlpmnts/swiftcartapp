import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      <rect x="14" y="2" width="22" height="14" rx="2" className="fill-primary/10" />
      {[16, 19, 21, 24, 27, 29, 32].map((x, i) => (
        <rect key={x} x={x} y="4" width={i % 3 === 0 ? 2 : 1} height="10" className="fill-primary" />
      ))}
      <path
        d="M4 8h5l5 17h20l4-11"
        className="stroke-brand-green"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="17" cy="33" r="3" className="fill-primary" />
      <circle cx="31" cy="33" r="3" className="fill-primary" />
    </svg>
  );
}

export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${size === "lg" ? "text-3xl" : "text-xl"}`}>
      <Logo className={size === "lg" ? "h-9 w-11" : "h-7 w-8"} />
      <span className="text-foreground">
        Swift<span className="text-primary">Cart</span>
      </span>
    </span>
  );
}

export function Tagline() {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
      Scan · Pay · Walkaway
    </p>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-hero px-4 py-16">
      <Link to="/" className="flex flex-col items-center gap-3">
        <Wordmark size="lg" />
        <Tagline />
      </Link>
      <div className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft">{children}</div>
    </main>
  );
}
