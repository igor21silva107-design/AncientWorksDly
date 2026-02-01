import { getAdminClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("game_settings")
      .select("reset_version")
      .eq("id", 1)
      .single();

    if (error || !data) {
      const { data: seeded } = await supabase
        .from("game_settings")
        .upsert({ id: 1, reset_version: 0 }, { onConflict: "id" })
        .select("reset_version")
        .single();

      return Response.json({ resetVersion: seeded?.reset_version ?? 0 });
    }

    return Response.json({ resetVersion: data.reset_version ?? 0 });
  } catch {
    return Response.json({ resetVersion: 0 }, { status: 200 });
  }
}
