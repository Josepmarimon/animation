import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'
import Footer from '@/app/components/Footer'

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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center">
              <AnimatedLogo />
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/directory"
                className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all"
              >
                About
              </Link>
              {user ? (
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
              ) : (
                <>
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

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
          <div className="w-24 h-1 bg-white bg-opacity-50 mx-auto"></div>
        </div>

        {/* Founder Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-12">
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
                <h2 className="text-3xl font-bold text-white mb-2">Frank Maria</h2>
                <p className="text-xl text-blue-100 mb-6">Founder & Director</p>

                <div className="prose prose-lg text-white space-y-4">
                  <p>
                    Dr. Frank Maria is a distinguished animator and educator with decades of experience in stop motion animation. He serves as Coordinator of the Stop Motion Animation Master's program and the Audiovisual Design Department at BAU, Centro Universitario de Artes y Diseño.
                  </p>

                  <p>
                    His career includes directing the acclaimed children's series "KOKI" (sold to 26 countries), leading the 9zeros animation center, and creating award-winning work for TV3. He holds a Doctorate in Audiovisual Mediation and continues to shape the next generation of animation professionals.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                  <h3 className="text-sm font-semibold text-white mb-3">Credentials</h3>
                  <ul className="space-y-2 text-sm text-blue-100">
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
                    className="inline-flex items-center text-blue-200 hover:text-blue-100 font-medium"
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
        <div className="mt-20 border-t border-white border-opacity-20 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Technical Partnership</h2>
            <div className="w-24 h-1 bg-white bg-opacity-50 mx-auto"></div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a
                  href="https://www.estudicreatica.cat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-48 h-48 bg-white rounded-lg p-4">
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
                <h3 className="text-2xl font-bold text-white mb-3">Estudi Creàtica</h3>
                <p className="text-lg text-blue-100 mb-4">
                  Communications agency specialized in the use of AI in different media production processes.
                </p>
                <a
                  href="https://www.estudicreatica.cat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-200 hover:text-blue-100 font-medium"
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
        <div className="mt-20 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            kframehub connects animation professionals worldwide, providing a platform to showcase portfolios, discover talent, and build meaningful collaborations within the global animation community.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
