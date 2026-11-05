# Ant Peanut

Artisan peanut butter shop. Customers browse jars, choose a size, and place an order online for local pickup. Payment is collected in person. There is no card checkout.

The homepage hero is an illustration of peanut butter landing on toast. To use real footage, add a film at `public/videos/peanut-butter-hero.mp4` (landscape, about 8 seconds, no text or logo) and set `VITE_HERO_VIDEO_URL=/videos/peanut-butter-hero.mp4`. Until that variable is configured, the homepage displays the illustrated animation and does not request a missing video.

The store sells creamy peanut butter in 500 g jars, priced in Ethiopian birr (ETB). Jar pictures in `public/images/` are illustrated placeholders. Replace them from Admin → Products with photographs of your real jar. Sample prices already stored in the database are placeholders too. Example products start unpublished and with zero stock; set the real price, stock, product information, and photo in Admin → Products before publishing or taking orders.

The interface is available in English and Amharic. Use the language control at the top of the storefront (or in the admin/sign-in area); your choice is saved in that browser. Product names and descriptions, store settings, and other custom content remain as entered.

## Run locally

```sh
npm i
npm run dev
```

Copy `.env` with `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and the matching `VITE_` variables. Apply the database scripts in order in the Supabase SQL editor: `drizzle/migrations/0000_migration.sql`, `drizzle/migrations/0001_admin_extras.sql`, `drizzle/migrations/0002_atomic_order_admin.sql`, `drizzle/migrations/0003_creamy_etb_admin.sql`, `drizzle/migrations/0004_contact_and_story.sql`, `drizzle/migrations/0005_step_by_step_story.sql`, `drizzle/migrations/0006_security_hardening.sql`, then `drizzle/migrations/0007_local_pickup_only.sql`. The first user created in Supabase Auth becomes the administrator if no admin exists. Create the owner's account through Supabase Auth, verify admin access, and disable public sign-ups there. The app's `/auth` page is sign-in only.

For an existing database, apply `0002_atomic_order_admin.sql` if it has not already been applied, then `0003_creamy_etb_admin.sql`, `0004_contact_and_story.sql`, `0005_step_by_step_story.sql`, `0006_security_hardening.sql`, and `0007_local_pickup_only.sql`. These migrations set the contact details and story shown on the site, tighten database function permissions, and make local pickup the only fulfillment option. `0003` removes the crunchy product and non-500 g sizes, sets the store currency to Ethiopian birr, and grants the oldest existing account admin access only if no admin exists. `0007` disables delivery and rejects new non-pickup orders; historical delivery orders remain unchanged. The photo-upload bucket and Instagram setting are added by `0001_admin_extras.sql`.

If an administrator already exists but your owner account still cannot access `/admin`, run this in the Supabase SQL Editor after replacing the email with the exact sign-in email:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = lower('YOUR_SIGN_IN_EMAIL')
on conflict (user_id, role) do nothing;
```

If Admin → Orders reports that `admin_update_order` could not be found, run `drizzle/migrations/0002_atomic_order_admin.sql` in the Supabase SQL Editor. The script asks PostgREST to reload its schema cache; if the error remains after it completes, run `NOTIFY pgrst, 'reload schema';` in the SQL Editor and retry.

## Deploy

Before launch:

- Apply all database migrations through `0007_local_pickup_only.sql`.
- In Supabase Auth, create and test the owner's admin account, then disable public sign-ups. Enable email confirmation and multi-factor authentication for administrator accounts where available.
- Set the production site URL and allowed redirect URLs in Supabase Auth to the real domain; remove preview or temporary domains you no longer use.
- Configure deployment secrets on the hosting provider. The publishable key may be used by the browser; never expose `SUPABASE_SERVICE_ROLE_KEY` or a Supabase secret key in a `VITE_` variable, client bundle, or public repository.
- Set real ETB prices, stock, pickup location and instructions, and contact details in Admin before accepting orders.
- Test a real sign-in, a rejected sign-in, a test order, order status lookup, and an admin update on the deployed URL.

The public storefront is `/`. Admin sign-in is `/auth`, and the protected admin pages are under `/admin` (for example `/admin/orders`). They use the same domain; the admin pages are protected by Supabase authentication, database role checks, and row-level security, not by a separate deployment or by hiding the URL. Email is not configured: new orders show up in `/admin`, and the site does not claim an email was sent.

This project was built with [Lovable](https://lovable.dev).

### Deploy on Cloudflare Workers

This project builds with Nitro's Cloudflare Workers preset. In Cloudflare, go to **Workers & Pages → Create → Connect to Git**, select this repository and its production branch, and set:

- Build command: `npm run build`
- Deploy command: `npm run deploy:worker`

In **Workers Builds → Settings → Build**, add build variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The server uses these as a fallback if a deployment replaces dashboard-only runtime variables. You can also add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` under the Worker’s **Settings → Variables and Secrets** for production runtime configuration. Use the same Supabase project URL and publishable key as the local `.env`; the publishable key is intended for public client use. Never add a Supabase secret or service-role key to either location.

The generated Worker enables `nodejs_compat` for the server runtime. After deployment, set the production domain as the Supabase Auth Site URL and allow the deployed domain’s auth redirect URL. Test sign-in, checkout, order tracking, and the admin pages at the deployed URL. Cloudflare’s Free plan has usage limits; Supabase’s database and auth plan is separate.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/85d258d5-9fc7-4e90-ad5e-295576ca4033).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
