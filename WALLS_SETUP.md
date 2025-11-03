# Walls System Setup Instructions

This document contains important instructions for setting up the Walls system in your Supabase database.

## Required Migrations

You need to apply TWO migrations manually through the Supabase Dashboard:

### 1. Migration: Create Walls System
**File:** `supabase/migrations/20250203_011_create_walls_system.sql`

This migration creates:
- `walls` table for thematic walls
- `posts` table for user posts
- `post_likes` table for tracking likes
- `post_comments` table for comments
- Storage bucket for post media
- Triggers for automatic counter updates (likes_count, comments_count, posts_count)
- RLS policies for security
- 5 default walls (General, Jobs, Showcase, Technical Help, Events)

### 2. Migration: Fix Foreign Key Relationships
**File:** `supabase/migrations/20250203_012_add_posts_profiles_fkey.sql`

This migration fixes foreign key relationships to enable automatic joins with profiles:
- Changes posts.user_id FK from auth.users to profiles
- Changes post_likes.user_id FK from auth.users to profiles
- Changes post_comments.user_id FK from auth.users to profiles

## How to Apply Migrations

1. Go to your Supabase Dashboard
2. Navigate to: **SQL Editor**
3. Create a new query
4. Copy the entire content of migration file `20250203_011_create_walls_system.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute
7. Wait for confirmation message
8. Repeat steps 3-7 for migration file `20250203_012_add_posts_profiles_fk.sql`

## Verify Migrations

After applying the migrations, verify they worked:

1. Go to **Table Editor** in Supabase Dashboard
2. Check that these tables exist:
   - walls
   - posts
   - post_likes
   - post_comments

3. Go to **Storage** in Supabase Dashboard
4. Check that the `posts` bucket exists

5. Go to **Database** → **Functions** in Supabase Dashboard
6. Check that these functions exist:
   - update_post_likes_count()
   - update_post_comments_count()
   - update_wall_posts_count()

## Important Notes

- The triggers will automatically update counters (likes_count, comments_count, posts_count) when data changes
- If counters are not updating, check that the triggers were created successfully
- Make sure to apply migration 20250203_012 AFTER 20250203_011
- The foreign key changes in migration 012 enable Supabase PostgREST to automatically join with profiles data

## Troubleshooting

### Problem: "Could not find a relationship between 'posts' and 'profiles'"
**Solution:** Make sure you applied migration `20250203_012_add_posts_profiles_fk.sql`

### Problem: Comments count not updating
**Solution:** Check that the trigger `update_post_comments_count_trigger` exists in your database

### Problem: Likes count not updating
**Solution:** Check that the trigger `update_post_likes_count_trigger` exists in your database

### Problem: Wall posts count not updating
**Solution:** Check that the trigger `update_wall_posts_count_trigger` exists in your database

## Testing

After applying migrations:

1. Try creating a post in a wall
2. Try liking a post (counter should increment)
3. Try commenting on a post (counter should increment)
4. Try creating a new wall as admin
5. Verify all counters update correctly
