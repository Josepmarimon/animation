'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
  }
}

interface PostCardProps {
  post: Post
  wallSlug: string
  currentUserId?: string
  isLikedByUser: boolean
  onLikeToggle?: () => void
}

export default function PostCard({
  post,
  wallSlug,
  currentUserId,
  isLikedByUser: initialIsLiked,
  onLikeToggle,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  const handleLikeToggle = async () => {
    if (!currentUserId || isSubmitting) return

    setIsSubmitting(true)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)

        if (!error) {
          setIsLiked(false)
          setLikesCount(prev => prev - 1)
          if (onLikeToggle) onLikeToggle()
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: currentUserId,
          })

        if (!error) {
          setIsLiked(true)
          setLikesCount(prev => prev + 1)
          if (onLikeToggle) onLikeToggle()
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Ara mateix'
    if (diffInMins < 60) return `Fa ${diffInMins} min`
    if (diffInHours < 24) return `Fa ${diffInHours}h`
    if (diffInDays < 7) return `Fa ${diffInDays}d`

    return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6">
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <Link href={`/profile/${post.user_id}`} className="flex-shrink-0">
          {post.profiles?.avatar_url ? (
            <Image
              src={post.profiles.avatar_url}
              alt={post.profiles.full_name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
              {post.profiles?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${post.user_id}`}
            className="font-semibold text-white hover:text-blue-200 transition-colors"
          >
            {post.profiles?.full_name}
          </Link>
          <p className="text-sm text-blue-200">{formatDate(post.created_at)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white whitespace-pre-wrap break-words">{post.content}</p>
      </div>

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div
          className={`mb-4 grid gap-2 ${
            post.media_urls.length === 1
              ? 'grid-cols-1'
              : post.media_urls.length === 2
              ? 'grid-cols-2'
              : post.media_urls.length === 3
              ? 'grid-cols-3'
              : 'grid-cols-2'
          }`}
        >
          {post.media_urls.map((url, index) => (
            <div
              key={index}
              className={`relative ${
                post.media_urls.length === 1
                  ? 'aspect-video'
                  : post.media_urls.length === 3 && index === 0
                  ? 'col-span-3 aspect-video'
                  : 'aspect-square'
              } rounded-lg overflow-hidden`}
            >
              <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-white border-opacity-20">
        <button
          onClick={handleLikeToggle}
          disabled={!currentUserId || isSubmitting}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLiked ? 'text-red-400' : 'text-blue-200 hover:text-red-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg
            className="h-5 w-5"
            fill={isLiked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>

        <Link
          href={`/wall/${wallSlug}/${post.id}`}
          className="flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <span>{post.comments_count}</span>
        </Link>
      </div>
    </div>
  )
}
