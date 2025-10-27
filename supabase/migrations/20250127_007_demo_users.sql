-- ========================================
-- DEMO USERS: Stop-Motion Professionals
-- ========================================
-- Description: Creates 10 demo users with stop-motion specialization
-- Note: All users have "(demo)" in their name for easy identification and deletion
-- Images: External URLs from Unsplash (for demo purposes only)

-- Demo User 1: Wallace Cooper (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'wallace.cooper.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Wallace Cooper (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::uuid,
  'wallace.cooper.demo@example.com',
  'Wallace Cooper (demo)',
  'Award-winning stop-motion animator with 15 years of experience creating clay animation masterpieces. Specialized in character-driven narratives and intricate set design.',
  'https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=400&q=80',
  'United Kingdom',
  'Bristol',
  ARRAY['stop_motion'::animation_specialization, 'character_design'::animation_specialization],
  '{"website": "https://wallacecooper-demo.com", "instagram": "https://instagram.com/wallacecooper_demo", "vimeo": "https://vimeo.com/wallacecooper"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1620416588408-5f0c6d149061?w=800&q=80", "title": "The Clay Chronicles", "description": "A whimsical journey through a miniature world", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", "title": "Forest Tales", "description": "Nature-inspired clay animation series"}'::jsonb
  ],
  true
);

-- Demo User 2: Anika Winters (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a2222222-2222-2222-2222-222222222222'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'anika.winters.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Anika Winters (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a2222222-2222-2222-2222-222222222222'::uuid,
  'anika.winters.demo@example.com',
  'Anika Winters (demo)',
  'Experimental stop-motion artist pushing the boundaries of the medium. My work combines traditional techniques with modern digital compositing.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'Germany',
  'Berlin',
  ARRAY['stop_motion'::animation_specialization, 'compositing'::animation_specialization, 'concept_art'::animation_specialization],
  '{"website": "https://anikawinters-demo.art", "instagram": "https://instagram.com/anikawinters_demo", "artstation": "https://artstation.com/anikawinters"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", "title": "Digital Dreams", "description": "Stop-motion meets digital art", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&q=80", "title": "Abstract Forms", "description": "Exploring shape and movement"}'::jsonb
  ],
  true
);

-- Demo User 3: Marcus Chen (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a3333333-3333-3333-3333-333333333333'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'marcus.chen.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Marcus Chen (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a3333333-3333-3333-3333-333333333333'::uuid,
  'marcus.chen.demo@example.com',
  'Marcus Chen (demo)',
  'Stop-motion cinematographer and lighting specialist. I create atmospheric worlds through careful lighting and camera work in miniature environments.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'Canada',
  'Vancouver',
  ARRAY['stop_motion'::animation_specialization, 'lighting'::animation_specialization],
  '{"website": "https://marcuschen-demo.com", "vimeo": "https://vimeo.com/marcuschen", "youtube": "https://youtube.com/marcuschen_demo"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80", "title": "Midnight Studio", "description": "Exploring dramatic lighting in stop-motion", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80", "title": "Neon Nights", "description": "Urban miniatures with vibrant lighting"}'::jsonb
  ],
  true
);

-- Demo User 4: Sofia Rodriguez (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a4444444-4444-4444-4444-444444444444'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'sofia.rodriguez.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Sofia Rodriguez (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a4444444-4444-4444-4444-444444444444'::uuid,
  'sofia.rodriguez.demo@example.com',
  'Sofia Rodriguez (demo)',
  'Character designer and fabricator for stop-motion productions. I craft expressive puppets and props that bring stories to life frame by frame.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  'Spain',
  'Barcelona',
  ARRAY['stop_motion'::animation_specialization, 'character_design'::animation_specialization, 'modeling'::animation_specialization],
  '{"instagram": "https://instagram.com/sofiarodriguez_demo", "behance": "https://behance.net/sofiarodriguez", "artstation": "https://artstation.com/sofiarodriguez"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1615680022647-67d346e71026?w=800&q=80", "title": "Character Workshop", "description": "Handcrafted stop-motion puppets", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1580894908361-967195033215?w=800&q=80", "title": "Tiny Worlds", "description": "Miniature prop design and fabrication"}'::jsonb
  ],
  true
);

-- Demo User 5: Hiroshi Tanaka (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a5555555-5555-5555-5555-555555555555'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'hiroshi.tanaka.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Hiroshi Tanaka (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a5555555-5555-5555-5555-555555555555'::uuid,
  'hiroshi.tanaka.demo@example.com',
  'Hiroshi Tanaka (demo)',
  'Japanese stop-motion animator combining traditional puppet techniques with contemporary storytelling. 20+ years creating award-winning short films.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'Japan',
  'Tokyo',
  ARRAY['stop_motion'::animation_specialization, 'storyboard'::animation_specialization],
  '{"website": "https://hiroshitanaka-demo.jp", "vimeo": "https://vimeo.com/hiroshitanaka", "instagram": "https://instagram.com/hiroshitanaka_demo"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80", "title": "Sakura Dreams", "description": "A poetic journey through seasons", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80", "title": "Urban Legends", "description": "Tokyo-inspired miniature narratives"}'::jsonb
  ],
  true
);

