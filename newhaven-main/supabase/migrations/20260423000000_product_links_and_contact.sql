-- ============================================================================
-- MIGRATION: Product<->Category many-to-many links + Contact form submissions
--
-- These tables are used by the live app but were missing from the initial
-- consolidated schema. This migration is safe/idempotent (IF NOT EXISTS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. product_category_links
-- Many-to-many join: lets a product belong to multiple categories. The
-- products.category_id column stays the "primary" category, while this
-- table stores additional categories.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_category_links (
  product_id  uuid NOT NULL REFERENCES public.products(id)   ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_pcl_product_id  ON public.product_category_links (product_id);
CREATE INDEX IF NOT EXISTS idx_pcl_category_id ON public.product_category_links (category_id);

ALTER TABLE public.product_category_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read product_category_links" ON public.product_category_links;
CREATE POLICY "Public read product_category_links"
  ON public.product_category_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff manage product_category_links" ON public.product_category_links;
CREATE POLICY "Staff manage product_category_links"
  ON public.product_category_links FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

COMMENT ON TABLE public.product_category_links IS
  'Join table allowing a product to belong to multiple categories in addition to products.category_id (the primary).';

-- ---------------------------------------------------------------------------
-- 2. contact_submissions
-- Stores messages sent via the public /contact form.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  subject    text,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new', -- new | read | replied | archived
  metadata   jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status     ON public.contact_submissions (status);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can submit the form
DROP POLICY IF EXISTS "Public insert contact_submissions" ON public.contact_submissions;
CREATE POLICY "Public insert contact_submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only staff can read / update / delete submissions
DROP POLICY IF EXISTS "Staff read contact_submissions" ON public.contact_submissions;
CREATE POLICY "Staff read contact_submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin_or_staff());

DROP POLICY IF EXISTS "Staff manage contact_submissions" ON public.contact_submissions;
CREATE POLICY "Staff manage contact_submissions"
  ON public.contact_submissions FOR ALL
  USING (public.is_admin_or_staff())
  WITH CHECK (public.is_admin_or_staff());

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.contact_submissions IS 'Public contact form submissions from /contact page.';
