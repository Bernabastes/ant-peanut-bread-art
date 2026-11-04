import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Settings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });

const fields = [
  ["business_name", "Business name"],
  ["announcement", "Announcement bar"],
  ["currency", "Currency code"],
  ["country", "Country"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Address"],
  ["instagram_url", "Instagram URL"],
  ["pickup_location", "Pickup location"],
  ["pickup_instructions", "Pickup instructions"],
] as const;

type SettingsForm = Record<(typeof fields)[number][0] | "story", string>;

const emptyForm: SettingsForm = {
  business_name: "",
  announcement: "",
  currency: "",
  country: "",
  phone: "",
  email: "",
  address: "",
  instagram_url: "",
  pickup_location: "",
  pickup_instructions: "",
  story: "",
};

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    },
  });
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    const s = data as Settings;
    setForm({
      business_name: s.business_name ?? "",
      announcement: s.announcement ?? "",
      currency: s.currency ?? "",
      country: s.country ?? "",
      phone: s.phone ?? "",
      email: s.email ?? "",
      address: s.address ?? "",
      instagram_url: s.instagram_url ?? "",
      pickup_location: s.pickup_location ?? "",
      pickup_instructions: s.pickup_instructions ?? "",
      story: s.story ?? "",
    });
  }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const patch = {
      business_name: form.business_name.trim(),
      announcement: form.announcement.trim(),
      currency: form.currency.trim() || "ETB",
      country: form.country.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      delivery_enabled: false,
      pickup_enabled: true,
      delivery_fee_cents: 0,
      pickup_location: form.pickup_location.trim() || null,
      pickup_instructions: form.pickup_instructions.trim() || null,
      story: form.story,
    };
    setBusy(true);
    const { error: baseError } = await supabase.from("settings").update(patch).eq("id", 1);
    if (baseError) {
      setBusy(false);
      toast.error(baseError.message);
      return;
    }
    const { error: socialError } = await supabase
      .from("settings")
      .update({ instagram_url: form.instagram_url.trim() || null })
      .eq("id", 1);
    setBusy(false);
    if (socialError) {
      toast.message(
        "Settings saved. Instagram needs the SQL in drizzle/migrations/0001_admin_extras.sql.",
      );
    } else {
      toast.success("Settings saved");
    }
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          These details appear on the store. Update the phone, location, and story here whenever
          they change.
        </p>
      </div>
      <div className="grid gap-4 rounded-2xl bg-card p-6 shadow-soft sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <div
            key={key}
            className={key === "announcement" || key === "address" ? "sm:col-span-2" : ""}
          >
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={form[key] ?? ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="bg-background"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <Label htmlFor="story">Our story</Label>
          <Textarea
            id="story"
            rows={6}
            value={form.story ?? ""}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            className="bg-background"
          />
        </div>
      </div>
      <Button type="submit" variant="brand" disabled={busy}>
        {busy ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
