'use server'

import { createClient } from '@/lib/supabase/server'

export async function createUserProfile(userId: string, email: string, fullName: string, country: string, city: string) {
  const supabase = await createClient()

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      full_name: fullName,
      country: country,
      city: city,
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
    throw profileError
  }

  // Assign standard role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: 'standard',
    })

  if (roleError) {
    console.error('Error creating role:', roleError)
    throw roleError
  }

  return { success: true }
}
