-- ========================================
-- UPDATE DEMO USERS: Add Example Video
-- ========================================
-- Description: Adds example YouTube video to all demo user profiles
-- Video: https://www.youtube.com/watch?v=p5SygzMSLhM

-- First, remove invalid Vimeo profile URLs (not video URLs) from demo users
UPDATE public.profiles
SET contact_info = contact_info - 'vimeo'
WHERE full_name LIKE '%(demo)%'
  AND contact_info->>'vimeo' IS NOT NULL
  AND contact_info->>'vimeo' NOT LIKE '%/video/%'
  AND contact_info->>'vimeo' NOT LIKE '%player.vimeo.com%';

-- Then add the example YouTube video to all demo users
UPDATE public.profiles
SET contact_info = jsonb_set(
  COALESCE(contact_info, '{}'::jsonb),
  '{youtube}',
  '"https://www.youtube.com/watch?v=p5SygzMSLhM"'
)
WHERE full_name LIKE '%(demo)%';

-- Add comment
COMMENT ON COLUMN public.profiles.contact_info IS 'Contact information including social media and video links. Demo users include example YouTube video.';
