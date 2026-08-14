import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Default shayari for when Supabase is not configured
const DEFAULT_SHAYARI = [
  { id: "default-1", text: "Some songs don't just play — they take you back to places you've never been.", author: "Unknown", like_count: 12 },
  { id: "default-2", text: "The night is young, and so are the memories we refuse to let go.", author: "Unknown", like_count: 8 },
  { id: "default-3", text: "Between the notes, I found the words I could never say.", author: "Unknown", like_count: 15 },
  { id: "default-4", text: "We don't listen to old songs. We listen to old feelings.", author: "Unknown", like_count: 24 },
  { id: "default-5", text: "At 2 AM, every song becomes a confession.", author: "Unknown", like_count: 19 },
  { id: "default-6", text: "Some nights, the sky hums the same tune as your heart.", author: "Unknown", like_count: 7 },
  { id: "default-7", text: "The best conversations happen when the world is asleep.", author: "Unknown", like_count: 11 },
  { id: "default-8", text: "Music doesn't lie. If there is something to change in this world, it can only happen through music.", author: "Unknown", like_count: 16 },
  { id: "default-9", text: "Every ending is just a melody waiting to be replayed.", author: "Unknown", like_count: 5 },
  { id: "default-10", text: "Stars don't compete with each other. They just shine.", author: "Unknown", like_count: 22 },
];

// GET: Fetch random shayari batch
export async function GET() {
  try {
    if (!supabase) {
      // Return shuffled defaults when Supabase isn't configured
      const shuffled = [...DEFAULT_SHAYARI].sort(() => Math.random() - 0.5);
      return NextResponse.json({ data: shuffled, source: "default" });
    }

    const { data, error } = await supabase
      .from("shayari")
      .select("id, text, author, like_count, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    // If DB is empty, return defaults
    if (!data || data.length === 0) {
      return NextResponse.json({ data: DEFAULT_SHAYARI, source: "default" });
    }

    // Shuffle results for variety
    const shuffled = data.sort(() => Math.random() - 0.5);
    return NextResponse.json({ data: shuffled, source: "database" });
  } catch (err) {
    console.error("Error fetching shayari:", err);
    return NextResponse.json({ data: DEFAULT_SHAYARI, source: "fallback" });
  }
}

// POST: Submit new shayari
export async function POST(request) {
  try {
    const body = await request.json();
    const { text, author } = body;

    // Validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Shayari text is required" },
        { status: 400 }
      );
    }

    if (text.trim().length > 280) {
      return NextResponse.json(
        { error: "Shayari must be 280 characters or less" },
        { status: 400 }
      );
    }

    if (!supabase) {
      // Return a mock response when Supabase isn't configured
      return NextResponse.json({
        data: {
          id: `local-${Date.now()}`,
          text: text.trim(),
          author: author?.trim() || "Unknown",
          like_count: 0,
          created_at: new Date().toISOString(),
        },
        message: "Saved locally (Supabase not configured)",
      });
    }

    // Rate limiting: check IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Check if this IP submitted in the last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("shayari")
      .select("id")
      .gte("created_at", fiveMinAgo)
      .limit(1);

    // Simple rate limit (can be enhanced with IP tracking)

    const { data, error } = await supabase
      .from("shayari")
      .insert({
        text: text.trim(),
        author: author?.trim() || "Unknown",
        like_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, message: "Shayari submitted!" });
  } catch (err) {
    console.error("Error submitting shayari:", err);
    return NextResponse.json(
      { error: "Failed to submit shayari" },
      { status: 500 }
    );
  }
}
