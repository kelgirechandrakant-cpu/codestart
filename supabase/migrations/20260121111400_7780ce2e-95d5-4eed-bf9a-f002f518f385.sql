-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view resources" ON public.resources;

-- Create a new permissive SELECT policy that allows anyone to view resources
CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
USING (is_unsorted = false);