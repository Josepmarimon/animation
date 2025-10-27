-- ========================================
-- MIGRATION 006: Storage Buckets for Profile Images
-- ========================================
-- Description: Creates storage buckets for profile avatars and portfolio images
-- Project: Animation Professionals Directory
-- Date: 2025-01-27

-- ----------------------------------------
-- 1. CREATE STORAGE BUCKETS
-- ----------------------------------------

-- Bucket for profile avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Bucket for portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- ----------------------------------------
-- 2. STORAGE POLICIES FOR AVATARS
-- ----------------------------------------

-- Allow users to view all avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ----------------------------------------
-- 3. STORAGE POLICIES FOR PORTFOLIO
-- ----------------------------------------

-- Allow users to view all portfolio images (public read)
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload their own portfolio images
CREATE POLICY "Users can upload their own portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own portfolio images
CREATE POLICY "Users can update their own portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own portfolio images
CREATE POLICY "Users can delete their own portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ----------------------------------------
-- 4. HELPER FUNCTIONS
-- ----------------------------------------

-- Function to generate a unique filename
CREATE OR REPLACE FUNCTION public.generate_unique_filename(
  user_id UUID,
  original_filename TEXT,
  bucket_name TEXT
)
RETURNS TEXT AS $$
DECLARE
  extension TEXT;
  unique_name TEXT;
BEGIN
  -- Extract file extension
  extension := substring(original_filename from '\.[^.]*$');

  -- Generate unique filename: user_id/timestamp_random.ext
  unique_name := user_id::text || '/' ||
                 extract(epoch from now())::bigint::text || '_' ||
                 substr(md5(random()::text), 1, 8) ||
                 extension;

  RETURN unique_name;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_unique_filename IS 'Generates a unique filename for storage uploads';
