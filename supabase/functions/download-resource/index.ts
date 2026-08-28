// EduResources backend function: streams a PDF with attachment headers.
// URL pattern: /functions/v1/download-resource/<resourceId>.pdf?token=<jwt>&filename=<name.pdf>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

function getEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getAnonKey() {
  return Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
}

function sanitizeFilename(input: string) {
  // Remove path separators + control chars; keep it simple.
  const cleaned = input
    .replace(/[\\/]/g, "-")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  return cleaned.length ? cleaned : "download.pdf";
}

function contentDisposition(filename: string) {
  // RFC 5987 for UTF-8 filenames + a basic ASCII fallback.
  const ascii = filename.replace(/["]+/g, "'");
  const utf8 = encodeURIComponent(filename);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(req.url);
    const token = url.searchParams.get("token") ?? url.searchParams.get("access_token");
    if (!token) return new Response("Unauthorized", { status: 401 });

    // URL pattern: /functions/v1/download-resource/<resourceId>/<filename.pdf>
    // Android WebView uses the URL path for filename, so we embed it there.
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Find the resource ID (UUID) – it's after "download-resource"
    const fnIndex = pathParts.findIndex((p) => p === "download-resource");
    const resourceId = pathParts[fnIndex + 1] ?? "";
    // Filename comes from the path (preferred) or query param (fallback)
    const pathFilename = pathParts[fnIndex + 2] ? decodeURIComponent(pathParts[fnIndex + 2]) : null;
    if (!resourceId) return new Response("Bad Request", { status: 400 });

    const supabaseUrl = getEnv("SUPABASE_URL");
    const anonKey = getAnonKey();
    const serviceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    if (!anonKey) {
      return new Response("Server misconfigured", { status: 500 });
    }

    // Validate user token (keeps downloads authenticated even though this is a direct GET link).
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) return new Response("Unauthorized", { status: 401 });

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: resource, error: resourceError } = await adminClient
      .from("resources")
      .select("file_path, title, original_filename, is_unsorted, download_count")
      .eq("id", resourceId)
      .maybeSingle();

    if (resourceError || !resource) return new Response("Not Found", { status: 404 });
    if (resource.is_unsorted) return new Response("Not Found", { status: 404 });

    // Priority: path filename > query param > original_filename > title > fallback
    const requestedName = pathFilename ?? url.searchParams.get("filename");
    const baseName = sanitizeFilename(
      requestedName ?? resource.original_filename ?? resource.title ?? `${resourceId}.pdf`,
    );
    const finalName = baseName.toLowerCase().endsWith(".pdf") ? baseName : `${baseName}.pdf`;

    const { data: blob, error: downloadError } = await adminClient.storage
      .from("resources")
      .download(resource.file_path);

    if (downloadError || !blob) return new Response("Not Found", { status: 404 });

    // Increment download count (best-effort)
    void adminClient
      .from("resources")
      .update({ download_count: (resource.download_count ?? 0) + 1 })
      .eq("id", resourceId);

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", contentDisposition(finalName));
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Cache-Control", "private, no-store, max-age=0");

    if (req.method === "HEAD") return new Response(null, { status: 200, headers });

    return new Response(blob.stream(), { status: 200, headers });
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});
