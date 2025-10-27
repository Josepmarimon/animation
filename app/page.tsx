import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Animation Directory
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/directory"
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all"
                  >
                    Directory
                  </Link>
                </>
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
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 5rem)' }}>
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl mb-8 animate-fade-in">
            Find and connect with
            <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              animation professionals
            </span>
          </h2>
          <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-blue-100 max-w-3xl mx-auto">
            Join the largest community of animation professionals.
            Share your portfolio, find collaborators, and grow your network.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            {!user ? (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto rounded-xl bg-white px-10 py-5 text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
                >
                  Get started free
                </Link>
                <Link
                  href="/directory"
                  className="w-full sm:w-auto rounded-xl bg-white bg-opacity-20 backdrop-blur-sm px-10 py-5 text-lg font-semibold text-white hover:bg-opacity-30 transform hover:scale-105 transition-all duration-200"
                >
                  Browse directory →
                </Link>
              </>
            ) : (
              <Link
                href="/directory"
                className="w-full sm:w-auto rounded-xl bg-white px-10 py-5 text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
              >
                Browse directory →
              </Link>
            )}
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Profiles</h3>
              <p className="text-blue-100 text-sm">
                Showcase your portfolio, specialties, and experience
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Filters</h3>
              <p className="text-blue-100 text-sm">
                Find talent by specialty, location, and skills
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white bg-opacity-20">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Portfolio Showcase</h3>
              <p className="text-blue-100 text-sm">
                Display your best work with images and descriptions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
