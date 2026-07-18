import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL);
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let supabaseTableReady = false;
  let supabaseStatus = supabaseConfigured ? "checking" : "credentials-missing";

  if (supabaseConfigured) {
    try {
      const { error } = await createServerSupabaseClient().from("community_projects").select("id", { count: "exact", head: true });
      supabaseTableReady = !error;
      supabaseStatus = error ? "migration-required" : "ready";
    } catch {
      supabaseStatus = "connection-failed";
    }
  }

  return Response.json({
    status: openaiConfigured && supabaseTableReady ? "ready" : "configuration-required",
    openai: { configured: openaiConfigured, model: process.env.OPENAI_MODEL ?? null, forcedDemoFallback: process.env.DEMO_FALLBACK === "true" },
    supabase: { configured: supabaseConfigured, tableReady: supabaseTableReady, status: supabaseStatus },
    skool: { configured: Boolean(process.env.SKOOL_MCP_URL && process.env.SKOOL_MCP_TOKEN), optional: true },
  });
}
