import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('URL:', requestUrl.toString())
  console.log('Code:', code)

  if (code) {
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

    console.log('Attempting code exchange...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    console.log('Exchange result:', {
      hasData: !!data,
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      error: exchangeError?.message
    })

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        new URL(`/auth/auth-code-error?reason=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    if (data?.user) {
      console.log('User authenticated via code exchange:', data.user.id)
      await ensureUserProfile(supabase, data.user)
      return response
    }
  }

  // If there's no code or something failed
  console.error('No valid authentication code found')
  return NextResponse.redirect(
    new URL('/auth/auth-code-error?reason=no_code', requestUrl.origin)
  )
}

async function ensureUserProfile(supabase: any, user: any) {
  console.log('Checking if profile exists for user:', user.id)

  // Check if profile exists
  const { data: existingProfile, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  console.log('Profile check result:', {
    exists: !!existingProfile,
    error: selectError?.message
  })

  if (existingProfile) {
    console.log('Profile already exists, skipping creation')
    return
  }

  // Create profile
  console.log('Creating new profile with data:', {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'New User',
    country: user.user_metadata?.country || 'Not specified',
    city: user.user_metadata?.city || 'Not specified',
  })

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'New User',
    country: user.user_metadata?.country || 'Not specified',
    city: user.user_metadata?.city || 'Not specified',
  })

  if (profileError) {
    console.error('Failed to create profile:', profileError)
  } else {
    console.log('Profile created successfully')
  }

  // Assign standard role
  console.log('Creating user role...')
  const { error: roleError } = await supabase.from('user_roles').insert({
    user_id: user.id,
    role: 'standard',
  })

  if (roleError) {
    console.error('Failed to create role:', roleError)
  } else {
    console.log('Role created successfully')
  }
}
