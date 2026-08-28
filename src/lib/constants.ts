// Use the current origin for auth redirects to support both localhost and production
export const SITE_URL = typeof window !== 'undefined' && window.location.origin !== 'null' ? window.location.origin : "http://localhost:8080";
export const AUTH_CALLBACK_URL = `${SITE_URL}/auth/callback`;
