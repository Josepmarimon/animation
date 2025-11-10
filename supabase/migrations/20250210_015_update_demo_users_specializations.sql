-- ========================================
-- Update Demo Users Specializations
-- ========================================
-- Description: Updates demo users with new comprehensive specializations
-- Note: Requires ENUM values to be committed first (run after 20250210_014)

-- Wallace Cooper (demo) - Stop Motion Animator + Character Designer
UPDATE public.profiles
SET specializations = ARRAY['stop_motion_animator'::animation_specialization, 'character_designer'::animation_specialization, 'puppet_designer'::animation_specialization]
WHERE id = 'a1111111-1111-1111-1111-111111111111'::uuid;

-- Anika Winters (demo) - Experimental Animation + Compositor
UPDATE public.profiles
SET specializations = ARRAY['experimental_animation'::animation_specialization, 'compositor_general'::animation_specialization, 'concept_artist'::animation_specialization, 'hybrid_techniques'::animation_specialization]
WHERE id = 'a2222222-2222-2222-2222-222222222222'::uuid;

-- Marcus Chen (demo) - Cinematographer + Lighting
UPDATE public.profiles
SET specializations = ARRAY['dop_stop_motion'::animation_specialization, 'lighting_designer'::animation_specialization, 'camera_operator_sm'::animation_specialization]
WHERE id = 'a3333333-3333-3333-3333-333333333333'::uuid;

-- Sofia Rodriguez (demo) - Character Designer + Fabricator
UPDATE public.profiles
SET specializations = ARRAY['character_designer'::animation_specialization, 'puppet_fabricator'::animation_specialization, 'model_maker'::animation_specialization, 'costume_designer_mini'::animation_specialization]
WHERE id = 'a4444444-4444-4444-4444-444444444444'::uuid;

-- Hiroshi Tanaka (demo) - Stop Motion Director + Storyboard
UPDATE public.profiles
SET specializations = ARRAY['stop_motion_director'::animation_specialization, 'storyboarder'::animation_specialization, 'stop_motion_animator'::animation_specialization, 'short_film'::animation_specialization]
WHERE id = 'a5555555-5555-5555-5555-555555555555'::uuid;

-- Emma O'Brien (demo) - Set Designer + Art Director
UPDATE public.profiles
SET specializations = ARRAY['art_director'::animation_specialization, 'set_builder'::animation_specialization, 'concept_artist'::animation_specialization, 'stop_motion_animator'::animation_specialization]
WHERE id = 'a6666666-6666-6666-6666-666666666666'::uuid;

-- Lars Nielsen (demo) - Rigging + Armature Maker
UPDATE public.profiles
SET specializations = ARRAY['armature_maker'::animation_specialization, 'puppet_fabricator'::animation_specialization, 'technical_artist'::animation_specialization]
WHERE id = 'a7777777-7777-7777-7777-777777777777'::uuid;

-- Isabella Rossi (demo) - Director + Visual Storyteller
UPDATE public.profiles
SET specializations = ARRAY['stop_motion_director'::animation_specialization, 'storyboarder'::animation_specialization, 'concept_artist'::animation_specialization, 'art_director'::animation_specialization]
WHERE id = 'a8888888-8888-8888-8888-888888888888'::uuid;

-- Oliver Smith (demo) - Texture Artist + Material Specialist
UPDATE public.profiles
SET specializations = ARRAY['model_maker'::animation_specialization, 'set_builder'::animation_specialization, 'matte_painter'::animation_specialization]
WHERE id = 'a9999999-9999-9999-9999-999999999999'::uuid;

-- Yuki Yamamoto (demo) - Composer + Sound Designer
UPDATE public.profiles
SET specializations = ARRAY['sound_designer'::animation_specialization, 'music_composer'::animation_specialization, 'foley_artist'::animation_specialization]
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;
