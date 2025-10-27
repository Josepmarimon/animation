import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import DirectoryFilters from '@/app/components/DirectoryFilters'

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
                My Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Professionals Directory</h1>
          <p className="mt-2 text-gray-600">
            Explore animation professional profiles from around the world
          </p>
        </div>

        {/* Filters */}
        <DirectoryFilters countries={countries} />

        {/* Results count */}
        {profiles && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {profiles.length === 0
                ? 'No profiles found matching your filters'
                : `Showing ${profiles.length} ${profiles.length === 1 ? 'profile' : 'profiles'}`
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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="max-w-md mx-auto px-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">No profiles found</h3>
              <p className="mt-2 text-sm text-gray-500">
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
