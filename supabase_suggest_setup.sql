-- Create the song_suggestions table
CREATE TABLE IF NOT EXISTS public.song_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    youtube_id TEXT UNIQUE NOT NULL,
    original_link TEXT NOT NULL,
    suggested_by TEXT DEFAULT 'Anonymous',
    request_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.song_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to song_suggestions
CREATE POLICY "Allow public insert on song_suggestions" 
ON public.song_suggestions FOR INSERT WITH CHECK (true);

-- Allow anonymous updates to request_count
CREATE POLICY "Allow public update on song_suggestions" 
ON public.song_suggestions FOR UPDATE USING (true);

-- For the Admin Panel:
-- Because we are protecting the admin panel at the application route level (Next.js),
-- and using the service_role key OR server-side fetching, we can bypass RLS for reading/deleting.
-- Alternatively, allow public select:
CREATE POLICY "Allow public read access on song_suggestions" 
ON public.song_suggestions FOR SELECT USING (true);

CREATE POLICY "Allow public delete on song_suggestions" 
ON public.song_suggestions FOR DELETE USING (true);
