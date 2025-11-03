'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface CreatePostFormProps {
  wallId: string
  wallColor: string
  onPostCreated?: () => void
}

export default function CreatePostForm({ wallId, wallColor, onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Limit to 4 images
    if (selectedFiles.length + files.length > 4) {
      setError('Maximum 4 images per post')
      return
    }

    setError('')
    setSelectedFiles([...selectedFiles, ...files])

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)

    // Revoke the removed URL
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles(newFiles)
    setPreviewUrls(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be authenticated to post')
        return
      }

      // Upload images to storage
      const mediaUrls: string[] = []

      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName)

        mediaUrls.push(publicUrl)
      }

      // Create post
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          wall_id: wallId,
          user_id: user.id,
          content: content.trim(),
          media_urls: mediaUrls,
          is_public: true,
        })

      if (insertError) throw insertError

      // Reset form
      setContent('')
      setSelectedFiles([])
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setPreviewUrls([])

      // Notify parent
      if (onPostCreated) onPostCreated()

    } catch (err: any) {
      console.error('Error creating post:', err)
      setError(err.message || 'Error creating post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6"
    >
      <h3 className="mb-4 text-lg font-semibold text-white">Create Post</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* Text input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What do you want to share?"
        rows={4}
        maxLength={5000}
        disabled={isSubmitting}
        className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
      />

      <div className="mt-2 text-right text-xs text-blue-200">
        {content.length}/5000
      </div>

      {/* Image previews */}
      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {/* Image upload button */}
          {selectedFiles.length < 4 && (
            <label className="cursor-pointer rounded-lg bg-white bg-opacity-10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-opacity-20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                disabled={isSubmitting}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span>Image</span>
              </div>
            </label>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          style={{ backgroundColor: wallColor }}
          className="rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  )
}
