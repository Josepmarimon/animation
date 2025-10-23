import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('URL:', requestUrl.toString())
  console.log('Code:', code)
  console.log('Token hash:', token_hash)
  console.log('Type:', type)
  console.log('Error:', error)
  console.log('Error description:', error_description)

  // Si hay un error en la URL, redirigir a error page
  if (error) {
    console.error('Error in URL params:', error, error_description)
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?reason=url_error`)
  }

  const supabase = await createClient()

  // Manejar flujo PKCE (code exchange)
  if (code) {
    console.log('Attempting code exchange...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    console.log('Exchange result:', {
      hasData: !!data,
      hasUser: !!data?.user,
      error: exchangeError?.message
    })

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?reason=exchange_failed`)
    }

    if (data?.user) {
      console.log('User authenticated via code exchange:', data.user.id)
      await ensureUserProfile(supabase, data.user)
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // Manejar flujo OTP (token_hash)
  if (token_hash && type) {
    console.log('Attempting OTP verification...')
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    console.log('Verify result:', {
      hasData: !!data,
      hasUser: !!data?.user,
      error: verifyError?.message
    })

    if (verifyError) {
      console.error('OTP verification error:', verifyError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?reason=otp_failed&details=${encodeURIComponent(verifyError.message)}`)
    }

    if (data?.user) {
      console.log('User authenticated via OTP:', data.user.id)
      await ensureUserProfile(supabase, data.user)
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }
  }

  // Si llegamos aquí, algo salió mal
  console.error('No valid authentication method found')
  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error?reason=no_auth_method`)
}

async function ensureUserProfile(supabase: any, user: any) {
  console.log('Checking if profile exists for user:', user.id)

  // Verificar si el perfil existe
  const { data: existingProfile, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  console.log('Profile check result:', {
    exists: !!existingProfile,
    error: selectError?.message
  })

  if (existingProfile) {
    console.log('Profile already exists, skipping creation')
    return
  }

  // Crear perfil
  console.log('Creating new profile...')
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'Usuario Nuevo',
    country: user.user_metadata?.country || 'No especificado',
    city: user.user_metadata?.city || 'No especificado',
  })

  if (profileError) {
    console.error('Failed to create profile:', profileError)
  } else {
    console.log('Profile created successfully')
  }

  // Asignar rol standard
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
