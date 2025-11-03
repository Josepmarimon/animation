'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles: {
    full_name: string
    avatar_url: string | null
  } | null
}

interface CommentSectionProps {
  postId: string
  currentUserId?: string
  onCommentAdded?: () => void
}

export default function CommentSection({ postId, currentUserId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles!post_comments_user_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Transform the data to match our interface
      const transformedData = data?.map(comment => ({
        ...comment,
        profiles: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
      })) || []

      setComments(transformedData)
    } catch (err: any) {
      console.error('Error fetching comments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUserId) {
      setError('You must be authenticated to comment')
      return
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: newComment.trim(),
        })

      if (insertError) throw insertError

      setNewComment('')
      await fetchComments()

      // Notify parent that a comment was added
      if (onCommentAdded) onCommentAdded()
    } catch (err: any) {
      console.error('Error creating comment:', err)
      setError(err.message || 'Error creating comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      await fetchComments()

      // Notify parent that a comment was deleted
      if (onCommentAdded) onCommentAdded()
    } catch (err: any) {
      console.error('Error deleting comment:', err)
      alert('Error deleting comment. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="mb-6">
          {error && (
            <div className="mb-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 p-2 text-sm text-red-100">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              maxLength={2000}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-blue-200">{newComment.length}/2000</span>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Comment'}
            </button>
          </div>
        </form>
      )}

      {!currentUserId && (
        <div className="mb-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 p-4 text-center">
          <p className="text-sm text-blue-200 mb-2">
            You must be authenticated to comment
          </p>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-white hover:text-blue-200 transition-colors"
          >
            Log in
          </Link>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="text-center text-blue-200 py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-blue-200 py-8">
          No comments yet. Be the first!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link href={`/profile/${comment.user_id}`} className="flex-shrink-0">
                {comment.profiles?.avatar_url ? (
                  <Image
                    src={comment.profiles.avatar_url}
                    alt={comment.profiles.full_name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                    {comment.profiles?.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <div className="rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${comment.user_id}`}
                        className="font-semibold text-white text-sm hover:text-blue-200 transition-colors"
                      >
                        {comment.profiles?.full_name}
                      </Link>
                      <span className="text-xs text-blue-200">{formatDate(comment.created_at)}</span>
                    </div>
                    {/* Delete button (only for comment author) */}
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-300 hover:text-red-100 transition-colors"
                        title="Delete comment"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-white text-sm whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
