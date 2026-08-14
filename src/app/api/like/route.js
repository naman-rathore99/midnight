import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// POST: Like or unlike a shayari
export async function POST(request) {
  try {
    const body = await request.json();
    const { shayariId, fingerprint } = body;

    // Validation
    if (!shayariId || !fingerprint) {
      return NextResponse.json(
        { error: "shayariId and fingerprint are required" },
        { status: 400 }
      );
    }

    if (!supabase) {
      // Mock response when Supabase isn't configured
      return NextResponse.json({
        liked: true,
        like_count: Math.floor(Math.random() * 30) + 1,
        message: "Like recorded locally (Supabase not configured)",
      });
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from("shayari_likes")
      .select("id")
      .eq("shayari_id", shayariId)
      .eq("fingerprint", fingerprint)
      .single();

    if (existingLike) {
      // Unlike: remove the like
      await supabase
        .from("shayari_likes")
        .delete()
        .eq("shayari_id", shayariId)
        .eq("fingerprint", fingerprint);

      // Decrement like count
      const { data: shayari } = await supabase
        .from("shayari")
        .select("like_count")
        .eq("id", shayariId)
        .single();

      const newCount = Math.max(0, (shayari?.like_count || 1) - 1);

      await supabase
        .from("shayari")
        .update({ like_count: newCount })
        .eq("id", shayariId);

      return NextResponse.json({
        liked: false,
        like_count: newCount,
        message: "Like removed",
      });
    } else {
      // Like: add the like
      await supabase.from("shayari_likes").insert({
        shayari_id: shayariId,
        fingerprint: fingerprint,
      });

      // Increment like count
      const { data: shayari } = await supabase
        .from("shayari")
        .select("like_count")
        .eq("id", shayariId)
        .single();

      const newCount = (shayari?.like_count || 0) + 1;

      await supabase
        .from("shayari")
        .update({ like_count: newCount })
        .eq("id", shayariId);

      return NextResponse.json({
        liked: true,
        like_count: newCount,
        message: "Liked!",
      });
    }
  } catch (err) {
    console.error("Error processing like:", err);
    return NextResponse.json(
      { error: "Failed to process like" },
      { status: 500 }
    );
  }
}
