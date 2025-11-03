import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'

export default async function TermsOfServicePage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-blue-100 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-white">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-blue-100">
                By accessing or using kframehub ("the Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Platform Description</h2>
              <p className="text-blue-100">
                kframehub is a directory platform that connects animation professionals worldwide. The Platform allows users to create profiles, showcase portfolios, and discover other animation professionals. The Platform is currently provided free of charge, though we reserve the right to introduce premium features or advertising in the future.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.1 Eligibility</h3>
              <p className="text-blue-100">
                You must be at least 16 years old to use this Platform. By creating an account, you represent that you meet this age requirement.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.2 Account Security</h3>
              <p className="text-blue-100">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.3 Accurate Information</h3>
              <p className="text-blue-100">
                You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. User Content</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Content Ownership</h3>
              <p className="text-blue-100">
                You retain all ownership rights to the content you upload to the Platform, including profile information, portfolio images, and project descriptions ("User Content"). By uploading User Content, you grant kframehub a non-exclusive, worldwide, royalty-free license to display, reproduce, and distribute your User Content solely for the purpose of operating and promoting the Platform.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Content Responsibility</h3>
              <p className="text-blue-100 mb-3">
                <strong>YOU ARE SOLELY RESPONSIBLE FOR YOUR USER CONTENT.</strong> You represent and warrant that:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>You own or have the necessary rights, licenses, and permissions to upload and share your User Content</li>
                <li>Your User Content does not infringe any third-party intellectual property rights, including copyrights, trademarks, or patents</li>
                <li>Your User Content does not violate any applicable laws or regulations</li>
                <li>Your User Content does not contain defamatory, obscene, pornographic, or illegal material</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Prohibited Content</h3>
              <p className="text-blue-100 mb-3">
                You agree NOT to upload User Content that:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Infringes third-party intellectual property rights</li>
                <li>Contains hate speech, harassment, or promotes violence</li>
                <li>Contains pornographic, obscene, or sexually explicit material</li>
                <li>Promotes illegal activities or violates any laws</li>
                <li>Contains malware, viruses, or malicious code</li>
                <li>Impersonates another person or entity</li>
                <li>Contains spam, advertising, or promotional material (unless part of your legitimate portfolio)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.4 Content Moderation</h3>
              <p className="text-blue-100">
                We reserve the right, but have no obligation, to monitor, review, or remove User Content at our sole discretion. We may remove content that violates these Terms or applicable law without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.1 Platform Rights</h3>
              <p className="text-blue-100">
                The Platform, including its design, layout, software, code, graphics, and all other elements (excluding User Content), is owned by Josep Maria Marimon Soler and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.2 Restrictions</h3>
              <p className="text-blue-100">
                You may not copy, modify, distribute, sell, or lease any part of the Platform or its software, nor may you reverse engineer or attempt to extract the source code, unless explicitly permitted by law or with our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Limitation of Liability</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.1 Platform Provided "As Is"</h3>
              <p className="text-blue-100">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.2 No Liability for User Content</h3>
              <p className="text-blue-100">
                <strong>WE ARE NOT RESPONSIBLE FOR USER CONTENT.</strong> We do not endorse, support, verify, or guarantee the accuracy, completeness, or quality of any User Content. Users upload content at their own risk and are solely responsible for ensuring they have the legal right to share such content.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.3 Limitation of Damages</h3>
              <p className="text-blue-100">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1 mt-2">
                <li>Your use or inability to use the Platform</li>
                <li>Any User Content or conduct of users</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any content obtained from the Platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.4 Copyright Infringement Claims</h3>
              <p className="text-blue-100">
                While we take copyright infringement seriously, we are not liable for copyright infringement by users. If your content is infringed, your remedy is against the infringing user, not against the Platform. See our Copyright Policy for the proper procedure to report infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Indemnification</h2>
              <p className="text-blue-100">
                You agree to indemnify, defend, and hold harmless kframehub, Josep Maria Marimon Soler, and our affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1 mt-2">
                <li>Your use of the Platform</li>
                <li>Your User Content</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights, including intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Account Termination</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">8.1 Termination by User</h3>
              <p className="text-blue-100">
                You may delete your account at any time through your profile settings. Upon deletion, your personal data will be removed in accordance with our Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">8.2 Termination by Platform</h3>
              <p className="text-blue-100">
                We reserve the right to suspend or terminate your account and access to the Platform at our sole discretion, without notice, for conduct that we believe:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1 mt-2">
                <li>Violates these Terms or our policies</li>
                <li>Harms other users or the Platform</li>
                <li>Exposes us to legal liability</li>
                <li>Is fraudulent, abusive, or illegal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Future Changes</h2>
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.1 Premium Features</h3>
              <p className="text-blue-100">
                We reserve the right to introduce premium paid features in the future. Free users will be notified of any changes to available features.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.2 Advertising</h3>
              <p className="text-blue-100">
                We reserve the right to display advertising on the Platform in the future. If we introduce advertising, we will update our Privacy Policy accordingly and notify users of any changes to data collection practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Modifications to Terms</h2>
              <p className="text-blue-100">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by email or through a prominent notice on the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Governing Law and Jurisdiction</h2>
              <p className="text-blue-100">
                These Terms are governed by Spanish law. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Barcelona, Spain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Severability</h2>
              <p className="text-blue-100">
                If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Contact Information</h2>
              <p className="text-blue-100">
                For questions about these Terms, contact us at:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1 mt-2">
                <li>Email: josep(at)estudicreatica.cat</li>
                <li>Address: Passatge Borrell n.1, pis 3º3ª, Barcelona 08005, España</li>
                <li>Response time: Within 48 hours</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
