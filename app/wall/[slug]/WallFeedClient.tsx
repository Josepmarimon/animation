'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CreatePostForm from '../../components/walls/CreatePostForm'
import PostCard from '../../components/walls/PostCard'

interface Wall {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  posts_count: number
}

interface Post {
  id: string
  content: string
  media_urls: string[]
  likes_count: number
  comments_count: number
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    avatar_url: string | null
  } | null
}

interface WallFeedClientProps {
  initialWall: Wall
  initialPosts: Post[]
  initialUserLikes: string[]
  currentUserId?: string
}

export default function WallFeedClient({
  initialWall,
  initialPosts,
  initialUserLikes,
  currentUserId,
}: WallFeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set(initialUserLikes))

  const supabase = createClient()

  const fetchData = async () => {
    try {
      // Get posts for this wall
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          media_urls,
          likes_count,
          comments_count,
          created_at,
          user_id,
          profiles!posts_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('wall_id', initialWall.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (postsError) {
        console.error('Posts error:', postsError)
        throw postsError
      }

      // Transform the data to match our interface
      const transformedPosts = postsData?.map(post => ({
        ...post,
        profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
      })) || []

      setPosts(transformedPosts)

      // Get user's likes if logged in
      if (currentUserId) {
        const { data: likesData, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', currentUserId)

        if (likesError) {
          console.error('Likes error:', likesError)
        } else if (likesData) {
          setUserLikes(new Set(likesData.map(like => like.post_id)))
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err)
    }
  }

  const handlePostCreated = () => {
    fetchData()
  }

  return (
    <>
      {/* Create Post Form (only for authenticated users) */}
      {currentUserId && (
        <div className="mb-8">
          <CreatePostForm
            wallId={initialWall.id}
            wallColor={initialWall.color || '#6366f1'}
            onPostCreated={handlePostCreated}
          />
        </div>
      )}

      {/* Posts Feed */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              wallSlug={initialWall.slug}
              currentUserId={currentUserId}
              isLikedByUser={userLikes.has(post.id)}
              onLikeToggle={fetchData}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
          <p className="text-blue-100">
            {currentUserId ? 'Be the first to post something!' : 'Log in to create the first post'}
          </p>
        </div>
      )}
    </>
  )
}
