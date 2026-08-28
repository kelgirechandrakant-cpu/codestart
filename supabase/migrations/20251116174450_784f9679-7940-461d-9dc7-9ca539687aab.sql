-- Create enum for resource types
CREATE TYPE public.resource_type AS ENUM ('note', 'assignment', 'pyq');

-- Create resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  semester TEXT,
  resource_type public.resource_type NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

-- Enable RLS on resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read resources (public access for downloads)
CREATE POLICY "Anyone can view resources"
ON public.resources
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert resources (for admin/developer)
CREATE POLICY "Authenticated users can insert resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update resources
CREATE POLICY "Authenticated users can update resources"
ON public.resources
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete resources
CREATE POLICY "Authenticated users can delete resources"
ON public.resources
FOR DELETE
TO authenticated
USING (true);

-- Storage policies for public read access
CREATE POLICY "Anyone can view resource files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resources');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload resource files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resources');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update resource files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'resources');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete resource files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'resources');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX idx_resources_type ON public.resources(resource_type);
CREATE INDEX idx_resources_subject ON public.resources(subject);
CREATE INDEX idx_resources_created_at ON public.resources(created_at DESC);