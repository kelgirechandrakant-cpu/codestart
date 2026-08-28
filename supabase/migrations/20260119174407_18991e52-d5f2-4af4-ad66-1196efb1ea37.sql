-- Fix 1: Require authentication for resources SELECT (file_path_exposure)
-- This prevents exposing internal storage paths to unauthenticated users
DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;

CREATE POLICY "Authenticated users can view resources"
ON public.resources FOR SELECT
TO authenticated
USING (true);

-- Fix 2 & 3: Secure otp_sessions table
-- The challenge: Users aren't authenticated when using OTP flow, so we can't use auth.uid()
-- Solution: Create a security definer function that validates by session_token only
-- This way, users can only access sessions where they know the token (stored in their localStorage)

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view sessions by token" ON public.otp_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.otp_sessions;
DROP POLICY IF EXISTS "Anyone can create otp sessions" ON public.otp_sessions;

-- Create a security definer function to validate session by token
-- This prevents exposing emails while still allowing session validation
CREATE OR REPLACE FUNCTION public.validate_otp_session(
  p_email text,
  p_session_token text
)
RETURNS TABLE (
  id uuid,
  expires_at timestamptz,
  used boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT os.id, os.expires_at, os.used
  FROM public.otp_sessions os
  WHERE os.email = lower(p_email)
    AND os.session_token = p_session_token
    AND os.expires_at > now()
    AND os.used = false;
END;
$$;

-- Create a security definer function to mark session as used
CREATE OR REPLACE FUNCTION public.mark_otp_session_used(
  p_email text,
  p_session_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_updated integer;
BEGIN
  UPDATE public.otp_sessions
  SET used = true
  WHERE email = lower(p_email)
    AND session_token = p_session_token
    AND used = false;
  
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;

-- Create a security definer function to create a new OTP session
CREATE OR REPLACE FUNCTION public.create_otp_session(
  p_email text,
  p_session_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clean up any existing sessions for this email first
  DELETE FROM public.otp_sessions 
  WHERE email = lower(p_email);
  
  -- Insert new session
  INSERT INTO public.otp_sessions (email, session_token)
  VALUES (lower(p_email), p_session_token);
  
  RETURN true;
END;
$$;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.validate_otp_session TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_otp_session_used TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_otp_session TO anon, authenticated;

-- Now restrict direct table access completely
-- RLS policies will deny all direct access; use functions instead

-- Allow INSERT only through the function (deny direct inserts)
CREATE POLICY "Deny direct insert to otp_sessions"
ON public.otp_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Deny all SELECT (use function instead)
CREATE POLICY "Deny direct select on otp_sessions"
ON public.otp_sessions FOR SELECT
TO anon, authenticated
USING (false);

-- Deny all UPDATE (use function instead)  
CREATE POLICY "Deny direct update on otp_sessions"
ON public.otp_sessions FOR UPDATE
TO anon, authenticated
USING (false);

-- Allow DELETE for cleanup function (only service_role should delete)
CREATE POLICY "Deny direct delete on otp_sessions"
ON public.otp_sessions FOR DELETE
TO anon, authenticated
USING (false);