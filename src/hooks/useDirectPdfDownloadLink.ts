import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Params = {
  resourceId: string;
  filename: string;
};

/**
 * Returns a direct HTTPS URL (ending in .pdf) for Android WebView DownloadManager.
 * The backend endpoint streams the PDF with Content-Disposition: attachment.
 */
export function useDirectPdfDownloadLink({ resourceId, filename }: Params) {
  const [href, setHref] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!cancelled) setHref(null);
          return;
        }

        const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
        if (!baseUrl) {
          if (!cancelled) setHref(null);
          return;
        }

        const safeFilename = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;
        // Encode filename in URL path so Android WebView uses it directly
        // (Android often ignores Content-Disposition and uses URL path for filename)
        const encodedFilename = encodeURIComponent(safeFilename);
        const url = new URL(`${baseUrl}/functions/v1/download-resource/${resourceId}/${encodedFilename}`);
        url.searchParams.set("token", session.access_token);

        if (!cancelled) setHref(url.toString());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [resourceId, filename]);

  return { href, loading };
}
