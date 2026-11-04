export type CartLine = { variantId: string; quantity: number };
export type PricedVariant = {
  id: string;
  price_cents: number;
  stock: number;
  is_available: boolean;
};

/** Display-only totals. The database recalculates the real total when the order is placed. */
export function cartTotals(lines: CartLine[], variants: PricedVariant[], deliveryFeeCents: number) {
  const byId = new Map(variants.map((v) => [v.id, v]));
  let subtotal = 0;
  for (const l of lines) {
    const v = byId.get(l.variantId);
    if (v && v.is_available) subtotal += v.price_cents * l.quantity;
  }
  return { subtotal, delivery: deliveryFeeCents, total: subtotal + deliveryFeeCents };
}

export function clampQty(q: number, stock: number) {
  return Math.max(1, Math.min(Math.floor(q) || 1, Math.max(1, Math.min(stock, 50))));
}
