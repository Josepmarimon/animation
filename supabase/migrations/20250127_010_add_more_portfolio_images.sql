-- ========================================
-- UPDATE DEMO USERS: Add More Portfolio Images
-- ========================================
-- Description: Distributes portfolio images among demo users so each has multiple images

-- Wallace Cooper (demo) - User 1
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/1-wallace-portfolio.png", "title": "The Clay Chronicles", "description": "A whimsical journey through a miniature world", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/2-anika-portfolio.png", "title": "Character Studies", "description": "Detailed stop-motion character design"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/3-marcus-portfolio.png", "title": "Lighting Experiments", "description": "Exploring atmosphere in miniature scenes"}'::jsonb
]
WHERE id = 'a1111111-1111-1111-1111-111111111111'::uuid;

-- Anika Winters (demo) - User 2
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/2-anika-portfolio.png", "title": "Digital Dreams", "description": "Stop-motion meets digital art", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/4-sofia-portfolio.png", "title": "Abstract Forms", "description": "Exploring shape and movement"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/5-hiroshi-portfolio.png", "title": "Minimalist Motion", "description": "Simplicity in stop-motion"}'::jsonb
]
WHERE id = 'a2222222-2222-2222-2222-222222222222'::uuid;

-- Marcus Chen (demo) - User 3
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/3-marcus-portfolio.png", "title": "Midnight Studio", "description": "Exploring dramatic lighting in stop-motion", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/6-emma-portfolio.png", "title": "Neon Nights", "description": "Urban miniatures with vibrant lighting"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/7-lars-portfolio.png", "title": "Shadow Play", "description": "Working with dramatic shadows"}'::jsonb
]
WHERE id = 'a3333333-3333-3333-3333-333333333333'::uuid;

-- Sofia Rodriguez (demo) - User 4
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/4-sofia-portfolio.png", "title": "Character Workshop", "description": "Handcrafted stop-motion puppets", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/8-isabella-portfolio.png", "title": "Tiny Worlds", "description": "Miniature prop design and fabrication"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/1-wallace-portfolio.png", "title": "Puppet Mechanics", "description": "Engineering expressive puppets"}'::jsonb
]
WHERE id = 'a4444444-4444-4444-4444-444444444444'::uuid;

-- Hiroshi Tanaka (demo) - User 5
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/5-hiroshi-portfolio.png", "title": "Sakura Dreams", "description": "A poetic journey through seasons", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/2-anika-portfolio.png", "title": "Urban Legends", "description": "Tokyo-inspired miniature narratives"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/6-emma-portfolio.png", "title": "Nature Spirits", "description": "Japanese folklore in stop-motion"}'::jsonb
]
WHERE id = 'a5555555-5555-5555-5555-555555555555'::uuid;

-- Emma O'Brien (demo) - User 6
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/6-emma-portfolio.png", "title": "Celtic Miniatures", "description": "Irish folklore in stop-motion", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/7-lars-portfolio.png", "title": "Coastal Stories", "description": "Seaside-inspired set designs"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/3-marcus-portfolio.png", "title": "Mystical Landscapes", "description": "Creating magical environments"}'::jsonb
]
WHERE id = 'a6666666-6666-6666-6666-666666666666'::uuid;

-- Lars Nielsen (demo) - User 7
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/7-lars-portfolio.png", "title": "Armature Evolution", "description": "Advanced puppet rigging techniques", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/8-isabella-portfolio.png", "title": "Movement Studies", "description": "Exploring puppet articulation"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/4-sofia-portfolio.png", "title": "Technical Designs", "description": "Engineering for animation"}'::jsonb
]
WHERE id = 'a7777777-7777-7777-7777-777777777777'::uuid;

-- Isabella Rossi (demo) - User 8
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/8-isabella-portfolio.png", "title": "Emotional Landscapes", "description": "A visual poem in stop-motion", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/1-wallace-portfolio.png", "title": "Italian Tales", "description": "Stories from Mediterranean culture"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/5-hiroshi-portfolio.png", "title": "Color & Mood", "description": "Exploring emotion through color"}'::jsonb
]
WHERE id = 'a8888888-8888-8888-8888-888888888888'::uuid;

-- Oliver Smith (demo) - User 9
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/1-wallace-portfolio.png", "title": "Material Studies", "description": "Exploring textures in miniature", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/3-marcus-portfolio.png", "title": "Weathered Worlds", "description": "Creating aged and lived-in environments"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/6-emma-portfolio.png", "title": "Surface Details", "description": "Macro photography of miniatures"}'::jsonb
]
WHERE id = 'a9999999-9999-9999-9999-999999999999'::uuid;

-- Yuki Yamamoto (demo) - User 10
UPDATE public.profiles
SET portfolio_projects = ARRAY[
  '{"id": "1", "url": "/demo-profiles/2-anika-portfolio.png", "title": "Sound & Vision", "description": "Audio-visual experiments in stop-motion", "is_featured": true}'::jsonb,
  '{"id": "2", "url": "/demo-profiles/4-sofia-portfolio.png", "title": "Rhythmic Worlds", "description": "Exploring music and movement"}'::jsonb,
  '{"id": "3", "url": "/demo-profiles/7-lars-portfolio.png", "title": "Motion Graphics", "description": "Blending stop-motion with digital effects"}'::jsonb
]
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

-- Add comment
COMMENT ON COLUMN public.profiles.portfolio_projects IS 'Array of portfolio projects with images, titles, and descriptions. Demo users now have 3 images each.';
