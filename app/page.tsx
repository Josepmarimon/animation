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

      {/* Hero Section - Full Screen */}
      <div className="relative z-10 flex items-end sm:items-center justify-center px-4 sm:px-6 lg:px-8 pb-[200px] sm:pb-0 h-screen sm:h-auto sm:py-16" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl mb-6 sm:mb-8 animate-fade-in">
            Find and connect with
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              animation professionals
            </span>
          </h2>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {!user ? (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto rounded-xl bg-white px-10 py-5 sm:px-10 sm:py-5 text-lg sm:text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
                >
                  Get started free
                </Link>
                <Link
                  href="/directory"
                  className="w-full sm:w-auto rounded-xl bg-white bg-opacity-20 backdrop-blur-sm px-10 py-5 sm:px-10 sm:py-5 text-lg sm:text-lg font-semibold text-white hover:bg-opacity-30 transform hover:scale-105 transition-all duration-200"
                >
                  Browse directory →
                </Link>
              </>
            ) : (
              <Link
                href="/directory"
                className="w-full sm:w-auto rounded-xl bg-white px-10 py-5 sm:px-10 sm:py-5 text-lg sm:text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
              >
                Browse directory →
              </Link>
            )}
          </div>
        </div>
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
