import { supabase } from "@/integrations/supabase/client";

export const STATUSES = ["Pending Confirmation", "Confirmed", "Preparing", "Ready for Pickup", "Out for Delivery", "Completed", "Cancelled", "Rejected"] as const;

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*), history:order_status_history(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
export type AdminOrder = Awaited<ReturnType<typeof fetchOrders>>[number];
