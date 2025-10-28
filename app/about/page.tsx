import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

export default async function AboutPage() {
  const supabase = createServerComponentClient({ cookies })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white bg-opacity-70 shadow-sm border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-wider">
                Anim a a a tion
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/directory"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 backdrop-blur-sm bg-white bg-opacity-50 rounded-lg border border-white border-opacity-50 hover:bg-opacity-70 transition-all"
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 backdrop-blur-sm bg-white bg-opacity-50 rounded-lg border border-white border-opacity-50 hover:bg-opacity-70 transition-all"
              >
                About
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all border-2 border-white border-opacity-20 overflow-hidden"
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
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 backdrop-blur-sm bg-white bg-opacity-50 rounded-lg border border-white border-opacity-50 hover:bg-opacity-70 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="backdrop-blur-md bg-white bg-opacity-70 rounded-2xl shadow-xl border border-white border-opacity-20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-2">About Us</h1>
            <p className="text-blue-100 text-lg">Meet the creator of Anim a a a tion</p>
          </div>

          {/* Profile Section */}
          <div className="px-8 py-12">
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white mb-6">
                <Image
                  src="https://www.baued.es/uploads/media/default/0001/18/de3f802649df8d1bec9e5149431222e591b7ef2b.jpeg"
                  alt="Frank Maria"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Frank Maria</h2>
              <p className="text-lg text-purple-600 font-medium mb-4">Platform Creator & Stop Motion Master</p>
              <a
                href="http://www.mediacionaudiovisual.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                www.mediacionaudiovisual.com
              </a>
            </div>

            {/* Bio */}
            <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
              <p className="text-xl leading-relaxed">
                Dr. Frank Maria is a distinguished animator, educator, and coordinator who has dedicated decades to the art and pedagogy of stop motion animation. As the Coordinator of the Stop Motion Animation Master's program and the Audiovisual Design Department at BAU, he has shaped the next generation of animation professionals through his extensive expertise and passion for the craft.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Journey</h3>
                <p className="leading-relaxed">
                  Frank's animation career began in 1996 with specialized training at the Faculty of Art Media and Design in Bristol, England. After completing his Fine Arts degree specializing in Image, he joined CINENIC, a production company dedicated to stop motion animation, where he animated the children's series "KOKI"—13 episodes of clay animation sold to 26 countries—and numerous television commercials using various stop motion techniques.
                </p>
              </div>

              <p className="leading-relaxed">
                From 2002 to 2006, Frank served as Academic Director of 9zeros, the Center for Animation Techniques Studies of Catalunya, where he participated in "Teaching with Animation," a training program funded by the European Union's Media programme. As director of Animaldía production company, he created various bumpers and opening sequences for TV3, including notable works for the cultural program "Anima" and the Christmas promotion "Aquí és Nadal i estic content."
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Excellence</h3>
                <p className="leading-relaxed mb-4">
                  Dr. Maria holds a Doctorate from BAU's Doctoral School, focusing on Audiovisual Mediation in university environments, along with an Official Master's in Fiction, Screenwriting, and Film and TV Direction from Blanquerna, and a Fine Arts degree from the University of Barcelona.
                </p>
                <p className="leading-relaxed">
                  As an educator, he has taught various animation techniques—including clay animation, cut-out, sand, and glass painting—as well as cinematographic language and storyboarding at institutions such as TV3, SGAE, MACBA, festivals, civic centers, and the Youth Department of Tarragona.
                </p>
              </div>

              <p className="leading-relaxed">
                His contributions to the field extend beyond the classroom through conferences on animation at educational centers worldwide, publications on the social responsibility of audiovisual designers, and recognition including a Laus Silver award for the opening sequence of TV3's cultural program "Anima" in 2010.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <p className="text-lg font-semibold text-gray-900 italic text-center">
                  "Through Anim a a a tion, Frank Maria continues his mission to connect, showcase, and empower animation professionals worldwide, creating a vibrant community where artists can share their work, find collaborators, and grow together."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
