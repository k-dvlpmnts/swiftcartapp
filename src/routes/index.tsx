import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ScanLine, ShieldCheck, Wallet, Zap } from "lucide-react";
import { Tagline, Wordmark } from "@/components/Brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwiftCart — Scan, pay and walk out of the store" },
      {
        name: "description",
        content:
          "SwiftCart turns a shopper's phone into a checkout: scan items while you shop, pay in seconds and leave with a QR receipt verified at the exit.",
      },
      { property: "og:title", content: "SwiftCart — Scan, pay and walk out of the store" },
      {
        property: "og:description",
        content: "Smart self-checkout for modern retail. Scan as you shop, pay in seconds, walk out securely.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: ScanLine,
    title: "Scan as you shop",
    body: "Use your camera or punch in barcodes — items go straight into your cart.",
  },
  { icon: Wallet, title: "Pay in seconds", body: "UPI, Wallet or Card. One tap and your receipt is ready." },
  {
    icon: ShieldCheck,
    title: "Walk out securely",
    body: "Show your QR receipt at the exit. Verified by a guard, you're done.",
  },
];

const STATS = [
  { icon: Zap, value: "0", label: "Queues to wait in" },
  { icon: Clock, value: "<10s", label: "Average checkout" },
  { icon: ShieldCheck, value: "2hr", label: "QR receipt validity" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Wordmark />
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/staff" className="font-medium text-foreground hover:text-primary">
            Staff
          </Link>
          <Link
            to="/auth"
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="pt-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-soft">
            <Zap className="h-3.5 w-3.5 text-primary" /> Smart self-checkout for modern retail
          </span>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
            Skip the queue.
            <br />
            <span className="text-brand-gradient">Scan. Pay. Walkaway.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            SwiftCart turns every shopper's phone into a checkout. Scan items as you shop, pay in seconds, and walk out
            with a QR receipt.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/staff"
              className="rounded-xl border border-border bg-card px-6 py-3.5 font-semibold text-foreground shadow-soft transition-colors hover:bg-accent"
            >
              Staff portal
            </Link>
          </div>
          <div className="mt-12 flex justify-center">
            <Tagline />
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 grid gap-10 border-t border-border pt-14 text-center md:grid-cols-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <Icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 text-4xl font-extrabold text-foreground">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SwiftCart · Scan · Pay · Walkaway
      </footer>
    </div>
  );
}
