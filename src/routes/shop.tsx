import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, LogOut, Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/Brand";
import { CATALOG, inr, useCart, useSession, type Product } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Scan & shop — SwiftCart aisle scanner" },
      { name: "description", content: "Scan barcodes or search the aisle catalogue to build your SwiftCart basket while you shop." },
      { property: "og:title", content: "Scan & shop with SwiftCart" },
      { property: "og:description", content: "Add items to your basket by scanning barcodes as you walk the aisles." },
    ],
  }),
  component: Shop,
});

export function ShopHeader() {
  const { count } = useCart();
  const { session, signOut } = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link to="/shop">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{session?.email ?? "Guest shopper"}</span>
          <Link
            to="/cart"
            className="relative rounded-lg border border-border p-2 transition-colors hover:bg-accent"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gradient px-1 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="rounded-lg border border-border p-2 transition-colors hover:bg-accent"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Shop() {
  const { add } = useCart();
  const [barcode, setBarcode] = useState("");
  const [query, setQuery] = useState("");

  const addItem = (p: Product) => {
    add(p);
    toast.success(`${p.name} added`, { description: inr(p.price) });
  };

  const scan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = CATALOG.find((p) => p.barcode === barcode.trim());
    if (!found) {
      toast.error("Barcode not recognised", { description: "Try 8901030 – 8901041" });
      return;
    }
    addItem(found);
    setBarcode("");
  };

  const filtered = CATALOG.filter((p) => (p.name + p.category).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-hero pb-20">
      <ShopHeader />
      <main className="mx-auto max-w-5xl px-5 py-8">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h1 className="text-lg font-bold text-foreground">Scan an item</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Point your camera at a barcode, or type the number printed under it.
          </p>
          <form onSubmit={scan} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 8901030"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => addItem(CATALOG[Math.floor(Math.random() * CATALOG.length)])}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Camera className="h-4 w-4" /> Camera scan
            </button>
          </form>
        </section>

        <div className="mt-8 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the aisle"
              className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="text-3xl">{p.emoji}</span>
              <h2 className="mt-3 font-semibold text-foreground">{p.name}</h2>
              <p className="text-xs text-muted-foreground">
                {p.category} · {p.barcode}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{inr(p.price)}</span>
                <button
                  onClick={() => addItem(p)}
                  className="rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Add
                </button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">No items match that search.</p>}
        </section>
      </main>
    </div>
  );
}
