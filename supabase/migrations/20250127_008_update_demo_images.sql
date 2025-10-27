-- ========================================
-- UPDATE DEMO USERS: Local Images
-- ========================================
-- Description: Updates demo user profiles to use local images instead of external Unsplash URLs
-- Note: Images are stored in /public/demo-profiles/ directory

-- Update Wallace Cooper (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/1-wallace-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/1-wallace-portfolio.png", "title": "The Clay Chronicles", "description": "A whimsical journey through a miniature world", "is_featured": true}'::jsonb
  ]
WHERE id = 'a1111111-1111-1111-1111-111111111111'::uuid;

-- Update Anika Winters (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/2-anika-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/2-anika-portfolio.png", "title": "Digital Dreams", "description": "Stop-motion meets digital art", "is_featured": true}'::jsonb
  ]
WHERE id = 'a2222222-2222-2222-2222-222222222222'::uuid;

-- Update Marcus Chen (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/3-marcus-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/3-marcus-portfolio.png", "title": "Midnight Studio", "description": "Exploring dramatic lighting in stop-motion", "is_featured": true}'::jsonb
  ]
WHERE id = 'a3333333-3333-3333-3333-333333333333'::uuid;

-- Update Sofia Rodriguez (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/4-sofia-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/4-sofia-portfolio.png", "title": "Character Workshop", "description": "Handcrafted stop-motion puppets", "is_featured": true}'::jsonb
  ]
WHERE id = 'a4444444-4444-4444-4444-444444444444'::uuid;

-- Update Hiroshi Tanaka (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/5-hiroshi-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/5-hiroshi-portfolio.png", "title": "Sakura Dreams", "description": "A poetic journey through seasons", "is_featured": true}'::jsonb
  ]
WHERE id = 'a5555555-5555-5555-5555-555555555555'::uuid;

-- Update Emma O'Brien (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/6-emma-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/6-emma-portfolio.png", "title": "Celtic Miniatures", "description": "Irish folklore in stop-motion", "is_featured": true}'::jsonb
  ]
WHERE id = 'a6666666-6666-6666-6666-666666666666'::uuid;

-- Update Lars Nielsen (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/7-lars-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/7-lars-portfolio.png", "title": "Armature Evolution", "description": "Advanced puppet rigging techniques", "is_featured": true}'::jsonb
  ]
WHERE id = 'a7777777-7777-7777-7777-777777777777'::uuid;

-- Update Isabella Rossi (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/8-isabella-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/8-isabella-portfolio.png", "title": "Emotional Landscapes", "description": "A visual poem in stop-motion", "is_featured": true}'::jsonb
  ]
WHERE id = 'a8888888-8888-8888-8888-888888888888'::uuid;

-- Update Oliver Smith (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/9-oliver-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/9-oliver-avatar.png", "title": "Material Studies", "description": "Exploring textures in miniature", "is_featured": true}'::jsonb
  ]
WHERE id = 'a9999999-9999-9999-9999-999999999999'::uuid;

-- Update Yuki Yamamoto (demo)
UPDATE public.profiles
SET
  avatar_url = '/demo-profiles/10-yuki-avatar.png',
  portfolio_projects = ARRAY[
    '{"id": "1", "url": "/demo-profiles/10-yuki-avatar.png", "title": "Sound & Vision", "description": "Audio-visual experiments in stop-motion", "is_featured": true}'::jsonb
  ]
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

-- Add comment
COMMENT ON TABLE public.profiles IS 'User profiles with avatar and portfolio images. Demo users use local images from /public/demo-profiles/';
