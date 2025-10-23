import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DirectoryPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20)

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
                href="/profile"
                className="text-gray-700 hover:text-gray-900"
              >
                Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Directorio de Profesionales</h1>
          <p className="mt-2 text-gray-600">
            Explora perfiles de profesionales de animación de todo el mundo
          </p>
        </div>

        {profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {profile.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        {profile.full_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {profile.city}, {profile.country}
                      </p>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {profile.bio}
                    </p>
                  )}

                  {profile.specializations && profile.specializations.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.specializations.slice(0, 3).map((spec: string) => (
                        <span
                          key={spec}
                          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {spec.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {profile.specializations.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-800">
                          +{profile.specializations.length - 3} más
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Ver perfil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay perfiles públicos disponibles aún.</p>
          </div>
        )}
      </main>
    </div>
  )
}
