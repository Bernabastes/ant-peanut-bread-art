alter table public.settings
  alter column phone set default '+251923139185',
  alter column address set default 'Jemo, Addis Ababa, Ethiopia';

update public.settings
   set phone = '+251923139185',
       address = 'Jemo, Addis Ababa, Ethiopia',
       updated_at = now()
 where id = 1;
