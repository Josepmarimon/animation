import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/app/components/MobileMenu'
import AnimatedLogo from '@/app/components/AnimatedLogo'

export default async function CopyrightPolicyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Copyright & Intellectual Property Policy</h1>
          <p className="text-blue-100 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-white">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Respect for Intellectual Property</h2>
              <p className="text-blue-100">
                kframehub respects the intellectual property rights of others and expects users to do the same. This policy outlines our procedures for addressing claims of copyright infringement and other intellectual property violations on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. User Responsibility</h2>
              <p className="text-blue-100 mb-3">
                <strong>Users are solely responsible for ensuring they have the legal right to upload and share content on kframehub.</strong> By uploading content to the platform, you represent and warrant that:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>You are the original creator of the content, or you have obtained all necessary rights, licenses, and permissions from the copyright holder(s)</li>
                <li>Your content does not infringe any third-party copyrights, trademarks, patents, or other intellectual property rights</li>
                <li>You have obtained necessary releases from any individuals whose likeness appears in your content</li>
                <li>Your content complies with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Platform Liability Limitation</h2>
              <p className="text-blue-100">
                <strong>kframehub is a platform that hosts user-generated content and acts as a neutral intermediary.</strong> We do not:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Pre-screen, review, or approve user content before publication</li>
                <li>Verify users' ownership or licensing rights to uploaded content</li>
                <li>Endorse, support, or guarantee the accuracy or legality of user content</li>
                <li>Assume liability for copyright infringement or intellectual property violations by users</li>
              </ul>
              <p className="text-blue-100 mt-3">
                Users upload content at their own risk. If your intellectual property rights are infringed by user content, your legal remedy is against the infringing user, not against kframehub, subject to the notification and takedown procedure described below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Notice and Takedown Procedure</h2>
              <p className="text-blue-100 mb-3">
                If you believe that content on kframehub infringes your copyright or other intellectual property rights, you may submit a notice to us. We will review valid notices and may remove infringing content at our discretion.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Required Information</h3>
              <p className="text-blue-100 mb-3">
                To submit a valid infringement notice, you must provide the following information to josep(at)estudicreatica.cat:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Your identification:</strong> Full name, address, telephone number, and email address</li>
                <li><strong>Rights holder information:</strong> If you are acting on behalf of the rights holder, provide authorization documentation</li>
                <li><strong>Description of copyrighted work:</strong> Detailed description of the work you claim has been infringed, including registration number if applicable</li>
                <li><strong>Location of infringing content:</strong> Specific URL(s) or location of the allegedly infringing content on kframehub</li>
                <li><strong>Good faith statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law</li>
                <li><strong>Accuracy statement:</strong> A statement under penalty of perjury that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf</li>
                <li><strong>Physical or electronic signature:</strong> Your physical or electronic signature</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Submission</h3>
              <p className="text-blue-100">
                Send your complete infringement notice to:<br />
                <strong>Email:</strong> josep(at)estudicreatica.cat<br />
                <strong>Subject line:</strong> "Copyright Infringement Notice - kframehub"
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Response Time</h3>
              <p className="text-blue-100">
                We will acknowledge receipt of valid notices within 48 hours and investigate the claim. If we determine that content is infringing, we may remove or disable access to the content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Counter-Notice Procedure</h2>
              <p className="text-blue-100 mb-3">
                If your content was removed due to a copyright infringement claim and you believe the removal was made in error or that you have the right to use the content, you may submit a counter-notice.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.1 Required Information for Counter-Notice</h3>
              <p className="text-blue-100 mb-3">
                Your counter-notice must include:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li><strong>Your identification:</strong> Full name, address, telephone number, and email address</li>
                <li><strong>Description of removed content:</strong> Identification of the content that was removed and its previous location</li>
                <li><strong>Good faith statement:</strong> A statement under penalty of perjury that you have a good faith belief that the content was removed by mistake or misidentification</li>
                <li><strong>Consent to jurisdiction:</strong> A statement that you consent to the jurisdiction of the courts of Barcelona, Spain</li>
                <li><strong>Physical or electronic signature:</strong> Your physical or electronic signature</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.2 Counter-Notice Process</h3>
              <p className="text-blue-100">
                Upon receiving a valid counter-notice, we will forward it to the party who submitted the original infringement notice. If the original complainant does not file a legal action within 10-14 business days, we may restore the removed content at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Repeat Infringers</h2>
              <p className="text-blue-100">
                kframehub reserves the right to terminate the accounts of users who are repeat infringers of intellectual property rights. We may terminate an account after receiving multiple valid infringement notices regarding content uploaded by the same user.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. False Claims</h2>
              <p className="text-blue-100">
                Submitting false or misleading copyright infringement claims or counter-notices may result in legal liability. Under Spanish law and international copyright treaties, knowingly making false claims may subject you to damages, including costs and attorneys' fees. We may terminate accounts that submit fraudulent or abusive notices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Other Intellectual Property Rights</h2>
              <p className="text-blue-100">
                This policy applies to all forms of intellectual property infringement, including but not limited to:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Copyright infringement</li>
                <li>Trademark infringement</li>
                <li>Patent infringement</li>
                <li>Trade secret misappropriation</li>
                <li>Violation of publicity or privacy rights</li>
              </ul>
              <p className="text-blue-100 mt-3">
                For non-copyright intellectual property claims, follow the same notice procedure outlined in Section 4.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. User-to-User Disputes</h2>
              <p className="text-blue-100">
                <strong>kframehub is not a party to disputes between users regarding intellectual property rights.</strong> If you believe another user has infringed your rights, you may:
              </p>
              <ul className="text-blue-100 list-disc pl-6 space-y-1">
                <li>Submit an infringement notice following the procedure in Section 4</li>
                <li>Contact the user directly to resolve the dispute (if contact information is available)</li>
                <li>Pursue legal action against the infringing user</li>
              </ul>
              <p className="text-blue-100 mt-3">
                We encourage users to resolve disputes amicably when possible. However, kframehub cannot mediate disputes or provide legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Educational Use and Fair Use</h2>
              <p className="text-blue-100">
                While kframehub respects copyright, we also recognize that certain uses of copyrighted material may be permitted under fair use or fair dealing doctrines. However, determining whether a particular use qualifies as fair use is a complex legal analysis. Users who believe their use of copyrighted material is protected should be prepared to defend that position if challenged.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. International Considerations</h2>
              <p className="text-blue-100">
                kframehub operates internationally and respects intellectual property laws of multiple jurisdictions. Copyright and intellectual property laws vary by country. This policy is designed to comply with Spanish law, EU directives, and international copyright treaties. Users from other jurisdictions should be aware that their local laws may provide additional or different protections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Modifications to This Policy</h2>
              <p className="text-blue-100">
                We reserve the right to modify this Copyright Policy at any time. Significant changes will be communicated to users by email or through a prominent notice on the platform. Continued use of kframehub after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Legal Disclaimer</h2>
              <p className="text-blue-100">
                This policy is provided for informational purposes and does not constitute legal advice. For specific legal questions about intellectual property rights, consult a qualified attorney. kframehub does not provide legal advice or assistance with copyright matters beyond the procedures outlined in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Information</h2>
              <p className="text-blue-100">
                For copyright infringement notices, counter-notices, or questions about this policy, contact:
              </p>
              <ul className="text-blue-100 list-none space-y-2 mt-3">
                <li><strong>Email:</strong> josep(at)estudicreatica.cat</li>
                <li><strong>Subject:</strong> "Copyright Infringement Notice - kframehub" or "Counter-Notice - kframehub"</li>
                <li><strong>Postal Address:</strong> Passatge Borrell n.1, pis 3º3ª, Barcelona 08005, España</li>
                <li><strong>Response Time:</strong> Within 48 hours for valid notices</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-blue-100 text-sm italic">
                Note: This Copyright Policy is designed to provide a clear framework for addressing intellectual property issues while limiting platform liability. By using kframehub, you acknowledge that users are responsible for ensuring they have proper rights to their content, and that intellectual property disputes are primarily between users and rights holders, not between users and the platform.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
