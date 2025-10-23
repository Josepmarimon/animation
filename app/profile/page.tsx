import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Directorio de Animación
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/directory"
                className="text-gray-700 hover:text-gray-900"
              >
                Directorio
              </Link>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

            {profile ? (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.full_name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">País</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.country}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Ciudad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.city}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Biografía</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.bio || 'No has agregado una biografía aún.'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Especializaciones</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.specializations?.length > 0
                      ? profile.specializations.join(', ')
                      : 'No has agregado especializaciones aún.'}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">Cargando perfil...</p>
            )}

            <div className="mt-8">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Editar perfil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
