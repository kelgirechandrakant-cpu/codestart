-- Create table to track OTP sessions for same-device validation
CREATE TABLE public.otp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
    used BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.otp_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for creating sessions)
CREATE POLICY "Anyone can create otp sessions"
ON public.otp_sessions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to select their own session by token
CREATE POLICY "Anyone can view sessions by token"
ON public.otp_sessions
FOR SELECT
USING (true);

-- Allow updates for marking sessions as used
CREATE POLICY "Anyone can update sessions"
ON public.otp_sessions
FOR UPDATE
USING (true);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.otp_sessions WHERE expires_at < now();
END;
$$;

-- Create index for faster lookups
CREATE INDEX idx_otp_sessions_email ON public.otp_sessions(email);
CREATE INDEX idx_otp_sessions_token ON public.otp_sessions(session_token);
CREATE INDEX idx_otp_sessions_expires ON public.otp_sessions(expires_at);