-- Demo User 6: Emma O'Brien (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a6666666-6666-6666-6666-666666666666'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'emma.obrien.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Emma O''Brien (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a6666666-6666-6666-6666-666666666666'::uuid,
  'emma.obrien.demo@example.com',
  'Emma O''Brien (demo)',
  'Set designer and art director for stop-motion animation. I build intricate miniature worlds with attention to every tiny detail.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
  'Ireland',
  'Dublin',
  ARRAY['stop_motion'::animation_specialization, 'concept_art'::animation_specialization],
  '{"website": "https://emmaobrien-demo.ie", "instagram": "https://instagram.com/emmaobrien_demo", "behance": "https://behance.net/emmaobrien"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1615680022647-67d346e71026?w=800&q=80", "title": "Celtic Miniatures", "description": "Irish folklore in stop-motion", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80", "title": "Coastal Stories", "description": "Seaside-inspired set designs"}'::jsonb
  ],
  true
);

-- Demo User 7: Lars Nielsen (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a7777777-7777-7777-7777-777777777777'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'lars.nielsen.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Lars Nielsen (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a7777777-7777-7777-7777-777777777777'::uuid,
  'lars.nielsen.demo@example.com',
  'Lars Nielsen (demo)',
  'Technical animator specializing in rigging and armature design for stop-motion puppets. Creating flexible, expressive characters for animation.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
  'Denmark',
  'Copenhagen',
  ARRAY['stop_motion'::animation_specialization, 'rigging'::animation_specialization],
  '{"website": "https://larsnielsen-demo.dk", "youtube": "https://youtube.com/larsnielsen_demo", "linkedin": "https://linkedin.com/in/larsnielsen"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&q=80", "title": "Armature Evolution", "description": "Advanced puppet rigging techniques", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80", "title": "Movement Studies", "description": "Exploring puppet articulation"}'::jsonb
  ],
  true
);

-- Demo User 8: Isabella Rossi (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a8888888-8888-8888-8888-888888888888'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'isabella.rossi.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Isabella Rossi (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a8888888-8888-8888-8888-888888888888'::uuid,
  'isabella.rossi.demo@example.com',
  'Isabella Rossi (demo)',
  'Stop-motion director and visual storyteller. My films explore human emotions through the unique charm of frame-by-frame animation.',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
  'Italy',
  'Milan',
  ARRAY['stop_motion'::animation_specialization, 'storyboard'::animation_specialization, 'concept_art'::animation_specialization],
  '{"website": "https://isabellarossi-demo.it", "vimeo": "https://vimeo.com/isabellarossi", "instagram": "https://instagram.com/isabellarossi_demo"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80", "title": "Emotional Landscapes", "description": "A visual poem in stop-motion", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80", "title": "Italian Tales", "description": "Stories from Mediterranean culture"}'::jsonb
  ],
  true
);

-- Demo User 9: Oliver Smith (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'a9999999-9999-9999-9999-999999999999'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'oliver.smith.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Oliver Smith (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'a9999999-9999-9999-9999-999999999999'::uuid,
  'oliver.smith.demo@example.com',
  'Oliver Smith (demo)',
  'Texture artist and material specialist for stop-motion. I create realistic surfaces and weathering effects that enhance the tactile quality of miniature worlds.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  'United States',
  'Portland',
  ARRAY['stop_motion'::animation_specialization, 'texturing'::animation_specialization],
  '{"website": "https://oliversmith-demo.com", "artstation": "https://artstation.com/oliversmith", "instagram": "https://instagram.com/oliversmith_demo"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1620416588408-5f0c6d149061?w=800&q=80", "title": "Material Studies", "description": "Exploring textures in miniature", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", "title": "Weathered Worlds", "description": "Creating aged and lived-in environments"}'::jsonb
  ],
  true
);

-- Demo User 10: Yuki Yamamoto (demo)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'yuki.yamamoto.demo@example.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Yuki Yamamoto (demo)"}'::jsonb,
  false,
  'authenticated'
);

INSERT INTO public.profiles (
  id,
  email,
  full_name,
  bio,
  avatar_url,
  country,
  city,
  specializations,
  contact_info,
  portfolio_projects,
  is_public
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'yuki.yamamoto.demo@example.com',
  'Yuki Yamamoto (demo)',
  'Composer and sound designer for stop-motion animation. I create immersive audio landscapes that complement the unique rhythm of frame-by-frame storytelling.',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  'Japan',
  'Osaka',
  ARRAY['stop_motion'::animation_specialization, 'motion_graphics'::animation_specialization],
  '{"website": "https://yukiyamamoto-demo.jp", "youtube": "https://youtube.com/yukiyamamoto_demo", "vimeo": "https://vimeo.com/yukiyamamoto"}'::jsonb,
  ARRAY[
    '{"id": "1", "url": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", "title": "Sound & Vision", "description": "Audio-visual experiments in stop-motion", "is_featured": true}'::jsonb,
    '{"id": "2", "url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80", "title": "Rhythmic Worlds", "description": "Exploring music and movement"}'::jsonb
  ],
  true
);

-- Add comment for future reference
COMMENT ON COLUMN public.profiles.full_name IS 'Full name of the user. Demo users include "(demo)" suffix for easy identification';
