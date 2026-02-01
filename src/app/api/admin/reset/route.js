import { getAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== process.env.RESET_ADMIN_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminClient();
    const { data } = await supabase
      .from("game_settings")
      .select("reset_version")
      .eq("id", 1)
      .single();

    const next = (data?.reset_version ?? 0) + 1;

    await supabase
      .from("game_settings")
      .upsert({ id: 1, reset_version: next }, { onConflict: "id" });

    return Response.json({ resetVersion: next });
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
