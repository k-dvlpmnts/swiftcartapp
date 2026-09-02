import { useCallback, useEffect, useState } from "react";

export type Product = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
};

export type CartLine = { product: Product; qty: number };

export type Receipt = {
  code: string;
  createdAt: number;
  lines: { name: string; qty: number; price: number }[];
  total: number;
  method: string;
  verifiedAt: number | null;
};

export type Session = { email: string; role: "customer" | "admin" | "guard" | "employee" };

export const CATALOG: Product[] = [
  { id: "p1", barcode: "8901030", name: "Cold Brew Coffee 250ml", category: "Beverages", price: 149, emoji: "🥤" },
  { id: "p2", barcode: "8901031", name: "Sourdough Loaf", category: "Bakery", price: 220, emoji: "🍞" },
  { id: "p3", barcode: "8901032", name: "Farm Eggs (12)", category: "Dairy", price: 189, emoji: "🥚" },
  { id: "p4", barcode: "8901033", name: "Almond Butter 400g", category: "Pantry", price: 549, emoji: "🥜" },
  { id: "p5", barcode: "8901034", name: "Bananas 1kg", category: "Produce", price: 79, emoji: "🍌" },
  { id: "p6", barcode: "8901035", name: "Greek Yoghurt 500g", category: "Dairy", price: 165, emoji: "🥛" },
  { id: "p7", barcode: "8901036", name: "Dark Chocolate 80%", category: "Snacks", price: 320, emoji: "🍫" },
  { id: "p8", barcode: "8901037", name: "Sparkling Water 6-pack", category: "Beverages", price: 299, emoji: "💧" },
  { id: "p9", barcode: "8901038", name: "Olive Oil 750ml", category: "Pantry", price: 890, emoji: "🫒" },
  { id: "p10", barcode: "8901039", name: "Avocado (2)", category: "Produce", price: 210, emoji: "🥑" },
  { id: "p11", barcode: "8901040", name: "Salted Chips 150g", category: "Snacks", price: 99, emoji: "🥔" },
  { id: "p12", barcode: "8901041", name: "Cheddar Block 200g", category: "Dairy", price: 410, emoji: "🧀" },
];

const KEYS = {
  session: "prodpay.session",
  cart: "prodpay.cart",
  receipts: "prodpay.receipts",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("prodpay:change", { detail: key }));
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    const onChange = () => setValue(read<T>(key, fallback));
    window.addEventListener("prodpay:change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("prodpay:change", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T) => {
      write(key, next);
      setValue(next);
    },
    [key],
  );

  return [value, set] as const;
}

export function useSession() {
  const [session, setSession] = useStored<Session | null>(KEYS.session, null);
  const signIn = (email: string, role: Session["role"]) => setSession({ email, role });
  const signOut = () => setSession(null);
  return { session, signIn, signOut };
}

export function useCart() {
  const [lines, setLines] = useStored<CartLine[]>(KEYS.cart, []);

  const add = (product: Product) => {
    const existing = lines.find((l) => l.product.id === product.id);
    setLines(
      existing
        ? lines.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l))
        : [...lines, { product, qty: 1 }],
    );
  };
  const setQty = (id: string, qty: number) =>
    setLines(qty <= 0 ? lines.filter((l) => l.product.id !== id) : lines.map((l) => (l.product.id === id ? { ...l, qty } : l)));
  const clear = () => setLines([]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  return { lines, add, setQty, clear, count, subtotal };
}

export function useReceipts() {
  const [receipts, setReceipts] = useStored<Receipt[]>(KEYS.receipts, []);

  const create = (lines: CartLine[], total: number, method: string) => {
    const code = `PP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const receipt: Receipt = {
      code,
      createdAt: Date.now(),
      lines: lines.map((l) => ({ name: l.product.name, qty: l.qty, price: l.product.price })),
      total,
      method,
      verifiedAt: null,
    };
    setReceipts([receipt, ...receipts]);
    return receipt;
  };

  const verify = (code: string) => {
    const found = receipts.find((r) => r.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { status: "invalid" as const, receipt: null };
    const expired = Date.now() - found.createdAt > 2 * 60 * 60 * 1000;
    if (expired) return { status: "expired" as const, receipt: found };
    setReceipts(receipts.map((r) => (r.code === found.code ? { ...r, verifiedAt: Date.now() } : r)));
    return { status: "valid" as const, receipt: found };
  };

  return { receipts, create, verify };
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const TAX_RATE = 0.05;
