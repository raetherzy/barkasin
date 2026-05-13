import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null, profile: null }, { status: 200 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .single();

    return NextResponse.json(
      {
        user: { id: user.id },
        profile: profile ?? null,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }
}

