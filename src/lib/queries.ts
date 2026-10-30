import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getCatalog, getSettings } from "./catalog.functions";

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 30_000,
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => getSettings(),
  staleTime: 60_000,
});

export type Catalog = Awaited<ReturnType<typeof getCatalog>>;
export type Product = Catalog["products"][number];
export type Variant = Product["variants"][number];
export type Settings = Awaited<ReturnType<typeof getSettings>>;

export function useCatalog() {
  return useSuspenseQuery(catalogQuery).data;
}
export function useSettings() {
  return useSuspenseQuery(settingsQuery).data;
}

export function formatMoney(cents: number, currency = "KES") {
  try {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
}
