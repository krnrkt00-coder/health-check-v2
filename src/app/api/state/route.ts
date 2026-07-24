import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const TABLE = "health_shared_state";
const ROW_ID = "singleton";

type AppState = {
  people: string[];
  records: unknown[];
  updated_at: string | null;
};

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
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

    const fallback: AppState = {
      people: [],
      records: [],
      updated_at: null,
    };

    return NextResponse.json(data ?? fallback);
  } catch (error: unknown) {
    console.error("GET /api/state failed:", error);
    return NextResponse.json(
      { error: formatError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const payload: AppState & { id: string } = {
      id: ROW_ID,
      people: Array.isArray(body?.people) ? body.people : [],
      records: Array.isArray(body?.records) ? body.records : [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("POST /api/state failed:", error);
    return NextResponse.json(
      { error: formatError(error) },
      { status: 500 }
    );
  }
}