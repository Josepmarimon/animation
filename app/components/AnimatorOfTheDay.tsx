'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AnimatorOfTheDayProps {
  animator: any
}

function formatSpecialization(spec: string): string {
  return spec
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AnimatorOfTheDay({ animator }: AnimatorOfTheDayProps) {
  // Get featured image or first portfolio image
  const portfolioProjects = animator.portfolio_projects || []
  const initialFeatured = portfolioProjects.find((p: any) => p.is_featured) || portfolioProjects[0]

  const [selectedImage, setSelectedImage] = useState(initialFeatured)

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left side - Featured Image */}
        <div className="relative aspect-square lg:aspect-auto lg:min-h-[600px] bg-gradient-to-br from-blue-100 to-indigo-100">
          {selectedImage ? (
            <Image
              src={selectedImage.url}
              alt={selectedImage.title || animator.full_name}
              fill
              className="object-cover transition-opacity duration-300"
            />
          ) : animator.avatar_url ? (
            <Image
              src={animator.avatar_url}
              alt={animator.full_name || 'Profile'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-8xl shadow-lg">
                {animator.full_name?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Info */}
        <div className="p-8 lg:p-12 flex flex-col justify-between">
          {/* Header with avatar and name */}
          <div>
            <Link href={`/profile/${animator.id}`} className="flex items-center gap-4 mb-6 group">
              {animator.avatar_url ? (
                <Image
                  src={animator.avatar_url}
                  alt={animator.full_name || 'Avatar'}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white border-opacity-30"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl border-4 border-white border-opacity-30">
                  {animator.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div>
                <h3 className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {animator.full_name}
                </h3>
                <p className="text-blue-100 text-lg">
                  {animator.city}, {animator.country}
                </p>
              </div>
            </Link>

            {/* Bio */}
            {animator.bio && (
              <p className="text-white text-lg mb-6 leading-relaxed">
                {animator.bio}
              </p>
            )}

            {/* Specializations */}
            {animator.specializations && animator.specializations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wide">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {animator.specializations.map((spec: string) => (
                    <span
                      key={spec}
                      className="inline-flex items-center rounded-full bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white border border-white border-opacity-20"
                    >
                      {formatSpecialization(spec)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio thumbnails */}
            {portfolioProjects.length > 1 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-blue-200 mb-3 uppercase tracking-wide">More Work</h4>
                <div className="grid grid-cols-4 gap-2">
                  {portfolioProjects.slice(0, 4).map((project: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(project)}
                      className={`relative aspect-square rounded-lg overflow-hidden group cursor-pointer transition-all ${
                        selectedImage?.url === project.url
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent'
                          : ''
                      }`}
                    >
                      <Image
                        src={project.url}
                        alt={project.title || `Portfolio ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {selectedImage?.url === project.url && (
                        <div className="absolute inset-0 bg-white bg-opacity-20 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social links and CTA */}
          <div>
            {/* Social media links */}
            {(animator.website || animator.linkedin || animator.instagram || animator.twitter) && (
              <div className="flex gap-3 mb-6">
                {animator.website && (
                  <a
                    href={animator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                    title="Website"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </a>
                )}
                {animator.linkedin && (
                  <a
                    href={animator.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                    title="LinkedIn"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {animator.instagram && (
                  <a
                    href={animator.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                    title="Instagram"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {animator.twitter && (
                  <a
                    href={animator.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all text-white"
                    title="Twitter"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={`/profile/${animator.id}`}
              className="block w-full text-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-2xl hover:bg-gray-100 hover:scale-105 transform transition-all duration-200"
            >
              View Full Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
