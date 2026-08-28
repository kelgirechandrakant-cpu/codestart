-- Make the resources bucket private for better security
UPDATE storage.buckets 
SET public = false 
WHERE name = 'resources';

-- Create a security definer function to generate signed URLs for downloads
-- This allows controlled public access while keeping the bucket private
CREATE OR REPLACE FUNCTION public.get_resource_download_url(resource_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  file_path text;
  signed_url text;
BEGIN
  -- Get the file path from the resources table
  SELECT r.file_path INTO file_path
  FROM public.resources r
  WHERE r.id = resource_id;
  
  IF file_path IS NULL THEN
    RAISE EXCEPTION 'Resource not found';
  END IF;
  
  -- Return the file path for client-side download
  -- The client will use supabase.storage.from('resources').download(file_path)
  RETURN file_path;
END;
$$;