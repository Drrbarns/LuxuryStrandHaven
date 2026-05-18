-- Academia / Online courses (admin-managed, displayed on /academia)
CREATE TABLE IF NOT EXISTS public.academia_courses (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title text NOT NULL,
  description text,
  icon text DEFAULT '📚',
  price numeric DEFAULT 0,
  youtube_url text,
  sort_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_academia_courses_updated_at
  BEFORE UPDATE ON public.academia_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.academia_courses ENABLE ROW LEVEL SECURITY;

-- Public can read active courses (storefront); admin/staff can read all
CREATE POLICY "Public read active courses"
  ON public.academia_courses FOR SELECT
  USING (
    status = 'active'
    OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
  );

-- Only admin/staff can insert
CREATE POLICY "Admin insert courses"
  ON public.academia_courses FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff'))
  );

-- Only admin/staff can update/delete
CREATE POLICY "Admin update delete courses"
  ON public.academia_courses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));

CREATE POLICY "Admin delete courses"
  ON public.academia_courses FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')));

COMMENT ON TABLE public.academia_courses IS 'Online courses for Academia page; price and YouTube link per course';
