import { describe, expect, it } from "vitest";
import { cartTotals, clampQty } from "./cart-math";

const variants = [
  { id: "a", price_cents: 50000, stock: 10, is_available: true },
  { id: "b", price_cents: 90000, stock: 2, is_available: true },
  { id: "c", price_cents: 10000, stock: 5, is_available: false },
];

describe("cart totals", () => {
  it("adds line totals and the delivery fee", () => {
    const t = cartTotals([{ variantId: "a", quantity: 2 }, { variantId: "b", quantity: 1 }], variants, 20000);
    expect(t).toEqual({ subtotal: 190000, delivery: 20000, total: 210000 });
  });
  it("ignores unavailable products", () => {
    expect(cartTotals([{ variantId: "c", quantity: 3 }], variants, 0).subtotal).toBe(0);
  });
  it("never lets quantity exceed stock", () => {
    expect(clampQty(5, 2)).toBe(2);
    expect(clampQty(0, 2)).toBe(1);
  });
});
