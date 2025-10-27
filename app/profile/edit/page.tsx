'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SPECIALIZATIONS = [
  { value: '2d_animation', label: '2D Animation' },
  { value: '3d_animation', label: '3D Animation' },
  { value: 'character_design', label: 'Character Design' },
  { value: 'storyboard', label: 'Storyboard' },
  { value: 'motion_graphics', label: 'Motion Graphics' },
  { value: 'visual_effects', label: 'VFX' },
  { value: 'stop_motion', label: 'Stop Motion' },
  { value: 'concept_art', label: 'Concept Art' },
  { value: 'rigging', label: 'Rigging' },
  { value: 'compositing', label: 'Compositing' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'texturing', label: 'Texturing' },
  { value: 'modeling', label: 'Modeling' },
]

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [specializations, setSpecializations] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError('Failed to load profile')
        setLoading(false)
        return
      }

      if (profile) {
        setFullName(profile.full_name || '')
        setCountry(profile.country || '')
        setCity(profile.city || '')
        setBio(profile.bio || '')
        setSpecializations(profile.specializations || [])
        setIsPublic(profile.is_public ?? true)
      }

      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSpecializationToggle = (spec: string) => {
    setSpecializations(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Not authenticated')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        country: country,
        city: city,
        bio: bio,
        specializations: specializations,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)

    // Redirect after 1 second
    setTimeout(() => {
      router.push('/profile')
      router.refresh()
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Animation Directory
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your experience, skills, and what you're working on..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specializations
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <label
                      key={spec.value}
                      className="relative flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={specializations.includes(spec.value)}
                        onChange={() => handleSpecializationToggle(spec.value)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-900">{spec.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make my profile visible in the public directory
                </label>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-800">Profile updated successfully! Redirecting...</p>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <Link
                  href="/profile"
                  className="rounded-md bg-gray-200 px-6 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
