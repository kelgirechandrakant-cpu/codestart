-- Create a unique partial index to ensure only one admin exists
CREATE UNIQUE INDEX idx_single_admin ON public.user_roles(role) WHERE role = 'admin';