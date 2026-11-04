create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, pg_temp
as $$
  select coalesce(_user_id = auth.uid(), false)
     and exists (
       select 1
         from public.user_roles
        where user_id = auth.uid()
          and role = _role
     );
$$;

revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

alter function public.handle_first_admin()
  set search_path = pg_catalog, public, pg_temp;
alter function public.log_order_change()
  set search_path = pg_catalog, public, pg_temp;
alter function public.place_order(jsonb)
  set search_path = pg_catalog, public, pg_temp;
alter function public.get_order_public(text, text)
  set search_path = pg_catalog, public, pg_temp;
alter function public.admin_update_order(uuid, text, text, text, boolean)
  set search_path = pg_catalog, public, pg_temp;

revoke all on function public.handle_first_admin() from public, anon, authenticated;
revoke all on function public.log_order_change() from public, anon, authenticated;
revoke all on function public.place_order(jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb) to anon, authenticated;
revoke all on function public.get_order_public(text, text) from public, anon, authenticated;
grant execute on function public.get_order_public(text, text) to anon, authenticated;
revoke all on function public.admin_update_order(uuid, text, text, text, boolean) from public, anon;
grant execute on function public.admin_update_order(uuid, text, text, text, boolean) to authenticated;

notify pgrst, 'reload schema';
