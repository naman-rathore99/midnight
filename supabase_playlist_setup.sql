-- 1. Create the new accepted_playlists table
CREATE TABLE IF NOT EXISTS public.accepted_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    suggested_by TEXT,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Update song_suggestions to accommodate playlist_id (rename column for clarity)
ALTER TABLE IF EXISTS public.song_suggestions RENAME COLUMN youtube_id TO playlist_id;

-- 3. Set up Row Level Security (RLS) for accepted_playlists
ALTER TABLE public.accepted_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on accepted_playlists" 
    ON public.accepted_playlists FOR SELECT 
    USING (true);

CREATE POLICY "Allow public update on accepted_playlists likes" 
    ON public.accepted_playlists FOR UPDATE 
    USING (true);

CREATE POLICY "Allow service role insert on accepted_playlists" 
    ON public.accepted_playlists FOR INSERT 
    WITH CHECK (true);
    
CREATE POLICY "Allow service role delete on accepted_playlists" 
    ON public.accepted_playlists FOR DELETE 
    USING (true);

