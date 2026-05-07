import type { SupabaseClient, User } from '@supabase/supabase-js'

export async function ensureUserProfile(supabase: SupabaseClient, user: User) {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existingProfile) return

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'New User',
    country: user.user_metadata?.country || 'Not specified',
    city: user.user_metadata?.city || 'Not specified',
  })

  if (profileError) {
    console.error('Failed to create profile:', profileError)
  }

  const { error: roleError } = await supabase.from('user_roles').insert({
    user_id: user.id,
    role: 'standard',
  })

  if (roleError) {
    console.error('Failed to create role:', roleError)
  }
}
