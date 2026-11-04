create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
      from public.user_roles
     where user_id = _user_id
       and role = _role
  );
$$;

grant execute on function public.has_role(uuid, public.app_role) to authenticated;

do $$
declare
  first_user_id uuid;
begin
  perform pg_advisory_xact_lock(7351042);

  if not exists (select 1 from public.user_roles where role = 'admin') then
    select id
      into first_user_id
      from auth.users
     order by created_at, id
     limit 1;

    if first_user_id is not null then
      insert into public.user_roles(user_id, role)
      values (first_user_id, 'admin')
      on conflict (user_id, role) do nothing;
    end if;
  end if;
end;
$$;

delete from public.products as product
 where product.slug = 'crunchy-peanut-butter'
    or lower(coalesce(product.texture, '')) = 'crunchy'
    or exists (
      select 1
        from public.categories as category
       where category.id = product.category_id
         and (category.slug = 'crunchy' or lower(category.name) = 'crunchy')
    );

delete from public.categories
 where slug = 'crunchy'
    or lower(name) = 'crunchy';

with candidates as (
  select id,
         product_id,
         sort_order,
         lower(regexp_replace(trim(label), '\s+', '', 'g')) as normalized_label
    from public.product_variants
),
ranked as (
  select id,
         normalized_label,
         row_number() over (
           partition by product_id
           order by (normalized_label = '500g') desc, sort_order, id
         ) as position
    from candidates
)
delete from public.product_variants as variant
 using ranked
 where variant.id = ranked.id
   and (ranked.position > 1 or ranked.normalized_label <> '500g');

update public.product_variants
   set label = '500 g'
 where lower(regexp_replace(trim(label), '\s+', '', 'g')) = '500g';

create unique index if not exists product_variants_one_per_product_idx
  on public.product_variants (product_id);

do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conname = 'product_variants_500g_only_check'
       and conrelid = 'public.product_variants'::regclass
  ) then
    alter table public.product_variants
      add constraint product_variants_500g_only_check
      check (label = '500 g');
  end if;
end;
$$;

alter table public.settings
  alter column currency set default 'ETB',
  alter column country set default 'Ethiopia';

update public.settings
   set currency = 'ETB',
       country = 'Ethiopia'
 where id = 1;

notify pgrst, 'reload schema';
