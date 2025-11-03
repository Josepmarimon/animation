'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface PortfolioImage {
  id: string
  url: string
  title: string
  description: string
  is_featured?: boolean
  type?: 'image' | 'youtube' | 'vimeo'
}

interface PortfolioUploadProps {
  userId: string
  initialImages?: PortfolioImage[]
  onImagesChange: (images: PortfolioImage[]) => void
}

export default function PortfolioUpload({ userId, initialImages = [], onImagesChange }: PortfolioUploadProps) {
  const [images, setImages] = useState<PortfolioImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
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

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB')
        setUploading(false)
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, {
          upsert: false,
          contentType: file.type
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(data.path)

      // Add new image to the list
      const newImage: PortfolioImage = {
        id: Date.now().toString(),
        url: publicUrl,
        title: '',
        description: '',
        is_featured: images.length === 0, // First image is featured by default
        type: 'image'
      }

      const updatedImages = [...images, newImage]
      setImages(updatedImages)
      onImagesChange(updatedImages)
      setUploading(false)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading image')
      setUploading(false)
    }
  }

  const handleAddVideo = () => {
    try {
      setError(null)

      if (!videoUrl.trim()) {
        setError('Please enter a video URL')
        return
      }

      // Detect video type
      let type: 'youtube' | 'vimeo' = 'youtube'
      if (videoUrl.includes('vimeo.com')) {
        type = 'vimeo'
      } else if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        setError('Please enter a valid YouTube or Vimeo URL')
        return
      }

      const newVideo: PortfolioImage = {
        id: Date.now().toString(),
        url: videoUrl,
        title: '',
        description: '',
        is_featured: images.length === 0,
        type: type
      }

      const updatedImages = [...images, newVideo]
      setImages(updatedImages)
      onImagesChange(updatedImages)
      setVideoUrl('')
      setShowVideoInput(false)
    } catch (err: any) {
      setError(err.message || 'Error adding video')
    }
  }

  const updateImageDetails = (id: string, field: 'title' | 'description', value: string) => {
    const updatedImages = images.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    )
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const setFeaturedImage = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      is_featured: img.id === id
    }))
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const deleteImage = async (id: string, url: string, type?: string) => {
    try {
      // Only delete from storage if it's an uploaded image (not a video URL)
      if (type === 'image') {
        const path = url.split('/portfolio/')[1]

        if (path) {
          // Delete from Supabase Storage
          await supabase.storage.from('portfolio').remove([path])
        }
      }

      // Remove from state
      const updatedImages = images.filter(img => img.id !== id)
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (err: any) {
      setError(err.message || 'Error deleting item')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Portfolio Items
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Add images or videos to showcase your work. The featured item will be displayed prominently on your profile.
        </p>

        {/* Upload buttons */}
        <div className="mb-4 flex gap-3">
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
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '+ Add Image'}
          </button>
          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            + Add Video
          </button>
        </div>

        {/* Video URL input */}
        {showVideoInput && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Enter a YouTube or Vimeo URL
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVideoInput(false)
                  setVideoUrl('')
                }}
                className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Images grid */}
        {images.length > 0 && (
          <div className="space-y-6">
            {images.map((image) => (
              <div
                key={image.id}
                className={`border rounded-lg p-4 ${
                  image.is_featured
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0 relative">
                    {image.type === 'image' ? (
                      <Image
                        src={image.url}
                        alt={image.title || 'Portfolio image'}
                        width={160}
                        height={120}
                        className="rounded-lg object-cover w-40 h-30"
                      />
                    ) : (
                      <div className="w-40 h-30 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-300">
                        <div className="text-center px-2">
                          <svg className="w-10 h-10 mx-auto mb-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          <p className="text-xs text-gray-500">{image.type === 'youtube' ? 'YouTube' : 'Vimeo'}</p>
                        </div>
                      </div>
                    )}
                    {image.is_featured && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Image details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={image.title}
                        onChange={(e) => updateImageDetails(image.id, 'title', e.target.value)}
                        placeholder="Project title"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={image.description}
                        onChange={(e) => updateImageDetails(image.id, 'description', e.target.value)}
                        placeholder="Describe this project..."
                        rows={2}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      {!image.is_featured && (
                        <button
                          type="button"
                          onClick={() => setFeaturedImage(image.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Set as featured
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteImage(image.id, image.url, image.type)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete {image.type === 'image' ? 'image' : 'video'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !uploading && (
          <p className="text-sm text-gray-500 italic">
            No portfolio items yet. Add images or videos to showcase your work!
          </p>
        )}
      </div>
    </div>
  )
}
