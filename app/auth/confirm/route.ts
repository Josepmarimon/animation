import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { ensureUserProfile } from '@/lib/auth/ensure-profile'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') ?? '/'

  const errorParam = requestUrl.searchParams.get('error')
  const errorCode = requestUrl.searchParams.get('error_code')
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (errorParam || errorCode) {
    return NextResponse.redirect(
      new URL(
        `/auth/auth-code-error?reason=${encodeURIComponent(errorCode || errorParam || 'unknown')}&details=${encodeURIComponent(errorDescription || '')}`,
        requestUrl.origin
      )
    )
  }

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/auth/auth-code-error?reason=missing_params', requestUrl.origin)
    )
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(new URL(next, requestUrl.origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })

  if (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/auth-code-error?reason=verify_failed&details=${encodeURIComponent(error.message)}`,
        requestUrl.origin
      )
    )
  }

  if (data?.user) {
    await ensureUserProfile(supabase, data.user)
  }

  return response
}
