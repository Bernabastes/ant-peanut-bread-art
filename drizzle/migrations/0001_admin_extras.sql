-- Run this in the Supabase SQL editor if product photo uploads or the Instagram field are not available yet.

alter table public.settings add column if not exists instagram_url text;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
