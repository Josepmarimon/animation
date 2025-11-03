import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import WallCard from '../components/walls/WallCard'
import Footer from '../components/Footer'
import AnimatedLogo from '../components/AnimatedLogo'
import MobileMenu from '../components/MobileMenu'
import Image from 'next/image'

export default async function WallsPage() {
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

  // Get all active walls
  const { data: walls } = await supabase
    .from('walls')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
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
            {/* Logo */}
            <div className="flex items-center">
              <AnimatedLogo />
            </div>

            {/* Desktop Navigation */}
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
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all"
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
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all"
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

            {/* Mobile Menu */}
            <MobileMenu user={user} userProfile={userProfile} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4">Community Walls</h1>
          <p className="text-lg text-blue-100">
            Explora diferents espais temàtics per compartir idees, projectes i connectar amb altres professionals
          </p>
        </div>

        {/* Walls Grid */}
        {walls && walls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walls.map((wall) => (
              <WallCard
                key={wall.id}
                slug={wall.slug}
                name={wall.name}
                description={wall.description || ''}
                icon={wall.icon || '💬'}
                color={wall.color || '#6366f1'}
                postsCount={wall.posts_count || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-12">
              <h3 className="text-xl font-semibold text-white mb-2">Cap mur disponible</h3>
              <p className="text-blue-100">
                Els murs estaran disponibles aviat. Torna més tard!
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
