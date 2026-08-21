import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (!supabase) {
      return NextResponse.json({ data: [], count: 0, message: "Supabase not configured" });
    }

    let query = supabase
      .from('accepted_playlists')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, count, error } = await query
      .order('like_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

