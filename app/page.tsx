import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import InteractiveBackground from './components/InteractiveBackground'
import MobileMenu from './components/MobileMenu'
import AnimatedLogo from './components/AnimatedLogo'
import Footer from './components/Footer'

// Helper function to format specialization names
function formatSpecialization(spec: string): string {
  return spec
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile for avatar
  let userProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  // Get "Animator of the Day" - deterministic random based on current date
  const today = new Date()
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))

  const { data: allPublicUsers, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('is_public', true)

  let animatorOfTheDay = null
  if (allPublicUsers && allPublicUsers.length > 0) {
    // Use modulo to get consistent random user for the day
    const randomIndex = daysSinceEpoch % allPublicUsers.length
    animatorOfTheDay = allPublicUsers[randomIndex]
  }

  // Get latest 6 public users
  const { data: latestUsers } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Background Image with Interactive Popup */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <InteractiveBackground />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 justify-between items-center">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center">
              <AnimatedLogo />
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/directory"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    Directory
                  </Link>
                  <Link
                    href="/wall"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    Walls
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    About
                  </Link>
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
                </>
              ) : (
                <>
                  <Link
                    href="/directory"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    Directory
                  </Link>
                  <Link
                    href="/wall"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    Walls
                  </Link>
                  <Link
                    href="/about"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    About
                  </Link>
                  <Link
                    href="/auth/login"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu - Visible on mobile */}
            <MobileMenu user={user} userProfile={userProfile} />
          </div>
        </div>
      </nav>

      {/* Animator of the Day - Megacard */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
          <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Animator of the Day
          </span>
        </h2>

        {animatorOfTheDay ? (
          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left side - Featured Image */}
              <Link
                href={`/profile/${animatorOfTheDay.id}`}
                className="relative aspect-square lg:aspect-auto lg:min-h-[600px] bg-gradient-to-br from-blue-100 to-indigo-100 group cursor-pointer"
              >
                {animatorOfTheDay.portfolio_projects && animatorOfTheDay.portfolio_projects.length > 0 ? (
                  <>
                    {(() => {
                      const featuredProject = animatorOfTheDay.portfolio_projects.find((p: any) => p.is_featured) || animatorOfTheDay.portfolio_projects[0]
                      return (
                        <Image
                          src={featuredProject.url}
                          alt={animatorOfTheDay.full_name || 'Featured work'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )
                    })()}
                  </>
                ) : animatorOfTheDay.avatar_url ? (
                  <Image
                    src={animatorOfTheDay.avatar_url}
                    alt={animatorOfTheDay.full_name || 'Profile'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-8xl shadow-lg">
                      {animatorOfTheDay.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              {/* Right side - Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-between">
                {/* Header with avatar and name */}
                <div>
                  <Link href={`/profile/${animatorOfTheDay.id}`} className="flex items-center gap-4 mb-6 group">
                    {animatorOfTheDay.avatar_url ? (
                      <Image
                        src={animatorOfTheDay.avatar_url}
                        alt={animatorOfTheDay.full_name || 'Avatar'}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full object-cover border-4 border-white border-opacity-30"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl border-4 border-white border-opacity-30">
                        {animatorOfTheDay.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors">
                        {animatorOfTheDay.full_name}
                      </h3>
                      <p className="text-blue-100 text-lg">
                        {animatorOfTheDay.city}, {animatorOfTheDay.country}
                      </p>
                    </div>
                  </Link>

                  {/* Bio */}
                  {animatorOfTheDay.bio && (
                    <p className="text-white text-lg mb-6 leading-relaxed">
                      {animatorOfTheDay.bio}
                    </p>
                  )}

                  {/* Specializations */}
                  {animatorOfTheDay.specializations && animatorOfTheDay.specializations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wide">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {animatorOfTheDay.specializations.map((spec: string) => (
                          <span
                            key={spec}
                            className="inline-flex items-center rounded-full bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white border border-white border-opacity-20"
                          >
                            {formatSpecialization(spec)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Portfolio thumbnails */}
                  {animatorOfTheDay.portfolio_projects && animatorOfTheDay.portfolio_projects.length > 1 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wide">More Work</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {animatorOfTheDay.portfolio_projects.slice(0, 4).map((project: any, idx: number) => (
                          <Link
                            key={idx}
                            href={`/profile/${animatorOfTheDay.id}`}
                            className="relative aspect-square rounded-lg overflow-hidden group"
                          >
                            <Image
                              src={project.url}
                              alt={project.title || `Portfolio ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Social links and CTA */}
                <div>
                  {/* Social media links */}
                  {(animatorOfTheDay.website || animatorOfTheDay.linkedin || animatorOfTheDay.instagram || animatorOfTheDay.twitter) && (
                    <div className="flex gap-3 mb-6">
                      {animatorOfTheDay.website && (
                        <a
                          href={animatorOfTheDay.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                          title="Website"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                        </a>
                      )}
                      {animatorOfTheDay.linkedin && (
                        <a
                          href={animatorOfTheDay.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                          title="LinkedIn"
                        >
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {animatorOfTheDay.instagram && (
                        <a
                          href={animatorOfTheDay.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                          title="Instagram"
                        >
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      )}
                      {animatorOfTheDay.twitter && (
                        <a
                          href={animatorOfTheDay.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                          title="Twitter"
                        >
                          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/profile/${animatorOfTheDay.id}`}
                    className="block w-full text-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
                  >
                    View Full Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl p-12 text-center">
            <p className="text-white text-xl">No animators available yet. Be the first to join!</p>
            <Link
              href="/auth/signup"
              className="inline-block mt-6 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>


      {/* New Users on the Network */}
      {latestUsers && latestUsers.length > 0 && (
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">New Users on the network</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestUsers.map((profile) => {
              const portfolioProjects = profile.portfolio_projects || []
              const featuredImage = portfolioProjects.find((p: any) => p.is_featured) || portfolioProjects[0]

              return (
                <div
                  key={profile.id}
                  className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow"
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
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                              {profile.full_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-white truncate group-hover:text-blue-200 transition-colors">
                            {profile.full_name}
                          </p>
                          <p className="text-sm text-blue-100 truncate">
                            {profile.city}, {profile.country}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {profile.bio && (
                      <p className="mb-4 text-sm text-blue-100 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}

                    {profile.specializations && profile.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.specializations.slice(0, 3).map((spec: string) => (
                          <span
                            key={spec}
                            className="inline-flex items-center rounded-full bg-white bg-opacity-20 backdrop-blur-sm px-3 py-0.5 text-xs font-medium text-white border border-white border-opacity-20"
                          >
                            {formatSpecialization(spec)}
                          </span>
                        ))}
                        {profile.specializations.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-white bg-opacity-10 backdrop-blur-sm px-3 py-0.5 text-xs font-medium text-blue-100 border border-white border-opacity-20">
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
        </div>
      )}

      <Footer />
    </div>
  )
}
