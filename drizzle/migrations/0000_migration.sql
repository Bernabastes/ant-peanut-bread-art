create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(7351042);
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  texture text,
  ingredients text,
  allergens text,
  storage_instructions text,
  image_url text,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price_cents int not null check (price_cents >= 0),
  stock int not null default 0 check (stock >= 0),
  is_available boolean not null default true,
  sort_order int not null default 0
);
create table public.settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'Ant Peanut',
  announcement text not null default 'Made with love. Packed with goodness. Delivered to your door.',
  currency text not null default 'ETB',
  country text not null default 'Ethiopia',
  phone text default '+251923139185',
  email text,
  address text default 'Jemo, Addis Ababa, Ethiopia',
  delivery_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  delivery_fee_cents int not null default 0,
  delivery_info text not null default 'Delivery times will be confirmed when we call to confirm your order.',
  delivery_regions text,
  pickup_location text,
  pickup_instructions text,
  story text not null default 'We make our peanut butter at home, using our machine to grind the peanuts carefully and neatly into a smooth, creamy spread. We keep it pure: only peanuts go into the jar. We do not add sugar, water, or anything else—just pure peanuts, made creamy.',
  updated_at timestamptz not null default now()
);
insert into public.settings (id, phone, address) values (1, '+251923139185', 'Jemo, Addis Ababa, Ethiopia');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  access_token text not null default encode(extensions.gen_random_bytes(18), 'hex'),
  customer_name text not null,
  phone text not null,
  email text,
  fulfillment text not null check (fulfillment in ('delivery','pickup')),
  address text,
  city text,
  delivery_instructions text,
  customer_note text,
  subtotal_cents int not null,
  delivery_fee_cents int not null default 0,
  total_cents int not null,
  currency text not null,
  payment_method text not null default 'Pay in Person',
  payment_status text not null default 'Unpaid' check (payment_status in ('Unpaid','Paid')),
  status text not null default 'Pending Confirmation' check (status in ('Pending Confirmation','Confirmed','Preparing','Ready for Pickup','Out for Delivery','Completed','Cancelled','Rejected')),
  admin_notes text,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text not null,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0)
);
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  field text not null,
  value text not null,
  changed_by uuid,
  created_at timestamptz not null default now()
);

grant select on public.categories, public.products, public.product_variants, public.settings to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.product_variants to authenticated;
grant update on public.settings to authenticated;
grant select, update, delete on public.orders, public.order_items to authenticated;
grant select, insert on public.order_status_history to authenticated;
grant all on public.categories, public.products, public.product_variants, public.settings, public.orders, public.order_items, public.order_status_history to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;

create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read published products" on public.products for select using (is_published or public.has_role(auth.uid(),'admin'));
create policy "admin write products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read variants" on public.product_variants for select using (exists (select 1 from public.products p where p.id = product_id and (p.is_published or public.has_role(auth.uid(),'admin'))));
create policy "admin write variants" on public.product_variants for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "public read settings" on public.settings for select using (true);
create policy "admin update settings" on public.settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin orders" on public.orders for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin order items" on public.order_items for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin history read" on public.order_status_history for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin history insert" on public.order_status_history for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

create or replace function public.log_order_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_status_history(order_id, field, value, changed_by) values (new.id, 'status', new.status, auth.uid());
  end if;
  if new.payment_status is distinct from old.payment_status then
    insert into public.order_status_history(order_id, field, value, changed_by) values (new.id, 'payment', new.payment_status, auth.uid());
  end if;
  new.updated_at = now();
  return new;
end $$;
create trigger orders_log_change before update on public.orders for each row execute function public.log_order_change();

create or replace function public.place_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  s public.settings;
  v record;
  item jsonb;
  qty int;
  sub int := 0;
  fee int := 0;
  oid uuid;
  onum text;
  tok text;
  existing public.orders;
  ful text := payload->>'fulfillment';
