import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ShopHeader } from "@/routes/shop";
import { inr, TAX_RATE, useCart } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your basket — SwiftCart" },
      { name: "description", content: "Review the items you scanned, adjust quantities and see your SwiftCart total before paying." },
      { property: "og:title", content: "Your SwiftCart basket" },
      { property: "og:description", content: "Review scanned items and totals before checking out on your phone." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, subtotal, clear } = useCart();
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-hero pb-20">
      <ShopHeader />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Your basket</h1>

        {lines.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
            <p className="text-muted-foreground">Nothing scanned yet.</p>
            <Link
              to="/shop"
              className="mt-5 inline-block rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Start scanning
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <span className="text-2xl">{product.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{inr(product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="p-2" aria-label="Decrease quantity">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="p-2" aria-label="Increase quantity">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="w-20 text-right font-bold text-foreground">{inr(product.price * qty)}</span>
                  <button onClick={() => setQty(product.id, 0)} className="p-2 text-muted-foreground" aria-label="Remove item">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd>{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>GST (5%)</dt>
                  <dd>{inr(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold text-foreground">
                  <dt>Total</dt>
                  <dd>{inr(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-5 block rounded-lg bg-brand-gradient py-3 text-center font-semibold text-primary-foreground"
              >
                Pay {inr(total)}
              </Link>
              <button onClick={clear} className="mt-3 w-full text-sm text-muted-foreground hover:text-destructive">
                Empty basket
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
