import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Package, Settings, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Ant Peanut" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    return { isAdmin: !!data };
  },
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  if (!isAdmin)
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">No access</h1>
          <p className="mt-2 text-muted-foreground">{user.email} isn't an administrator of this store.</p>
          <Button variant="brand" className="mt-6" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    );
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b bg-sidebar p-4 md:min-h-screen md:border-b-0 md:border-r">
        <Logo />
        <nav className="mt-6 flex gap-1 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: "exact" in l }}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent"
              activeProps={{ className: "bg-chocolate text-cream hover:bg-chocolate" }}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden text-xs text-muted-foreground md:block">{user.email}</div>
        <Button variant="ghost" size="sm" className="mt-2" onClick={signOut}><LogOut /> Sign out</Button>
        <Link to="/" className="mt-2 block text-xs underline">View store</Link>
      </aside>
      <main className="p-4 md:p-8"><Outlet /></main>
    </div>
  );
}
