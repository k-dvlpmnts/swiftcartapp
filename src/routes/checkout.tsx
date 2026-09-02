import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { ShopHeader } from "@/routes/shop";
import { inr, TAX_RATE, useCart, useReceipts } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — pay for your SwiftCart basket" },
      { name: "description", content: "Pay for your scanned basket with UPI, wallet or card and get an exit QR receipt instantly." },
      { property: "og:title", content: "SwiftCart checkout" },
      { property: "og:description", content: "One-tap payment with UPI, wallet or card, then walk out with a QR receipt." },
    ],
  }),
  component: Checkout,
});

const METHODS = [
  { id: "UPI", label: "UPI", hint: "Pay via any UPI app", icon: Smartphone },
  { id: "Wallet", label: "Wallet", hint: "SwiftCart balance", icon: Wallet },
  { id: "Card", label: "Card", hint: "Credit or debit", icon: CreditCard },
];

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { create } = useReceipts();
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");
  const [paying, setPaying] = useState(false);

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const pay = () => {
    if (lines.length === 0) return;
    setPaying(true);
    setTimeout(() => {
      const receipt = create(lines, total, method);
      clear();
      navigate({ to: "/receipt/$code", params: { code: receipt.code } });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-hero pb-20">
      <ShopHeader />
      <main className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Checkout</h1>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">Payment method</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {METHODS.map(({ id, label, hint, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  method === id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                }`}
              >
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-2 font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between text-muted-foreground">
                <span>
                  {product.name} × {qty}
                </span>
                <span>{inr(product.price * qty)}</span>
              </li>
            ))}
            {lines.length === 0 && <li className="text-muted-foreground">Your basket is empty.</li>}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold text-foreground">
            <span>Total</span>
            <span>{inr(total)}</span>
          </div>
          <button
            onClick={pay}
            disabled={paying || lines.length === 0}
            className="mt-5 w-full rounded-lg bg-brand-gradient py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {paying ? "Processing…" : `Pay ${inr(total)} with ${method}`}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Your QR receipt is generated instantly and stays valid for 2 hours.
          </p>
        </section>
      </main>
    </div>
  );
}
