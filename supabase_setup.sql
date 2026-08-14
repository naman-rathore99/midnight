-- Create the shayari table
CREATE TABLE IF NOT EXISTS public.shayari (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Unknown',
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the shayari_likes table to prevent spam
CREATE TABLE IF NOT EXISTS public.shayari_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shayari_id UUID REFERENCES public.shayari(id) ON DELETE CASCADE,
    fingerprint TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data: Insert default Midnight Radio quotes
INSERT INTO public.shayari (text, author, like_count) VALUES
('Some songs don''t just play — they take you back to places you''ve never been.', 'Unknown', 12),
('The night is young, and so are the memories we refuse to let go.', 'Unknown', 8),
('Between the notes, I found the words I could never say.', 'Unknown', 15),
('We don''t listen to old songs. We listen to old feelings.', 'Unknown', 24),
('At 2 AM, every song becomes a confession.', 'Unknown', 19),
('Some nights, the sky hums the same tune as your heart.', 'Unknown', 7),
('The best conversations happen when the world is asleep.', 'Unknown', 11),
('Music doesn''t lie. If there is something to change in this world, it can only happen through music.', 'Unknown', 16),
('Every ending is just a melody waiting to be replayed.', 'Unknown', 5),
('Stars don''t compete with each other. They just shine.', 'Unknown', 22);

-- Set up Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE public.shayari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shayari_likes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to shayari
CREATE POLICY "Allow public read access on shayari" 
ON public.shayari FOR SELECT USING (true);

-- Allow anonymous inserts to shayari
CREATE POLICY "Allow public insert on shayari" 
ON public.shayari FOR INSERT WITH CHECK (true);

-- Allow anonymous update to shayari (for incrementing likes)
CREATE POLICY "Allow public update on shayari" 
ON public.shayari FOR UPDATE USING (true);

-- Allow anonymous read/insert/delete on shayari_likes
CREATE POLICY "Allow public read access on shayari_likes" 
ON public.shayari_likes FOR SELECT USING (true);

CREATE POLICY "Allow public insert on shayari_likes" 
ON public.shayari_likes FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on shayari_likes" 
ON public.shayari_likes FOR DELETE USING (true);
