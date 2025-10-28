import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/app/components/MobileMenu'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
                Anim a a a tion
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/directory"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
              >
                About
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  {userProfile?.avatar_url ? (
                    <Image
                      src={userProfile.avatar_url}
                      alt={userProfile.full_name || 'Profile'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                      {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-sm transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu - Visible on mobile */}
            <div className="flex items-center lg:hidden">
              <MobileMenu user={user} userProfile={userProfile} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        {/* Founder Section */}
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Photo */}
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden shadow-lg">
              <Image
                src="/demo-profiles/frank.jpeg"
                alt="Frank Maria"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Frank Maria</h2>
                <p className="text-xl text-gray-600 mb-6">Founder & Director</p>

                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p>
                    Dr. Frank Maria is a distinguished animator and educator with decades of experience in stop motion animation. He serves as Coordinator of the Stop Motion Animation Master's program and the Audiovisual Design Department at BAU, Centro Universitario de Artes y Diseño.
                  </p>

                  <p>
                    His career includes directing the acclaimed children's series "KOKI" (sold to 26 countries), leading the 9zeros animation center, and creating award-winning work for TV3. He holds a Doctorate in Audiovisual Mediation and continues to shape the next generation of animation professionals.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Credentials</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Doctorate in Audiovisual Mediation, BAU</li>
                    <li>• Master's in Fiction & Film Direction, Blanquerna</li>
                    <li>• Coordinator, Stop Motion Animation Master's Program</li>
                    <li>• Laus Silver Award Winner (2010)</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <a
                    href="http://www.mediacionaudiovisual.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    www.mediacionaudiovisual.com
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Partnership */}
        <div className="mt-20 border-t border-gray-200 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Partnership</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a
                  href="https://www.estudicreatica.cat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-48 h-48">
                    <Image
                      src="/demo-profiles/logo_creatica.png"
                      alt="Estudi Creàtica"
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Estudi Creàtica</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Communications agency specialized in the use of AI in different media production processes.
                </p>
                <a
                  href="https://www.estudicreatica.cat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  www.estudicreatica.cat
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Anim a a a tion connects animation professionals worldwide, providing a platform to showcase portfolios, discover talent, and build meaningful collaborations within the global animation community.
          </p>
        </div>
      </main>
    </div>
  )
}
