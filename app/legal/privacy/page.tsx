import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'

export default async function PrivacyPolicyPage() {
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
            <div className="flex items-center">
              <AnimatedLogo />
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/directory"
                className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
              >
                Directory
              </Link>
              <Link
                href="/about"
                className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
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

            <MobileMenu user={user} userProfile={userProfile} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-blue-100 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-white">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Data Controller</h2>
              <p className="text-blue-100">
                The data controller for kframehub is:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Name: Josep Maria Marimon Soler</li>
                <li>Tax ID: 38129834C</li>
                <li>Address: Passatge Borrell n.1, pis 3º3ª, Barcelona 08005, España</li>
                <li>Contact: josep(at)estudicreatica.cat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Data We Collect</h2>
              <p className="text-blue-100 mb-3">
                We collect and process the following personal data:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Account Information:</strong> Email address, full name, password (encrypted)</li>
                <li><strong>Profile Information:</strong> City, country, biography, specializations, website, social media links</li>
                <li><strong>Portfolio Content:</strong> Images and project descriptions you upload</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information (stored by Supabase for security)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Legal Basis for Processing</h2>
              <p className="text-blue-100">
                We process your personal data based on:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Contract Performance:</strong> To provide you with the services you requested (Art. 6.1.b GDPR)</li>
                <li><strong>Legitimate Interest:</strong> To maintain platform security and prevent fraud (Art. 6.1.f GDPR)</li>
                <li><strong>Consent:</strong> For making your profile public and displaying your portfolio (Art. 6.1.a GDPR)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. How We Use Your Data</h2>
              <p className="text-blue-100">
                Your personal data is used exclusively for:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Creating and managing your user account</li>
                <li>Displaying your public profile (only if you choose to make it public)</li>
                <li>Enabling other users to discover and contact animation professionals</li>
                <li>Sending essential service communications (account verification, password reset)</li>
                <li>Maintaining platform security and preventing abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Data Sharing</h2>
              <p className="text-blue-100 mb-3">
                We do not sell your personal data. We only share data with:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Supabase:</strong> Our database and authentication provider (data stored in EU servers)</li>
                <li><strong>Vercel:</strong> Our hosting provider</li>
                <li><strong>Public Display:</strong> If you choose to make your profile public, your profile information and portfolio will be visible to all platform visitors</li>
              </ul>
              <p className="text-blue-100 mt-3">
                We do not use analytics, tracking cookies, or share your data with advertising networks.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Cookies</h2>
              <p className="text-blue-100">
                We only use essential cookies required for:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>User authentication and session management</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-blue-100 mt-3">
                We do not use tracking, analytics, or advertising cookies. You can disable cookies in your browser, but this may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Data Retention</h2>
              <p className="text-blue-100">
                We retain your personal data for as long as your account is active. When you delete your account, all personal data is permanently removed within 30 days, except data we are legally required to retain for tax or legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Your Rights (GDPR)</h2>
              <p className="text-blue-100 mb-3">
                Under the GDPR, you have the right to:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Restriction:</strong> Request limitation of data processing</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for making your profile public at any time</li>
              </ul>
              <p className="text-blue-100 mt-3">
                To exercise these rights, contact us at: josep(at)estudicreatica.cat
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Data Security</h2>
              <p className="text-blue-100">
                We implement industry-standard security measures to protect your personal data, including:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Encrypted password storage</li>
                <li>HTTPS encryption for all data transmissions</li>
                <li>Regular security updates and monitoring</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. International Data Transfers</h2>
              <p className="text-blue-100">
                Your data is stored on Supabase servers located in the European Union. We do not transfer personal data outside the EU/EEA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Children's Privacy</h2>
              <p className="text-blue-100">
                Our platform is not intended for users under 16 years of age. We do not knowingly collect personal data from children under 16. If we become aware that we have collected data from a child under 16, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Changes to This Policy</h2>
              <p className="text-blue-100">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or through a prominent notice on our platform. Continued use of the platform after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Supervisory Authority</h2>
              <p className="text-blue-100">
                If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos - AEPD):
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Website: www.aepd.es</li>
                <li>Address: C/ Jorge Juan, 6, 28001 Madrid, España</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Information</h2>
              <p className="text-blue-100">
                For any questions about this Privacy Policy or to exercise your data protection rights, contact us at:
              </p>
              <p className="text-blue-100 mt-2">
                Email: josep(at)estudicreatica.cat<br />
                Response time: Within 48 hours
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
