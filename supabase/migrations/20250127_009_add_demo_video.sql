-- ========================================
-- UPDATE DEMO USERS: Add Example Video
-- ========================================
-- Description: Adds example YouTube video to all demo user profiles
-- Video: https://www.youtube.com/watch?v=p5SygzMSLhM

-- Update all demo users (those with "(demo)" in their name)
UPDATE public.profiles
SET contact_info = jsonb_set(
  COALESCE(contact_info, '{}'::jsonb),
  '{youtube}',
  '"https://www.youtube.com/watch?v=p5SygzMSLhM"'
)
WHERE full_name LIKE '%(demo)%';

-- Add comment
COMMENT ON COLUMN public.profiles.contact_info IS 'Contact information including social media and video links. Demo users include example YouTube video.';
