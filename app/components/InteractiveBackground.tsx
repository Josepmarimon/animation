'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function InteractiveBackground() {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <>
      {/* Mobile: Image as element */}
      <div className="absolute inset-0 sm:hidden flex items-center justify-center px-4 py-8 z-[1]">
        <div className="relative w-full max-w-md opacity-70">
          <Image
            src="/demo-profiles/fondo.jpg"
            alt="Vokabulantis"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Desktop: Background Image with Hover */}
      <div
        className="hidden sm:block absolute inset-0 bg-center bg-no-repeat opacity-70 cursor-help bg-cover z-[1]"
        style={{ backgroundImage: 'url(/demo-profiles/fondo.jpg)' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      ></div>

      {/* Gradient Overlay - Hidden on mobile to show image clearly */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-br from-blue-600/50 via-indigo-700/50 to-purple-800/50 pointer-events-none z-[2]"></div>

      {/* Popup that follows cursor - Desktop only */}
      {isHovering && (
        <div
          className="fixed z-50 pointer-events-none hidden sm:block"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
          }}
        >
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-2xl border border-white border-opacity-30 p-3 max-w-xs">
            <p className="text-xs text-white leading-relaxed">
              <span className="font-semibold text-blue-100">&quot;Vokabulantis&quot;</span> is a video game created by{' '}
              <span className="font-medium">Morten Søndergaard</span>, animator{' '}
              <span className="font-medium">Johan Oettinger</span>, and the studio that brings the puppets to life,{' '}
              <span className="font-medium">Wired Fly</span>.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