begin
  select * into s from public.settings where id = 1;
  if payload->>'idempotency_key' is not null then
    select * into existing from public.orders where idempotency_key = payload->>'idempotency_key';
    if found then return jsonb_build_object('order_number', existing.order_number, 'token', existing.access_token); end if;
  end if;
  if coalesce(trim(payload->>'customer_name'),'') = '' then raise exception 'Please enter your full name'; end if;
  if coalesce(trim(payload->>'phone'),'') = '' then raise exception 'Please enter your phone number'; end if;
  if length(payload->>'customer_name') > 120 or length(payload->>'phone') > 30 then raise exception 'Details too long'; end if;
  if ful = 'delivery' then
    if not s.delivery_enabled then raise exception 'Delivery is not available'; end if;
    if coalesce(trim(payload->>'address'),'') = '' then raise exception 'Please enter a delivery address'; end if;
    fee := s.delivery_fee_cents;
  elsif ful = 'pickup' then
    if not s.pickup_enabled then raise exception 'Pickup is not available'; end if;
  else raise exception 'Choose delivery or pickup'; end if;
  if jsonb_array_length(coalesce(payload->'items','[]'::jsonb)) = 0 then raise exception 'Your cart is empty'; end if;

  onum := 'AP-' || to_char(now(),'YYMMDD') || '-' || upper(substr(encode(extensions.gen_random_bytes(3),'hex'),1,5));
  insert into public.orders(order_number, customer_name, phone, email, fulfillment, address, city, delivery_instructions, customer_note, subtotal_cents, delivery_fee_cents, total_cents, currency, idempotency_key)
  values (onum, trim(payload->>'customer_name'), trim(payload->>'phone'), nullif(trim(payload->>'email'),''), ful,
    case when ful='delivery' then payload->>'address' end, payload->>'city', payload->>'delivery_instructions', payload->>'customer_note', 0, fee, 0, s.currency, payload->>'idempotency_key')
  returning id, access_token into oid, tok;

  for item in select * from jsonb_array_elements(payload->'items') loop
    qty := (item->>'quantity')::int;
    if qty is null or qty < 1 or qty > 50 then raise exception 'Invalid quantity'; end if;
    select pv.id, pv.label, pv.price_cents, pv.stock, pv.is_available, p.name, p.is_published into v
      from public.product_variants pv join public.products p on p.id = pv.product_id
      where pv.id = (item->>'variant_id')::uuid for update of pv;
    if not found or not v.is_available or not v.is_published then raise exception 'A product in your cart is no longer available'; end if;
    if v.stock < qty then raise exception '% (%) only has % left in stock', v.name, v.label, v.stock; end if;
    update public.product_variants set stock = stock - qty where id = v.id;
    insert into public.order_items(order_id, variant_id, product_name, variant_label, unit_price_cents, quantity)
      values (oid, v.id, v.name, v.label, v.price_cents, qty);
    sub := sub + v.price_cents * qty;
  end loop;
  update public.orders set subtotal_cents = sub, total_cents = sub + fee where id = oid;
  insert into public.order_status_history(order_id, field, value) values (oid, 'status', 'Pending Confirmation');
  return jsonb_build_object('order_number', onum, 'token', tok);
end $$;
grant execute on function public.place_order(jsonb) to anon, authenticated;

create or replace function public.get_order_public(_order_number text, _token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'order_number', o.order_number, 'status', o.status, 'payment_status', o.payment_status,
    'payment_method', o.payment_method, 'fulfillment', o.fulfillment, 'customer_name', o.customer_name,
    'subtotal_cents', o.subtotal_cents, 'delivery_fee_cents', o.delivery_fee_cents, 'total_cents', o.total_cents,
    'currency', o.currency, 'created_at', o.created_at,
    'items', coalesce((select jsonb_agg(jsonb_build_object('product_name', i.product_name, 'variant_label', i.variant_label, 'unit_price_cents', i.unit_price_cents, 'quantity', i.quantity)) from public.order_items i where i.order_id = o.id), '[]'::jsonb))
  from public.orders o where o.order_number = upper(trim(_order_number)) and o.access_token = trim(_token)
$$;
grant execute on function public.get_order_public(text, text) to anon, authenticated;

insert into public.categories(name, slug, sort_order) values ('Creamy','creamy',1);
insert into public.products(category_id, name, slug, short_description, description, texture, is_published, is_featured, sort_order, image_url) values
((select id from public.categories where slug='creamy'), 'Classic Creamy Peanut Butter', 'classic-creamy-peanut-butter', 'Smooth, rich peanut butter for everyday enjoyment.', 'Smooth, rich peanut butter for everyday enjoyment. Spread it on warm toast, swirl it into oats, or enjoy it straight from the spoon.', 'Creamy', false, true, 1, '/images/jar-creamy.svg');
insert into public.product_variants(product_id, label, price_cents, stock, sort_order) values
((select id from public.products where slug='classic-creamy-peanut-butter'), '500 g', 90000, 0, 1);

create policy "admin read product images" on storage.objects for select to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));