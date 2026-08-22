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

    let { data, count, error } = await query
      .order('like_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Auto-seed a default playlist if the database is completely empty
    if (!search && count === 0 && page === 1) {
      const defaultPlaylist = {
        playlist_id: 'PLrQ2C4c2P-7rS2jL86dZ-2yWp3XwWl38s', // Example lofi playlist
        title: 'Midnight Lofi Radio (Demo)',
        suggested_by: 'System',
        like_count: 5
      };
      
      const { error: seedError } = await supabase
        .from('accepted_playlists')
        .insert(defaultPlaylist);
        
      if (!seedError) {
        data = [defaultPlaylist];
        count = 1;
      }
    }

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

