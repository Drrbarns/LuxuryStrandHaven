# Luxury Strand Haven — Database

Everything needed to **clone this site's database into a brand-new Supabase project**.

There are two ways to bring the DB up. Pick **one**.

---

## 🚀 Fastest path — single-shot clone

Use this when you just want a new Supabase project to match production **right now**.

1. Create a new project at [supabase.com](https://supabase.com) (note the URL + anon/service keys).
2. Open **SQL Editor** → **New query**.
3. Paste the **entire contents of [`schema.sql`](./schema.sql)** and click **Run**.
   This creates extensions, enums, tables, functions, indexes, triggers, RLS policies, storage buckets and storage policies — all idempotent, so it's safe to re-run.
4. (Optional) Paste the contents of [`seed.sql`](./seed.sql) and click **Run** to load default feature flags, store settings and an "Uncategorized" category.
5. Copy your new project's credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
6. Create your admin user:
   - Sign up through the app (or Supabase **Authentication → Users**).
   - Promote them to admin in SQL Editor:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'you@example.com';
     ```

Done. The whole site will work against the new project.

---

## 🧰 CLI path — versioned migrations

Use this if you want to keep the database under version control and track incremental migrations.

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-new-project-ref>
supabase db push         # applies every file under supabase/migrations
```

Then optionally seed:
```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

### Current migrations (run in order automatically)

| Order | File | What it does |
|------:|------|--------------|
| 1 | `20260209000000_complete_schema.sql` | Core schema — all ~30 e-commerce tables, RLS, functions, storage |
| 2 | `20260313000000_academia_courses.sql` | Adds the Academia / online-courses table |
| 3 | `20260423000000_product_links_and_contact.sql` | Adds `product_category_links` (multi-category products) and `contact_submissions` (contact form) |

Future schema changes → add a **new** timestamped file under `supabase/migrations/`. Never edit historical migrations.

---

## 📋 Complete table inventory

### Core e-commerce
`profiles` · `addresses` · `categories` · `products` · `product_images` · `product_variants` · `product_category_links` · `coupons`

### Orders & payments
`orders` · `order_items` · `order_status_history` · `customers`

### Customer activity
`cart_items` · `wishlist_items` · `reviews` · `review_images`

### Content / CMS
`blog_posts` · `pages` · `site_settings` · `store_settings` · `cms_content` · `banners` · `navigation_menus` · `navigation_items` · `academia_courses`

### Support & operations
`support_tickets` · `support_messages` · `return_requests` · `return_items` · `notifications` · `contact_submissions` · `audit_logs`

### Admin
`store_modules` (feature flags)

---

## 🔐 Security model (RLS)

| Scope | Who can do what |
|-------|-----------------|
| Public (anon) | Read: active products, categories, published blog posts, approved reviews, banners, navigation, pages, CMS content, site settings |
| Authenticated user | CRUD own profile / addresses / cart / wishlist / reviews / tickets / orders |
| Admin/Staff (`profiles.role IN ('admin','staff')`) | Full CRUD on everything |
| Service role | Bypasses RLS (used by server-side API routes only) |

The helper `public.is_admin_or_staff()` is the central gate — re-used across every admin policy so permission changes only need to happen in one place.

---

## 🔧 Database functions (RPC)

| Function | Used by | Purpose |
|----------|---------|---------|
| `is_admin_or_staff()` | RLS policies | Checks current user's role |
| `handle_new_user()` | `auth.users` trigger | Auto-creates a `profiles` row on signup |
| `update_updated_at_column()` | every "updated_at" trigger | Keeps `updated_at` current |
| `update_product_rating_stats()` | reviews trigger | Recomputes `rating_avg` + `review_count` |
| `upsert_customer_from_order(...)` | checkout + POS | Creates/updates the CRM `customers` row |
| `update_customer_stats(email, total)` | payment webhooks | Bumps order totals per customer |
| `mark_order_paid(order_ref, ref)` | payment webhooks (Moolre, Paystack, Stripe, PayPal) | Sets paid, reduces stock atomically |
| `reduce_stock_on_order(order_id)` | POS / manual | Reduces product + variant stock for an order |
| `get_all_customer_emails()` / `get_all_customer_phones()` | marketing UI | De-duped primary + secondary contact lists |

---

## 🪣 Storage buckets

All buckets are **public-read**, staff-write:

- `products` — product images
- `avatars` — user avatars
- `blog` — blog post hero images
- `media` — generic media uploads
- `reviews` — customer review images
- `site-assets` — logo, favicon, hero slides (service-role writeable for settings page)

---

## ✅ Verifying your clone

After running `schema.sql` + `seed.sql`, this should all pass in SQL Editor:

```sql
-- Should return 33+ rows
SELECT count(*) FROM pg_tables WHERE schemaname = 'public';

-- Should return 6 buckets
SELECT id FROM storage.buckets;

-- Should return all 13 enums
SELECT count(*) FROM pg_type WHERE typname IN
 ('user_role','gender_type','address_type','product_status','category_status',
  'order_status','payment_status','discount_type','review_status','blog_status',
  'ticket_status','ticket_priority','return_status');

-- Should return 8 feature-flag rows
SELECT id, enabled FROM public.store_modules ORDER BY id;

-- RLS is on for every public table
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT c.relname FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relrowsecurity = true
  );
-- → should return 0 rows
```

---

## 📤 Migrating data from an existing project

If you need to copy production **data** (not just the schema) into the new project:

1. In the **old** project's SQL Editor, export each table as CSV (Database → Table Editor → ⋯ → Export to CSV), or use:
   ```bash
   supabase db dump --data-only --schema public > data.sql
   ```
2. Import into the new project:
   ```bash
   psql "$NEW_DATABASE_URL" -f data.sql
   ```
3. Also copy storage files — Supabase doesn't copy these automatically. Either:
   - Use `supabase storage` CLI commands, or
   - Re-upload from the admin panel.

---

## ⚠️ Gotchas

- **Always run `schema.sql` before `seed.sql`.** Seed depends on tables existing.
- **`auth.users` is managed by Supabase.** Don't try to `INSERT` into it in SQL — use the Auth API or Dashboard to create users. The `on_auth_user_created` trigger will auto-populate `profiles`.
- **Changing roles:** new accounts start as `customer`. Promote to `admin` via the SQL snippet above.
- **Re-running `schema.sql`** is safe (idempotent) — but running old numbered migrations twice is **not** (they use `CREATE TABLE` without `IF NOT EXISTS`). Use `schema.sql` for re-runs.
