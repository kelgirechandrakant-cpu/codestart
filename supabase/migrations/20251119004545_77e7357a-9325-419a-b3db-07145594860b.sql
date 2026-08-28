-- Fix the infinite recursion issue by completely rebuilding user_roles policies
-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create the correct policies using the security definer function
-- This policy allows users to see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- This policy allows admins to manage all roles
-- Uses has_role() security definer function to break recursion
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));