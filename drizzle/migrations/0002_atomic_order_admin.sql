create or replace function public.handle_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(7351042);
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

do $$
declare
  sample_product_ids uuid[];
begin
  select array_agg(p.id)
    into sample_product_ids
    from public.products as p
   where p.slug in ('classic-creamy-peanut-butter', 'crunchy-peanut-butter')
     and (
       select count(*)
         from public.product_variants as v
        where v.product_id = p.id
     ) = 2
     and (
       select count(*)
         from public.product_variants as v
        where v.product_id = p.id
          and v.stock = 20
          and (
            (v.label = '250 g' and v.price_cents = 50000)
            or (v.label = '500 g' and v.price_cents = 90000)
          )
     ) = 2;

  if sample_product_ids is not null then
    update public.products
       set is_published = false
     where id = any(sample_product_ids);

    update public.product_variants
       set stock = 0
     where product_id = any(sample_product_ids);
  end if;
end;
$$;

create or replace function public.admin_update_order(
  _order_id uuid,
  _status text default null,
  _payment_status text default null,
  _admin_notes text default null,
  _update_notes boolean default false
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_order public.orders;
begin
  if auth.uid() is null or not public.has_role(auth.uid(), 'admin') then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  if _status is null and _payment_status is null and not _update_notes then
    raise exception 'No order changes were supplied';
  end if;

  if _status is not null and _status not in (
    'Pending Confirmation', 'Confirmed', 'Preparing', 'Ready for Pickup',
    'Out for Delivery', 'Completed', 'Cancelled', 'Rejected'
  ) then
    raise exception 'Invalid order status';
  end if;

  if _payment_status is not null and _payment_status not in ('Unpaid', 'Paid') then
    raise exception 'Invalid payment status';
  end if;

  select *
    into current_order
    from public.orders
   where id = _order_id
   for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if _status is not null and _status is distinct from current_order.status then
    if not (
      (current_order.status = 'Pending Confirmation' and _status in ('Confirmed', 'Rejected'))
      or (current_order.status = 'Confirmed' and _status in ('Preparing', 'Cancelled'))
      or (
        current_order.status = 'Preparing'
        and (
          (_status = 'Ready for Pickup' and current_order.fulfillment = 'pickup')
          or (_status = 'Out for Delivery' and current_order.fulfillment = 'delivery')
          or _status = 'Cancelled'
        )
      )
      or (current_order.status in ('Ready for Pickup', 'Out for Delivery') and _status in ('Completed', 'Cancelled'))
    ) then
      raise exception 'Invalid order status transition from % to %', current_order.status, _status;
    end if;

    if _status in ('Cancelled', 'Rejected') then
      update public.product_variants as variants
         set stock = variants.stock + ordered.quantity
        from (
          select variant_id, sum(quantity)::integer as quantity
            from public.order_items
           where order_id = current_order.id
             and variant_id is not null
           group by variant_id
        ) as ordered
       where variants.id = ordered.variant_id;
    end if;
  end if;

  update public.orders
     set status = coalesce(_status, status),
         payment_status = coalesce(_payment_status, payment_status),
         admin_notes = case when _update_notes then _admin_notes else admin_notes end
   where id = current_order.id;
end;
$$;

revoke all on function public.admin_update_order(uuid, text, text, text, boolean) from public, anon;
grant execute on function public.admin_update_order(uuid, text, text, text, boolean) to authenticated;

notify pgrst, 'reload schema';
