-- Restrict storage SELECT on resources bucket to authenticated users only
DROP POLICY IF EXISTS "Anyone can view resource files" ON storage.objects;
CREATE POLICY "Authenticated users can view resource files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources');

-- Revoke EXECUTE on SECURITY DEFINER functions that should not be callable from the API.
-- has_role is intentionally left executable because it is referenced from RLS policies.
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_otp_sessions() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_otp_session(text, text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_otp_session(text, text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.mark_otp_session_used(text, text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_resource_download_url(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated, PUBLIC;