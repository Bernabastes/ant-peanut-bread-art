import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Owner Sign In — Ant Peanut" },
      { name: "description", content: "Sign in to manage the Ant Peanut store." },
      { property: "og:title", content: "Owner Sign In — Ant Peanut" },
      { property: "og:description", content: "Store management sign in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { redirect: back } = Route.useSearch();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      const path = back && back.startsWith("/") && !back.startsWith("//") ? back : "/admin";
      navigate({ to: path });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-card p-8 shadow-lift"
      >
        <Logo />
        <h1 className="text-2xl font-bold">
          {mode === "in" ? "Owner sign in" : "Create owner account"}
        </h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" name="password" type="password" minLength={8} required />
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button variant="brand" className="w-full" disabled={busy}>
          {mode === "in" ? "Sign in" : "Create account"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="w-full text-center text-sm underline"
        >
          {mode === "in" ? "First time? Create the owner account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
