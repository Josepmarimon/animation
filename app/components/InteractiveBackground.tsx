'use client'

import { useState, useEffect } from 'react'

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
      {/* Background Image with Hover */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-70 cursor-help bg-[length:100%_auto] sm:bg-cover"
        style={{ backgroundImage: 'url(/demo-profiles/fondo.jpg)' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-indigo-700/50 to-purple-800/50 pointer-events-none"></div>

      {/* Popup that follows cursor */}
      {isHovering && (
        <div
          className="fixed z-50 pointer-events-none"
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
