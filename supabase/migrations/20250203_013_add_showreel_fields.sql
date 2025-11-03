-- Migration: Add specific showreel video fields to profiles
-- Description: Since contact_info is stored as JSONB in profiles.contact_info,
-- this migration adds example documentation for the showreel fields structure.
-- The actual fields will be stored in the contact_info JSONB column.

-- No ALTER TABLE needed - contact_info is a JSONB column in profiles table
-- The showreel_youtube and showreel_vimeo fields will be stored as:
-- profiles.contact_info = {
--   "website": "...",
--   "showreel_youtube": "https://www.youtube.com/watch?v=VIDEO_ID",
--   "showreel_vimeo": "https://vimeo.com/VIDEO_ID",
--   ...
-- }

-- Add comment to document the JSONB structure
COMMENT ON COLUMN public.profiles.contact_info IS 'JSONB object containing contact information including: website, linkedin, instagram, artstation, behance, vimeo, youtube (channel links), showreel_youtube (specific video URL), showreel_vimeo (specific video URL)';
