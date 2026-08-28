import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, resourceIds } = await req.json();
    const API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("AI_API_KEY");
    const API_URL = Deno.env.get("AI_GATEWAY_URL") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY / AI_API_KEY is not configured");
    }

    // Fetch resource context if resource IDs are provided
    let resourceContext = "";
    if (resourceIds && resourceIds.length > 0 && SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      
      const { data: resources, error } = await supabase
        .from("resources")
        .select(`
          id,
          title,
          description,
          subject,
          semester,
          year,
          file_type,
          departments:department_id(name),
          subjects:subject_id(name),
          resource_types:resource_type_id(name)
        `)
        .in("id", resourceIds)
        .eq("is_unsorted", false);

      if (!error && resources && resources.length > 0) {
        resourceContext = "\n\n--- REFERENCE MATERIALS ---\n" +
          "The student is asking about the following resources. Use this context to provide more specific and relevant answers:\n\n" +
          resources.map((r: any, index: number) => {
            const dept = r.departments?.name || "Unknown Department";
            const subj = r.subjects?.name || r.subject || "Unknown Subject";
            const resType = r.resource_types?.name || "Resource";
            const yearSem = r.year && r.semester ? `Year ${r.year}, Semester ${r.semester}` : "";
            
            return `${index + 1}. "${r.title}"
   - Subject: ${subj}
   - Department: ${dept}
   - Type: ${resType}
   ${yearSem ? `- Academic Period: ${yearSem}` : ""}
   ${r.description ? `- Description: ${r.description}` : ""}
   - File Type: ${r.file_type || "Unknown"}`;
          }).join("\n\n") +
          "\n\n--- END OF REFERENCE MATERIALS ---\n\n" +
          "When answering, reference these specific materials when relevant and provide context-aware explanations.";
      }
    }

    const systemPrompt = `You are an intelligent study assistant for EduResources, an educational resource platform. Your role is to:

1. Help students understand complex academic concepts across various subjects
2. Provide clear, concise explanations tailored to the student's level
3. Offer study tips and learning strategies
4. Answer questions about coursework, assignments, and exam preparation
5. Reference specific uploaded resources when available to give more targeted help

Guidelines:
- Be encouraging and supportive in your responses
- Break down complex topics into digestible parts
- Use examples and analogies to clarify concepts
- If you're unsure about something, be honest and suggest where they might find more information
- Keep responses focused and educational
- Adapt your explanation style based on the subject matter (e.g., more technical for STEM, more narrative for humanities)
- When reference materials are provided, use them to give specific, contextual answers
- Mention the specific resource titles when referencing them so students know which material you're discussing

Remember: You're here to help students learn and succeed in their academic journey!${resourceContext}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Study assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
