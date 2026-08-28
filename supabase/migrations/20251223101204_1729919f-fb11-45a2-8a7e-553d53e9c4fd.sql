-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource_types table
CREATE TABLE public.resource_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create year_semester_mappings table
CREATE TABLE public.year_semester_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, semester)
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to resources table for hierarchy
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id),
  ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id),
  ADD COLUMN IF NOT EXISTS resource_type_id UUID REFERENCES public.resource_types(id),
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS original_filename TEXT,
  ADD COLUMN IF NOT EXISTS is_unsorted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS migration_status TEXT DEFAULT 'pending';

-- Enable RLS on all new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_semester_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS policies for departments (public read, admin write)
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Only admins can insert departments" ON public.departments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update departments" ON public.departments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete departments" ON public.departments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for resource_types (public read, admin write)
CREATE POLICY "Anyone can view resource_types" ON public.resource_types FOR SELECT USING (true);
CREATE POLICY "Only admins can insert resource_types" ON public.resource_types FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update resource_types" ON public.resource_types FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete resource_types" ON public.resource_types FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for year_semester_mappings (public read, admin write)
CREATE POLICY "Anyone can view year_semester_mappings" ON public.year_semester_mappings FOR SELECT USING (true);
CREATE POLICY "Only admins can insert year_semester_mappings" ON public.year_semester_mappings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update year_semester_mappings" ON public.year_semester_mappings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete year_semester_mappings" ON public.year_semester_mappings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for subjects (public read, admin write)
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update subjects" ON public.subjects FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete subjects" ON public.subjects FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default resource types
INSERT INTO public.resource_types (name, display_order, is_default) VALUES
  ('Notes', 1, true),
  ('PYQs', 2, true),
  ('Assignments', 3, true),
  ('Books', 4, true),
  ('Others', 5, true);

-- Insert default year-semester mappings
INSERT INTO public.year_semester_mappings (year, semester) VALUES
  (1, 1), (1, 2),
  (2, 3), (2, 4),
  (3, 5), (3, 6),
  (4, 7), (4, 8);