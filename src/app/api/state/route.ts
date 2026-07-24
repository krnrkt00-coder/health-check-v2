import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const TABLE = "health_shared_state";
const ROW_ID = "00000000-0000-0000-0000-000000000001";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(TABLE)
      .select("people,records,updated_at")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      data ?? { people: [], records: [], updated_at: null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const payload = {
      id: ROW_ID,
      people: Array.isArray(body.people) ? body.people : [],
      records: Array.isArray(body.records) ? body.records : [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(TABLE).upsert(payload, {
      onConflict: "id",
    });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}