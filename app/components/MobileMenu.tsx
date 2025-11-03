'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'

interface MobileMenuProps {
  user: any
  userProfile: {
    avatar_url?: string
    full_name?: string
  } | null
}

export default function MobileMenu({ user, userProfile }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuContent = isOpen ? (
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-64 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 shadow-xl z-[9999]">
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {user ? (
                  <>
                    {/* User Profile Link */}
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition-all"
                    >
                      {userProfile?.avatar_url ? (
                        <Image
                          src={userProfile.avatar_url}
                          alt={userProfile.full_name || 'Profile'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold">
                          {userProfile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      <span className="text-white font-medium">My Profile</span>
                    </Link>

                    <Link
                      href="/directory"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Directory
                    </Link>

                    <Link
                      href="/wall"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Walls
                    </Link>

                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      About
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/directory"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Directory
                    </Link>

                    <Link
                      href="/wall"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Walls
                    </Link>

                    <Link
                      href="/about"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      About
                    </Link>

                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Log in
                    </Link>

                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-gray-100 transition-all text-center shadow-lg"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
  ) : null

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-all"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        {!isOpen ? (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        ) : (
          <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Portal for Menu Overlay */}
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  )
}
