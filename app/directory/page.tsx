import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DirectoryFilters from '@/app/components/DirectoryFilters'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'

// Helper function to format specialization names
function formatSpecialization(spec: string): string {
  return spec
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface DirectoryPageProps {
  searchParams: Promise<{ specialization?: string; country?: string }>
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Get current user and profile for avatar
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  // Get all countries for filter dropdown
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('country')
    .eq('is_public', true)

  const countries = Array.from(new Set(
    (allProfiles || [])
      .map(p => p.country)
      .filter((c): c is string => !!c)
  )).sort()

  // Build query with filters
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)

  // Apply specialization filter
  if (params.specialization) {
    query = query.contains('specializations', [params.specialization])
  }

  // Apply country filter
  if (params.country) {
    query = query.eq('country', params.country)
  }

  const { data: profiles } = await query
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 justify-between items-center">
            {/* Logo - Responsive sizing */}
            <AnimatedLogo />

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/about"
                className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
              >
                About
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all overflow-hidden border-2 border-white border-opacity-30"
                  title="My Profile"
                >
                  {userProfile?.avatar_url ? (
                    <Image
                      src={userProfile.avatar_url}
                      alt={userProfile.full_name || 'Profile'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                      {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </Link>
              )}
            </div>

            {/* Mobile Menu - Visible on mobile */}
            <MobileMenu user={user} userProfile={userProfile} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header with title and subtitle */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">Professionals Directory</h1>
          <p className="mt-2 text-sm text-blue-100">
            Explore animation professional profiles from around the world
          </p>
        </div>

        {/* Filters */}
        <DirectoryFilters countries={countries} />

        {/* Results count */}
        {profiles && (
          <div className="mb-6">
            <p className="text-sm text-blue-200">
              {profiles.length === 0
                ? 'No profiles found matching your filters'
                : `${profiles.length} ${profiles.length === 1 ? 'profile' : 'profiles'}`
              }
            </p>
          </div>
        )}

        {profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => {
              const portfolioProjects = profile.portfolio_projects || []
              const featuredImage = portfolioProjects.find((p: any) => p.is_featured) || portfolioProjects[0]

              return (
                <div
                  key={profile.id}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Featured Image or Avatar - Clickable */}
                  <Link href={`/profile/${profile.id}`} className="block">
                    <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 cursor-pointer">
                      {featuredImage ? (
                        <Image
                          src={featuredImage.url}
                          alt={profile.full_name || 'Profile'}
                          fill
                          className="object-cover hover:opacity-90 transition-opacity"
                        />
                      ) : profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name || 'Profile'}
                          fill
                          className="object-cover hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-4xl shadow-lg">
                            {profile.full_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/profile/${profile.id}`} className="block mb-4 group">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {profile.avatar_url ? (
                            <Image
                              src={profile.avatar_url}
                              alt={profile.full_name || 'Avatar'}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                              {profile.full_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {profile.full_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {profile.city}, {profile.country}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {profile.bio && (
                      <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {profile.specializations && profile.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.specializations.slice(0, 3).map((spec: string) => (
                          <span
                            key={spec}
                            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {formatSpecialization(spec)}
                          </span>
                        ))}
                        {profile.specializations.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-800">
                            +{profile.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl border border-white border-opacity-20">
            <div className="max-w-md mx-auto px-4">
              <svg
                className="mx-auto h-12 w-12 text-blue-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-white">No profiles found</h3>
              <p className="mt-2 text-sm text-blue-100">
                {params.specialization || params.country
                  ? 'Try adjusting your filters to see more results.'
                  : 'No public profiles available yet.'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
