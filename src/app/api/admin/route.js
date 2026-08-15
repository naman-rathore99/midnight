import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Authentication Helper
function isAuthenticated(request) {
  const authHeader = request.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) return false; // If no password set, reject all
  if (authHeader !== `Bearer ${adminPassword}`) return false;
  
  return true;
}

// GET: Fetch all song suggestions
export async function GET(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await supabase
      .from("song_suggestions")
      .select("*")
      .order("request_count", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

// DELETE: Remove a suggestion
export async function DELETE(request) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Suggestion ID is required" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ message: "Deleted locally (Supabase not configured)" });
    }

    const { error } = await supabase
      .from("song_suggestions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Suggestion deleted successfully" });
  } catch (err) {
    console.error("Error deleting suggestion:", err);
    return NextResponse.json({ error: "Failed to delete suggestion" }, { status: 500 });
  }
}
