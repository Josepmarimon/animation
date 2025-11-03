'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AvatarUpload from '@/app/components/AvatarUpload'
import PortfolioUpload from '@/app/components/PortfolioUpload'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'

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

interface PortfolioImage {
  id: string
  url: string
  title: string
  description: string
  type?: 'image' | 'youtube' | 'vimeo'
}

interface ContactInfo {
  website?: string
  linkedin?: string
  instagram?: string
  artstation?: string
  behance?: string
  vimeo?: string
  youtube?: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<{ avatar_url?: string, full_name?: string } | null>(null)

  // Basic info
  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [bio, setBio] = useState('')
  const [specializations, setSpecializations] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)

  // Images
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([])

  // Contact info
  const [website, setWebsite] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [artstation, setArtstation] = useState('')
  const [behance, setBehance] = useState('')
  const [vimeo, setVimeo] = useState('')
  const [youtube, setYoutube] = useState('')
  const [showreelYoutube, setShowreelYoutube] = useState('')
  const [showreelVimeo, setShowreelVimeo] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUserId(user.id)
      setUser(user)

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
        // Set user profile for mobile menu
        setUserProfile({
          avatar_url: profile.avatar_url,
          full_name: profile.full_name
        })

        // Basic info
        setFullName(profile.full_name || '')
        setCountry(profile.country || '')
        setCity(profile.city || '')
        setBio(profile.bio || '')
        setSpecializations(profile.specializations || [])
        setIsPublic(profile.is_public ?? true)

        // Images
        setAvatarUrl(profile.avatar_url || null)

        // Parse portfolio projects
        if (profile.portfolio_projects && Array.isArray(profile.portfolio_projects)) {
          const parsed = profile.portfolio_projects.map((p: any, idx: number) => ({
            id: p.id || `${idx}`,
            url: p.url || '',
            title: p.title || '',
            description: p.description || '',
            type: p.type || 'image'
          }))
          setPortfolioImages(parsed)
        }

        // Contact info
        const contactInfo = profile.contact_info || {}
        setWebsite(contactInfo.website || '')
        setLinkedin(contactInfo.linkedin || '')
        setInstagram(contactInfo.instagram || '')
        setArtstation(contactInfo.artstation || '')
        setBehance(contactInfo.behance || '')
        setVimeo(contactInfo.vimeo || '')
        setYoutube(contactInfo.youtube || '')
        setShowreelYoutube(contactInfo.showreel_youtube || '')
        setShowreelVimeo(contactInfo.showreel_vimeo || '')
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

    // Prepare contact info object
    const contactInfo: ContactInfo = {}
    if (website) contactInfo.website = website
    if (linkedin) contactInfo.linkedin = linkedin
    if (instagram) contactInfo.instagram = instagram
    if (artstation) contactInfo.artstation = artstation
    if (behance) contactInfo.behance = behance
    if (vimeo) contactInfo.vimeo = vimeo
    if (youtube) contactInfo.youtube = youtube
    if (showreelYoutube) contactInfo.showreel_youtube = showreelYoutube
    if (showreelVimeo) contactInfo.showreel_vimeo = showreelVimeo

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        country: country,
        city: city,
        bio: bio,
        specializations: specializations,
        is_public: isPublic,
        avatar_url: avatarUrl,
        portfolio_projects: portfolioImages,
        contact_info: contactInfo,
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

    // Redirect after 1.5 seconds
    setTimeout(() => {
      router.push('/profile')
      router.refresh()
    }, 1500)
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
            {/* Logo - Responsive sizing */}
            <AnimatedLogo
              className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-wider"
              textColor="text-gray-900"
              darkColor="text-white"
            />

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/directory"
                className="text-gray-700 hover:text-gray-900"
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900"
              >
                About
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Back to Profile
              </Link>
            </div>

            {/* Mobile Menu - Visible on mobile */}
            <div className="flex items-center lg:hidden">
              <MobileMenu user={user} userProfile={userProfile} />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Image</h3>
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  userId={userId}
                  onUploadComplete={(url) => setAvatarUrl(url)}
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

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
              </div>

              {/* Portfolio Images */}
              <div className="pb-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio</h3>
                <PortfolioUpload
                  userId={userId}
                  initialImages={portfolioImages}
                  onImagesChange={(images) => setPortfolioImages(images)}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Contact & Social Links</h3>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Personal Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      id="instagram"
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="artstation" className="block text-sm font-medium text-gray-700">
                      ArtStation
                    </label>
                    <input
                      id="artstation"
                      type="url"
                      value={artstation}
                      onChange={(e) => setArtstation(e.target.value)}
                      placeholder="https://artstation.com/username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="behance" className="block text-sm font-medium text-gray-700">
                      Behance
                    </label>
                    <input
                      id="behance"
                      type="url"
                      value={behance}
                      onChange={(e) => setBehance(e.target.value)}
                      placeholder="https://behance.net/username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="vimeo" className="block text-sm font-medium text-gray-700">
                      Vimeo
                    </label>
                    <input
                      id="vimeo"
                      type="url"
                      value={vimeo}
                      onChange={(e) => setVimeo(e.target.value)}
                      placeholder="https://vimeo.com/username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                      YouTube
                    </label>
                    <input
                      id="youtube"
                      type="url"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="https://youtube.com/@username"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Showreel Videos */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Showreel Videos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add specific video URLs for your showreel (different from your channel links above)
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="showreelYoutube" className="block text-sm font-medium text-gray-700">
                      Showreel YouTube Video
                    </label>
                    <input
                      id="showreelYoutube"
                      type="url"
                      value={showreelYoutube}
                      onChange={(e) => setShowreelYoutube(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="showreelVimeo" className="block text-sm font-medium text-gray-700">
                      Showreel Vimeo Video
                    </label>
                    <input
                      id="showreelVimeo"
                      type="url"
                      value={showreelVimeo}
                      onChange={(e) => setShowreelVimeo(e.target.value)}
                      placeholder="https://vimeo.com/VIDEO_ID"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="border-t border-gray-200 pt-6">
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

              <div className="flex items-center space-x-4 border-t border-gray-200 pt-6">
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
