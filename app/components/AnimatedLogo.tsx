'use client'

import Link from 'next/link'

interface AnimatedLogoProps {
  className?: string
  textColor?: string
  darkColor?: string
}

export default function AnimatedLogo({
  className = "text-3xl sm:text-5xl lg:text-7xl font-bold tracking-wider",
  textColor = "text-white",
  darkColor = "text-black"
}: AnimatedLogoProps) {
  const text = "kframehub"
  const letters = text.split('')

  return (
    <Link href="/">
      <h1 className={className}>
        {letters.map((letter, index) => {
          // "frame" is at indices 1-5 (kframehub)
          const isFrameWord = index >= 1 && index <= 5
          const letterColor = isFrameWord ? 'text-black' : textColor

          return (
            <span
              key={index}
              className={`inline-block ${letterColor}`}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          )
        })}
      </h1>
    </Link>
  )
}
