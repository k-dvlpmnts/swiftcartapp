import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, LogOut, QrCode, ShieldCheck, TrendingUp, XCircle } from "lucide-react";
import { Wordmark } from "@/components/Brand";
import { inr, useReceipts, useSession } from "@/lib/store";

export const Route = createFileRoute("/staff-dashboard")({
  head: () => ({
    meta: [
      { title: "Exit verification & store overview — SwiftCart staff" },
      {
        name: "description",
        content:
          "Verify shopper exit QR receipts and review paid baskets, revenue and verification status in real time.",
      },
      { property: "og:title", content: "SwiftCart staff dashboard" },
      { property: "og:description", content: "Verify exit receipts and monitor store sales from one screen." },
    ],
  }),
  component: Dashboard,
});

type Result = { status: "valid" | "invalid" | "expired"; code: string; total?: number | undefined } | null;

function Dashboard() {
  const { session, signOut } = useSession();
  const { receipts, verify } = useReceipts();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result>(null);

  const revenue = receipts.reduce((s, r) => s + r.total, 0);
  const verified = receipts.filter((r) => r.verifiedAt).length;

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const outcome = verify(code);
    setResult({ status: outcome.status, code: code.toUpperCase(), total: outcome.receipt?.total });
    setCode("");
  };

  return (
    <div className="min-h-screen bg-hero pb-20">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link to="/">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 capitalize text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {session?.role ?? "guard"}
            </span>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              className="rounded-lg border border-border p-2 hover:bg-accent"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Exit verification</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <QrCode className="h-4 w-4 text-primary" /> Scan or enter receipt code
            </h2>
            <form onSubmit={check} className="mt-4 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PP-XXXX-XXXX"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm uppercase outline-none focus:border-primary"
              />
              <button type="submit" className="rounded-lg bg-brand-gradient px-5 text-sm font-semibold text-primary-foreground">
                Verify
              </button>
            </form>

            {result && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                  result.status === "valid" ? "border-brand-green/40 bg-brand-green/10" : "border-destructive/40 bg-destructive/10"
                }`}
              >
                {result.status === "valid" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-green" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {result.status === "valid"
                      ? "Verified — let the shopper through"
                      : result.status === "expired"
                        ? "Receipt expired"
                        : "No matching receipt"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.code}
                    {result.total ? ` · ${inr(result.total)}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
              <div>
                <p className="text-xl font-bold text-foreground">{receipts.length}</p>
                <p className="text-xs text-muted-foreground">Receipts</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{verified}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div>
                <p className="inline-flex items-center gap-1 text-xl font-bold text-foreground">
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                  {inr(revenue)}
                </p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold text-foreground">Recent baskets</h2>
            {receipts.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No paid baskets yet today.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {receipts.slice(0, 8).map((r) => (
                  <li key={r.code} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{r.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.lines.length} items · {r.method} ·{" "}
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{inr(r.total)}</p>
                      <p className={`text-xs ${r.verifiedAt ? "text-brand-green" : "text-muted-foreground"}`}>
                        {r.verifiedAt ? "Verified" : "Awaiting exit"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
