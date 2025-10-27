'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userId: string
  onUploadComplete: (url: string) => void
}

export default function AvatarUpload({ currentAvatarUrl, userId, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        setUploading(false)
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        setUploading(false)
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path)

      setPreviewUrl(publicUrl)
      onUploadComplete(publicUrl)
      setUploading(false)
    } catch (err: any) {
      setError(err.message || 'Error uploading image')
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <div className="relative">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-200"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold ring-4 ring-gray-200">
              {userId.charAt(0).toUpperCase()}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Change avatar'}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG or WEBP. Max 5MB.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
