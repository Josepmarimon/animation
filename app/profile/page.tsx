import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Helper function to format specialization names
function formatSpecialization(spec: string): string {
  return spec
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Social media icon components
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

const ArtStationIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 002.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 00-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z"/>
  </svg>
)

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  const contactInfo = profile?.contact_info || {}
  const portfolioProjects = profile?.portfolio_projects || []

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
                href="/directory"
                className="text-gray-700 hover:text-gray-900"
              >
                Directory
              </Link>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section with Avatar */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-12 sm:px-12">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold ring-4 ring-white shadow-lg">
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name and Location */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile?.full_name || 'User'}
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  {profile?.city}, {profile?.country}
                </p>

                {/* Social Links */}
                {(contactInfo.website || contactInfo.linkedin || contactInfo.instagram || contactInfo.artstation || contactInfo.behance || contactInfo.vimeo || contactInfo.youtube) && (
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                    {contactInfo.website && (
                      <a
                        href={contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <GlobeIcon />
                        Website
                      </a>
                    )}
                    {contactInfo.linkedin && (
                      <a
                        href={contactInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <LinkedInIcon />
                        LinkedIn
                      </a>
                    )}
                    {contactInfo.instagram && (
                      <a
                        href={contactInfo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <InstagramIcon />
                        Instagram
                      </a>
                    )}
                    {contactInfo.artstation && (
                      <a
                        href={contactInfo.artstation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <ArtStationIcon />
                        ArtStation
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0">
                <Link
                  href="/profile/edit"
                  className="inline-block rounded-md bg-white px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 shadow-lg"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            {profile?.bio && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {/* Portfolio Section */}
            {portfolioProjects.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioProjects.map((project: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <Image
                          src={project.url}
                          alt={project.title || 'Portfolio image'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {project.title && (
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {project.title}
                        </h3>
                      )}
                      {project.description && (
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specializations */}
            {profile?.specializations && profile.specializations.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec: string) => (
                    <span
                      key={spec}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {formatSpecialization(spec)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile?.city}, {profile?.country}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Visibility Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full ${profile?.is_public ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.is_public ? 'Public Profile' : 'Private Profile'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {profile?.is_public
                      ? 'Your profile is visible in the directory'
                      : 'Your profile is hidden from the directory'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
