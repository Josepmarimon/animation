-- Migration: Create Walls System (Thematic Walls with Posts, Likes, Comments)
-- Description: System for admin-managed thematic walls where users can post content

-- ============================================================================
-- 1. CREATE WALLS TABLE
-- ============================================================================
-- Stores different thematic walls (boards) that can be created by admins

CREATE TABLE IF NOT EXISTS public.walls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- URL-friendly name (e.g., 'general', 'jobs')
  description TEXT,

  -- Visual customization
  icon TEXT, -- Emoji or icon name (e.g., '💬', 'briefcase')
  color TEXT DEFAULT '#6366f1', -- Hex color for theming

  -- Status and ordering
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Metadata
  posts_count INTEGER DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for walls
CREATE INDEX idx_walls_is_active ON public.walls(is_active) WHERE is_active = true;
CREATE INDEX idx_walls_display_order ON public.walls(display_order);
CREATE INDEX idx_walls_slug ON public.walls(slug);

-- ============================================================================
-- 2. CREATE POSTS TABLE
-- ============================================================================
-- User-generated posts within walls

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Relationships
  wall_id UUID REFERENCES public.walls ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  -- Content
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 5000),
  media_urls TEXT[] DEFAULT '{}', -- Array of image/video URLs from storage

  -- Metadata
  is_public BOOLEAN DEFAULT true NOT NULL,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  comments_count INTEGER DEFAULT 0 NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for posts
CREATE INDEX idx_posts_wall_id ON public.posts(wall_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_is_public ON public.posts(is_public) WHERE is_public = true;
CREATE INDEX idx_posts_wall_public ON public.posts(wall_id, created_at DESC) WHERE is_public = true;

-- ============================================================================
-- 3. CREATE POST_LIKES TABLE
-- ============================================================================
-- Tracks which users liked which posts

CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  post_id UUID REFERENCES public.posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Prevent duplicate likes
  UNIQUE(post_id, user_id)
);

-- Indexes for post_likes
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- ============================================================================
-- 4. CREATE POST_COMMENTS TABLE
-- ============================================================================
-- Comments on posts

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  post_id UUID REFERENCES public.posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,

  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for post_comments
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX idx_post_comments_created_at ON public.post_comments(created_at);

-- ============================================================================
-- 5. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_walls_updated_at
  BEFORE UPDATE ON public.walls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. CREATE FUNCTIONS TO UPDATE COUNTERS
-- ============================================================================

-- Update posts_count in walls when posts are added/removed
CREATE OR REPLACE FUNCTION update_wall_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.walls
    SET posts_count = posts_count + 1
    WHERE id = NEW.wall_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.walls
    SET posts_count = posts_count - 1
    WHERE id = OLD.wall_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wall_posts_count_trigger
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_wall_posts_count();

-- Update likes_count in posts when likes are added/removed
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();

-- Update comments_count in posts when comments are added/removed
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comments_count();

-- ============================================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.walls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. CREATE RLS POLICIES FOR WALLS
-- ============================================================================

-- SELECT: Everyone can view active walls
CREATE POLICY "Anyone can view active walls"
  ON public.walls FOR SELECT
  USING (is_active = true);

-- SELECT: Admins can view all walls
CREATE POLICY "Admins can view all walls"
  ON public.walls FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT: Only admins can create walls
CREATE POLICY "Only admins can create walls"
  ON public.walls FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- UPDATE: Only admins can update walls
CREATE POLICY "Only admins can update walls"
  ON public.walls FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- DELETE: Only admins can delete walls
CREATE POLICY "Only admins can delete walls"
  ON public.walls FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 9. CREATE RLS POLICIES FOR POSTS
-- ============================================================================

-- SELECT: Anyone can view public posts in active walls
CREATE POLICY "Anyone can view public posts"
  ON public.posts FOR SELECT
  USING (
    is_public = true
    AND EXISTS (
      SELECT 1 FROM public.walls
      WHERE id = posts.wall_id AND is_active = true
    )
  );

-- SELECT: Users can view their own posts
CREATE POLICY "Users can view their own posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- SELECT: Admins can view all posts
CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT: Authenticated users can create posts in active walls
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.walls
      WHERE id = wall_id AND is_active = true
    )
  );

-- UPDATE: Users can update their own posts
CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- DELETE: Admins can delete any post
CREATE POLICY "Admins can delete any post"
  ON public.posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 10. CREATE RLS POLICIES FOR POST_LIKES
-- ============================================================================

-- SELECT: Anyone can view likes
CREATE POLICY "Anyone can view likes"
  ON public.post_likes FOR SELECT
  USING (true);

-- INSERT: Authenticated users can like posts
CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can unlike their own likes
CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 11. CREATE RLS POLICIES FOR POST_COMMENTS
-- ============================================================================

-- SELECT: Anyone can view comments on public posts
CREATE POLICY "Anyone can view comments"
  ON public.post_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_comments.post_id AND is_public = true
    )
  );

-- INSERT: Authenticated users can comment
CREATE POLICY "Authenticated users can comment"
  ON public.post_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON public.post_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.post_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- DELETE: Admins can delete any comment
CREATE POLICY "Admins can delete any comment"
  ON public.post_comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 12. CREATE STORAGE BUCKET FOR POST MEDIA
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,
  20971520, -- 20MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. CREATE STORAGE POLICIES FOR POSTS BUCKET
-- ============================================================================

-- Anyone can view post media
CREATE POLICY "Anyone can view post media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

-- Authenticated users can upload their own post media
CREATE POLICY "Authenticated users can upload post media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'posts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own post media
CREATE POLICY "Users can update their own post media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'posts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own post media
CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'posts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- 14. INSERT DEFAULT WALLS
-- ============================================================================

INSERT INTO public.walls (name, slug, description, icon, color, display_order, is_active)
VALUES
  ('General', 'general', 'General discussions, networking, and community updates', '💬', '#6366f1', 1, true),
  ('Jobs & Opportunities', 'jobs', 'Job postings, freelance opportunities, and collaborations', '💼', '#10b981', 2, true),
  ('Showcase', 'showcase', 'Share your latest projects, animations, and creative work', '🎨', '#f59e0b', 3, true),
  ('Technical Help', 'help', 'Ask questions, share tutorials, and get technical assistance', '🛠️', '#8b5cf6', 4, true),
  ('Events', 'events', 'Workshops, conferences, meetups, and industry events', '📅', '#ec4899', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
