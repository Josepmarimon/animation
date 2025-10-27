'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// Curated animation-related images from Unsplash (royalty-free)
const images = [
  {
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    alt: 'Animation workspace with tablet'
  },
  {
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    alt: 'Creative artist workspace'
  },
  {
    url: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800&q=80',
    alt: 'Digital art and animation'
  },
  {
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    alt: 'Creative design studio'
  },
  {
    url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    alt: 'Artist drawing and sketching'
  },
  {
    url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80',
    alt: '3D animation and modeling'
  },
  {
    url: 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800&q=80',
    alt: 'Animation production workspace'
  },
  {
    url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
    alt: 'Creative studio setup'
  },
]

export default function FilmstripGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 0.5

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
    }

    const intervalId = setInterval(scroll, 30)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 py-8">
      {/* Filmstrip holes at top */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-800 flex items-center justify-around px-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-3 h-2 bg-gray-900 rounded-sm" />
        ))}
      </div>

      {/* Scrolling images container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden px-4 py-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Duplicate images for seamless loop */}
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-80 h-48 border-4 border-gray-800 rounded-sm shadow-xl overflow-hidden"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Filmstrip holes at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-800 flex items-center justify-around px-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="w-3 h-2 bg-gray-900 rounded-sm" />
        ))}
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none mix-blend-overlay" />
    </div>
  )
}
