'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AnimatedLogo from '@/app/components/AnimatedLogo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          country,
          city,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile/edit`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Home Link */}
        <div className="absolute top-8 left-8 z-10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <AnimatedLogo className="text-4xl sm:text-5xl font-bold tracking-wider" />
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Registration successful!</h2>
            <p className="text-blue-100 mb-4">
              We've sent a confirmation email to <strong className="text-white">{email}</strong>
            </p>
            <p className="text-sm text-blue-200">
              Please check your email and click the confirmation link to activate your account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Home Link */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <AnimatedLogo className="text-4xl sm:text-5xl font-bold tracking-wider" />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Join us today
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-white underline hover:text-blue-100">
              Log in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl p-8 shadow-2xl" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password (minimum 6 characters)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                placeholder="Your password"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-white">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                placeholder="e.g: Spain"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-3 text-white placeholder-blue-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
                placeholder="e.g: Barcelona"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500 bg-opacity-20 backdrop-blur-sm border border-red-400 border-opacity-50 p-4">
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-white px-6 py-4 text-base font-semibold text-blue-700 hover:bg-gray-100 shadow-xl hover:scale-105 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
