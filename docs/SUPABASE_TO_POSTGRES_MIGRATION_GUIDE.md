# Luxury Strand — Supabase → plain Postgres cutover

**Shape:** A — shimmed `@supabase/supabase-js` → plain PG  
**Coolify staging:** `luxurystrand-staging` (`rzh9hdesnyka024gg6wwn596`)  
**Staging URL:** https://luxurystrand-staging.169-58-8-203.sslip.io  
**DB:** `fleet-postgres` / `store_luxurystrand` (confirm name in Coolify env)

## Env cutover trio

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | `postgresql://…@fleet-postgres:5432/<db>` |
| `NEXT_PUBLIC_USE_PLAIN_PG` | `true` |
| `NEXT_PUBLIC_SUPABASE_URL` | Staging/production app origin |

## Hardening notes (Jul 2026)

- [x] Phase A: `public/service-worker.js` (`sw-v2.5-luxury`), `lib/format-money.ts`, `app/error.tsx`, `app/admin/error.tsx`
- [x] Phase B: `images.unoptimized`; removed Supabase/placeholder `remotePatterns`
- [x] Storefront `components/*` money via `money()` from `@/lib/format-money`
- [x] Payment/cron/notifications/maintenance APIs → `@/lib/supabase-admin`
- [x] Order history: Track / Reorder / Invoice / Help (raymahomes pattern)

## Verify

```bash
BASE=https://luxurystrand-staging.169-58-8-203.sslip.io
ssh big-vps "sudo docker ps --format '{{.Image}} {{.Status}}' | grep rzh9hde"
curl -s "$BASE/service-worker.js" | head -n 3
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/" "$BASE/shop"
```
