interface WallHeaderProps {
  name: string
  description: string
  icon: string
  color: string
  postsCount: number
}

export default function WallHeader({ name, description, icon, color, postsCount }: WallHeaderProps) {
  return (
    <div
      className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8 mb-8"
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl text-5xl"
          style={{ backgroundColor: `${color}33` }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold text-white">{name}</h1>
          <p className="mb-4 text-blue-100">{description}</p>

          <div className="flex items-center text-sm text-blue-200">
            <svg
              className="mr-1 h-5 w-5"
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
            <span className="font-semibold">{postsCount} {postsCount === 1 ? 'publicació' : 'publicacions'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
