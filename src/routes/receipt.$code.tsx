import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock } from "lucide-react";
import { ShopHeader } from "@/routes/shop";
import { inr, useReceipts } from "@/lib/store";

export const Route = createFileRoute("/receipt/$code")({
  head: () => ({
    meta: [
      { title: "Exit QR receipt — SwiftCart" },
      { name: "description", content: "Show this SwiftCart QR receipt at the store exit for a quick guard verification." },
      { property: "og:title", content: "SwiftCart exit QR receipt" },
      { property: "og:description", content: "Your paid basket receipt with an exit QR code, valid for two hours." },
    ],
  }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { code } = Route.useParams();
  const { receipts } = useReceipts();
  const receipt = receipts.find((r) => r.code === code);

  return (
    <div className="min-h-screen bg-hero pb-20">
      <ShopHeader />
      <main className="mx-auto max-w-lg px-5 py-8">
        {!receipt ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
            <p className="text-muted-foreground">Receipt {code} was not found on this device.</p>
            <Link to="/shop" className="mt-5 inline-block font-semibold text-primary hover:underline">
              Back to shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
              <CheckCircle2 className="mx-auto h-10 w-10 text-brand-green" />
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">Payment successful</h1>
              <p className="mt-1 text-sm text-muted-foreground">Show this code at the exit gate.</p>
              <div className="mt-6 inline-flex rounded-2xl border border-border bg-background p-5">
                <QRCodeSVG value={receipt.code} size={188} level="M" />
              </div>
              <p className="mt-4 font-mono text-lg font-bold tracking-widest text-foreground">{receipt.code}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Valid until{" "}
                {new Date(receipt.createdAt + 2 * 60 * 60 * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {receipt.verifiedAt && (
                <p className="mt-3 rounded-lg bg-brand-green/10 py-2 text-sm font-semibold text-brand-green">
                  Verified at the exit
                </p>
              )}
            </div>

            <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold text-foreground">Items</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {receipt.lines.map((l) => (
                  <li key={l.name} className="flex justify-between text-muted-foreground">
                    <span>
                      {l.name} × {l.qty}
                    </span>
                    <span>{inr(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold text-foreground">
                <span>Paid via {receipt.method}</span>
                <span>{inr(receipt.total)}</span>
              </div>
            </section>

            <Link
              to="/shop"
              className="mt-6 block rounded-lg border border-border bg-card py-3 text-center font-semibold text-foreground"
            >
              Start a new basket
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
