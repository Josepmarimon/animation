# Demo Users Documentation

## Overview
This project includes 10 fictional stop-motion animation professionals for demonstration purposes. All demo users have "(demo)" in their names for easy identification.

## Demo User Credentials
All demo users share the same password: `demo123`

### Demo Users List:
1. **Wallace Cooper (demo)** - wallace.cooper.demo@example.com
   - Location: Bristol, UK
   - Specialties: Stop-motion, Character Design

2. **Anika Winters (demo)** - anika.winters.demo@example.com
   - Location: Berlin, Germany
   - Specialties: Stop-motion, Compositing, Concept Art

3. **Marcus Chen (demo)** - marcus.chen.demo@example.com
   - Location: Vancouver, Canada
   - Specialties: Stop-motion, Lighting

4. **Sofia Rodriguez (demo)** - sofia.rodriguez.demo@example.com
   - Location: Barcelona, Spain
   - Specialties: Stop-motion, Character Design, Modeling

5. **Hiroshi Tanaka (demo)** - hiroshi.tanaka.demo@example.com
   - Location: Tokyo, Japan
   - Specialties: Stop-motion, Storyboard

6. **Emma O'Brien (demo)** - emma.obrien.demo@example.com
   - Location: Dublin, Ireland
   - Specialties: Stop-motion, Concept Art

7. **Lars Nielsen (demo)** - lars.nielsen.demo@example.com
   - Location: Copenhagen, Denmark
   - Specialties: Stop-motion, Rigging

8. **Isabella Rossi (demo)** - isabella.rossi.demo@example.com
   - Location: Milan, Italy
   - Specialties: Stop-motion, Storyboard, Concept Art

9. **Oliver Smith (demo)** - oliver.smith.demo@example.com
   - Location: Portland, USA
   - Specialties: Stop-motion, Texturing

10. **Yuki Yamamoto (demo)** - yuki.yamamoto.demo@example.com
    - Location: Osaka, Japan
    - Specialties: Stop-motion, Motion Graphics

## Installing Demo Users

### Via Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20250127_007_demo_users.sql`
4. Execute the SQL script

### Via Supabase CLI:
```bash
supabase db push
```

## Image Sources
All images are from Unsplash and are used for demonstration purposes only. In production:
- Users will upload their own images to Supabase Storage
- Demo images use external URLs (not stored in your storage buckets)

## Deleting Demo Users

When you're ready to remove all demo users, execute this SQL:

```sql
-- Delete demo users from profiles table
DELETE FROM public.profiles
WHERE full_name LIKE '%(demo)%';

-- Delete demo users from auth.users table
DELETE FROM auth.users
WHERE email LIKE '%.demo@example.com';
```

Or delete them one by one via the Supabase Dashboard:
1. Go to Authentication → Users
2. Search for "demo"
3. Delete each user individually

## Notes
- Demo users are marked with "(demo)" in their full_name field
- All demo email addresses end with `.demo@example.com`
- Demo users have `is_public = true` so they appear in the directory
- Images are external URLs from Unsplash (not stored in Supabase Storage)
- Each user has 2 portfolio projects with one marked as featured
