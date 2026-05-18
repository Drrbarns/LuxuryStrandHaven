-- ============================================================================
-- DEFAULT SEED DATA (safe to run on any environment; all upserts are idempotent)
--
-- Loads the sensible defaults the admin dashboard expects:
--   • store_modules  — feature flags shown on /admin/modules
--   • store_settings — site name / contact / maintenance / hero defaults / etc.
--   • categories     — an empty "Uncategorized" fallback category
--
-- Run this AFTER schema.sql (or after all numbered migrations).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Store Modules (feature flags)
-- ---------------------------------------------------------------------------
INSERT INTO public.store_modules (id, enabled) VALUES
  ('notifications',      false),
  ('cms',                false),
  ('homepage',           true),
  ('blog',               false),
  ('customer-insights',  false),
  ('flash-sales',        false),
  ('loyalty-program',    false),
  ('pwa-settings',       false)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Store Settings (CMS / site config)
-- ---------------------------------------------------------------------------
INSERT INTO public.store_settings (key, value, description) VALUES
  ('site_name',                    '"My Store"'::jsonb,                       'Site display name'),
  ('site_tagline',                 '"Premium quality, delivered."'::jsonb,    'Short tagline'),
  ('site_description',             '"Welcome to our online store."'::jsonb,   'Site meta description / SEO'),
  ('site_logo',                    '""'::jsonb,                               'URL to site logo image'),
  ('site_favicon',                 '""'::jsonb,                               'URL to favicon'),
  ('contact_email',                '"support@example.com"'::jsonb,            'Primary contact email'),
  ('contact_phone',                '""'::jsonb,                               'Primary contact phone'),
  ('contact_address',              '""'::jsonb,                               'Physical store address'),
  ('currency',                     '"GHS"'::jsonb,                            'Default store currency'),
  ('currency_symbol',              '"GH₵"'::jsonb,                            'Currency symbol'),
  ('maintenance_mode',             'false'::jsonb,                            'When true, storefront is hidden'),
  ('maintenance_message',          '"We''ll be back soon."'::jsonb,           'Text shown on maintenance page'),
  ('maintenance_countdown_minutes','30'::jsonb,                               'Countdown shown to visitors'),
  ('hero_slides',                  '[]'::jsonb,                               'Array of hero image URLs'),
  ('social_facebook',              '""'::jsonb,                               'Facebook URL'),
  ('social_instagram',             '""'::jsonb,                               'Instagram URL'),
  ('social_twitter',               '""'::jsonb,                               'Twitter/X URL'),
  ('social_tiktok',                '""'::jsonb,                               'TikTok URL'),
  ('social_whatsapp',              '""'::jsonb,                               'WhatsApp number/link'),
  ('seo_keywords',                 '""'::jsonb,                               'Meta keywords'),
  ('ga_measurement_id',            '""'::jsonb,                               'Google Analytics ID'),
  ('announcement_bar_enabled',     'false'::jsonb,                            'Show announcement bar'),
  ('announcement_bar_text',        '""'::jsonb,                               'Announcement bar text'),
  ('shipping_flat_rate',           '0'::jsonb,                                'Flat shipping rate'),
  ('free_shipping_threshold',      '0'::jsonb,                                'Free shipping minimum cart total'),
  ('tax_rate',                     '0'::jsonb,                                'Default tax rate (%)')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Default "Uncategorized" category (so products always have a home)
-- ---------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, status, position)
VALUES ('Uncategorized', 'uncategorized', 'Default fallback category', 'active', 999)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Default navigation menu (optional skeleton)
-- ---------------------------------------------------------------------------
INSERT INTO public.navigation_menus (id, name)
SELECT extensions.uuid_generate_v4(), 'Main Menu'
WHERE NOT EXISTS (SELECT 1 FROM public.navigation_menus WHERE name = 'Main Menu');
