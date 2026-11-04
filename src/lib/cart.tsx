import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  variantId: string;
  slug: string;
  name: string;
  label: string;
  image: string | null;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "antpeanut-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      add: (item) =>
        setItems((cur) => {
          const ex = cur.find((i) => i.variantId === item.variantId);
          if (ex)
            return cur.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: Math.min(50, i.quantity + item.quantity) }
                : i,
            );
          return [...cur, item];
        }),
      setQty: (id, qty) =>
        setItems((cur) =>
          cur.map((i) =>
            i.variantId === id ? { ...i, quantity: Math.max(1, Math.min(50, qty)) } : i,
          ),
        ),
      remove: (id) => setItems((cur) => cur.filter((i) => i.variantId !== id)),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
