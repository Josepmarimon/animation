'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface PortfolioImage {
  id: string
  url: string
  title: string
  description: string
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
        description: ''
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

  const updateImageDetails = (id: string, field: 'title' | 'description', value: string) => {
    const updatedImages = images.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    )
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const deleteImage = async (id: string, url: string) => {
    try {
      // Extract the path from the URL
      const path = url.split('/portfolio/')[1]

      if (path) {
        // Delete from Supabase Storage
        await supabase.storage.from('portfolio').remove([path])
      }

      // Remove from state
      const updatedImages = images.filter(img => img.id !== id)
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (err: any) {
      setError(err.message || 'Error deleting image')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Portfolio Images
        </label>

        {/* Upload button */}
        <div className="mb-4">
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
            {uploading ? 'Uploading...' : '+ Add portfolio image'}
          </button>
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG or WEBP. Max 10MB per image.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Images grid */}
        {images.length > 0 && (
          <div className="space-y-6">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Image preview */}
                  <div className="flex-shrink-0">
                    <Image
                      src={image.url}
                      alt={image.title || 'Portfolio image'}
                      width={160}
                      height={120}
                      className="rounded-lg object-cover w-40 h-30"
                    />
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

                    <button
                      type="button"
                      onClick={() => deleteImage(image.id, image.url)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Delete image
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && !uploading && (
          <p className="text-sm text-gray-500 italic">
            No portfolio images yet. Add some to showcase your work!
          </p>
        )}
      </div>
    </div>
  )
}
