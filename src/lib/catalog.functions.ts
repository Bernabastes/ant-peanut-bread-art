import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const productSelect =
  "id, name, slug, short_description, description, texture, ingredients, allergens, storage_instructions, image_url, is_featured, sort_order, category:categories(id, name, slug), variants:product_variants(id, label, price_cents, stock, is_available, sort_order)";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: products, error }, { data: categories }] = await Promise.all([
    sb.from("products").select(productSelect).eq("is_published", true).order("sort_order"),
    sb.from("categories").select("id, name, slug").order("sort_order"),
  ]);
  if (error) throw new Error(error.message);
  return {
    products: (products ?? []).map((p) => ({
      ...p,
      variants: [...(p.variants ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    })),
    categories: categories ?? [],
  };
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb.from("settings").select("*").eq("id", 1).single();
  if (error) throw new Error(error.message);
  return data;
});
