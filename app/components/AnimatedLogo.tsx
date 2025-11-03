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

  // Count only non-space characters for delay calculation
  let letterCount = 0

  return (
    <Link href="/">
      <h1 className={className}>
        {letters.map((letter, index) => {
          const isSpace = letter === ' '
          const delay = isSpace ? 0 : letterCount * 0.5
          if (!isSpace) letterCount++

          return (
            <span
              key={index}
              className={`inline-block ${textColor} ${!isSpace ? 'animate-letter-fade' : ''}`}
              style={{
                animationDelay: !isSpace ? `${delay}s` : undefined,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          )
        })}
      </h1>
      <style jsx>{`
        @keyframes letter-fade {
          0%, 24.99% {
            color: ${textColor === 'text-white' ? '#ffffff' : textColor === 'text-gray-900' ? '#1f2937' : '#ffffff'};
          }
          25%, 74.99% {
            color: ${darkColor === 'text-black' ? '#000000' : '#ffffff'};
          }
          75%, 100% {
            color: ${textColor === 'text-white' ? '#ffffff' : textColor === 'text-gray-900' ? '#1f2937' : '#ffffff'};
          }
        }
        .animate-letter-fade {
          animation: letter-fade 1s steps(3, jump-none) forwards;
        }
      `}</style>
    </Link>
  )
}
