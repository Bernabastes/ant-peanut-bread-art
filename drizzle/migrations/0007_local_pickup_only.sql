update public.settings
   set delivery_enabled = false,
       delivery_fee_cents = 0,
       pickup_enabled = true
 where id = 1;

create or replace function public.enforce_local_pickup_orders()
returns trigger
language plpgsql
set search_path = pg_catalog, public, pg_temp
as $$
begin
  if new.fulfillment is distinct from 'pickup' then
    raise exception 'Only local pickup orders are available';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_local_pickup_orders() from public, anon, authenticated;

drop trigger if exists orders_local_pickup_only on public.orders;
create trigger orders_local_pickup_only
  before insert or update of fulfillment on public.orders
  for each row
  execute function public.enforce_local_pickup_orders();

notify pgrst, 'reload schema';
