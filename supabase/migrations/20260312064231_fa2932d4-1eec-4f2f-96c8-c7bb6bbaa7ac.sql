
-- Create RSVP table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  attending BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert rsvps" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read rsvps" ON public.rsvps FOR SELECT USING (true);

-- Create wedding photos table
CREATE TABLE public.wedding_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uploader_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upload photos" ON public.wedding_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view photos" ON public.wedding_photos FOR SELECT USING (true);

-- Create storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true);

CREATE POLICY "Anyone can upload wedding photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-photos');
CREATE POLICY "Anyone can view wedding photos" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-photos');
