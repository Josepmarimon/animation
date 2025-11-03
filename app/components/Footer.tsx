import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">kframehub</h3>
            <p className="text-blue-100 text-sm">
              Connecting animation professionals worldwide
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/directory" className="text-blue-100 hover:text-white transition-colors">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="text-blue-100 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-blue-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/notice" className="text-blue-100 hover:text-white transition-colors">
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link href="/legal/copyright" className="text-blue-100 hover:text-white transition-colors">
                  Copyright Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white border-opacity-20">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-blue-100">
            <p>© {currentYear} kframehub. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">
              Contact: <a href="mailto:josep@estudicreatica.cat" className="hover:text-white transition-colors">josep@estudicreatica.cat</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
