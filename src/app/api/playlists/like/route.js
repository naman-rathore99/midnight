import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id || !supabase) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Call Supabase RPC or use a simple fetch-then-update
    // Note: In production, an RPC function is better to prevent race conditions.
    const { data: playlist, error: fetchError } = await supabase
      .from('accepted_playlists')
      .select('like_count')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newCount = (playlist.like_count || 0) + 1;

    const { data, error: updateError } = await supabase
      .from('accepted_playlists')
      .update({ like_count: newCount })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error liking playlist:", error);
    return NextResponse.json({ error: "Failed to like playlist" }, { status: 500 });
  }
}

