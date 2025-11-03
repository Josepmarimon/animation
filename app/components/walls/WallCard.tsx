import Link from 'next/link'

interface WallCardProps {
  slug: string
  name: string
  description: string
  icon: string
  color: string
  postsCount: number
}

export default function WallCard({
  slug,
  name,
  description,
  icon,
  color,
  postsCount,
}: WallCardProps) {
  return (
    <Link
      href={`/wall/${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6 transition-all hover:bg-opacity-20 hover:scale-105 hover:shadow-2xl"
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      {/* Icon */}
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl text-4xl"
        style={{ backgroundColor: `${color}33` }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-blue-100 line-clamp-2">{description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center text-xs text-blue-200">
        <svg
          className="mr-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <span>{postsCount} {postsCount === 1 ? 'post' : 'posts'}</span>
      </div>

      {/* Hover arrow indicator */}
      <div className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  )
}
