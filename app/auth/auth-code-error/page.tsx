import Link from 'next/link'

export default function AuthCodeError({
  searchParams,
}: {
  searchParams: { reason?: string; details?: string }
}) {
  const { reason, details } = searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Confirmation error</h2>
          <p className="text-red-700 mb-4">
            There was a problem confirming your email. This can happen if:
          </p>
          <ul className="text-left text-sm text-red-600 mb-6 space-y-2">
            <li>• The link has expired (valid for 1 hour)</li>
            <li>• The link has already been used</li>
            <li>• There was a configuration problem</li>
          </ul>

          {reason && (
            <div className="mb-4 p-3 bg-red-100 rounded text-left">
              <p className="text-xs font-mono text-red-800">
                <strong>Error code:</strong> {reason}
              </p>
              {details && (
                <p className="text-xs font-mono text-red-700 mt-1">
                  <strong>Details:</strong> {decodeURIComponent(details)}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Link
              href="/auth/signup"
              className="block w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Sign up again
            </Link>
            <Link
              href="/auth/login"
              className="block w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
            >
              Log in
            </Link>
            <Link
              href="/"
              className="block text-sm text-gray-600 hover:text-gray-900"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
