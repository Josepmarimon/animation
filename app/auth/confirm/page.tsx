import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { ensureUserProfile } from '@/lib/auth/ensure-profile'
import AnimatedLogo from '@/app/components/AnimatedLogo'

async function confirmEmail(formData: FormData) {
  'use server'

  const token_hash = formData.get('token_hash')?.toString() || null
  const type = (formData.get('type')?.toString() || null) as EmailOtpType | null
  const code = formData.get('code')?.toString() || null
  const nextRaw = formData.get('next')?.toString() || '/'
  const next = nextRaw.startsWith('/') ? nextRaw : '/'

  if (!code && (!token_hash || !type)) {
    redirect('/auth/auth-code-error?reason=missing_params')
  }

  const supabase = await createClient()

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      redirect(
        `/auth/auth-code-error?reason=exchange_failed&details=${encodeURIComponent(error.message)}`
      )
    }
    if (data?.user) await ensureUserProfile(supabase, data.user)
  } else {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type!,
      token_hash: token_hash!,
    })
    if (error) {
      redirect(
        `/auth/auth-code-error?reason=verify_failed&details=${encodeURIComponent(error.message)}`
      )
    }
    if (data?.user) await ensureUserProfile(supabase, data.user)
  }

  redirect(next)
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{
    token_hash?: string
    type?: string
    code?: string
    next?: string
    error?: string
    error_code?: string
    error_description?: string
  }>
}) {
  const params = await searchParams

  if (params.error || params.error_code) {
    redirect(
      `/auth/auth-code-error?reason=${encodeURIComponent(params.error_code || params.error || 'unknown')}&details=${encodeURIComponent(params.error_description || '')}`
    )
  }

  const hasToken = !!params.token_hash && !!params.type
  const hasCode = !!params.code

  if (!hasToken && !hasCode) {
    redirect('/auth/auth-code-error?reason=missing_params')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <AnimatedLogo className="text-4xl sm:text-5xl font-bold tracking-wider" />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Confirm your email</h2>
          <p className="text-blue-100 mb-6">
            Click the button below to confirm your email address and activate your account.
          </p>
          <form action={confirmEmail}>
            {params.token_hash && (
              <input type="hidden" name="token_hash" value={params.token_hash} />
            )}
            {params.type && <input type="hidden" name="type" value={params.type} />}
            {params.code && <input type="hidden" name="code" value={params.code} />}
            <input type="hidden" name="next" value={params.next ?? '/'} />
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-white px-6 py-4 text-base font-semibold text-blue-700 hover:bg-gray-100 shadow-xl hover:scale-105 transform transition-all duration-200"
            >
              Confirm my email
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
