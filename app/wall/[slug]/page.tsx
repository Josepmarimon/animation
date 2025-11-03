import { createClient } from '@/lib/supabase/server'
import { createClient as createStaticClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import WallHeader from '../../components/walls/WallHeader'
import WallFeedClient from './WallFeedClient'
import Footer from '../../components/Footer'
import AnimatedLogo from '../../components/AnimatedLogo'
import MobileMenu from '../../components/MobileMenu'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  // Use static client for build-time generation (no cookies)
  const supabase = createStaticClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: walls } = await supabase
    .from('walls')
    .select('slug')
    .eq('is_active', true)

  return walls?.map((wall) => ({
    slug: wall.slug,
  })) || []
}

export default async function WallFeedPage({ params }: PageProps) {
  const { slug } = params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if logged in
  let userProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  // Get wall
  const { data: wall, error: wallError } = await supabase
    .from('walls')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (wallError || !wall) {
    notFound()
  }

  // Get posts for this wall
  const { data: postsData } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      media_urls,
      likes_count,
      comments_count,
      created_at,
      user_id,
      profiles!posts_user_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq('wall_id', wall.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  // Transform the data to match our interface
  const posts = postsData?.map(post => ({
    ...post,
    profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
  })) || []

  // Get user's likes if logged in
  let userLikes: string[] = []
  if (user) {
    const { data: likesData } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)

    userLikes = likesData?.map(like => like.post_id) || []
  }

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
            <div className="flex items-center">
              <AnimatedLogo />
            </div>

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

            <MobileMenu user={user} userProfile={userProfile} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/wall"
          className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to walls
        </Link>

        {/* Wall Header */}
        <WallHeader
          name={wall.name}
          description={wall.description || ''}
          icon={wall.icon || '💬'}
          color={wall.color || '#6366f1'}
          postsCount={wall.posts_count || 0}
        />

        {!user && (
          <div className="mb-8 rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6 text-center">
            <p className="text-blue-100 mb-3">You must be authenticated to create posts</p>
            <Link
              href="/auth/login"
              className="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-blue-700 hover:bg-gray-100 transition-all"
            >
              Log in
            </Link>
          </div>
        )}

        {/* Client-side posts feed */}
        <WallFeedClient
          initialWall={wall}
          initialPosts={posts}
          initialUserLikes={userLikes}
          currentUserId={user?.id}
        />
      </div>

      <Footer />
    </div>
  )
}
