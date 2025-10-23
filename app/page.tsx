import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Directorio de Animación
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">
                    {user.email}
                  </span>
                  <Link
                    href="/profile"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/directory"
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                  >
                    Directorio
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Encuentra y conecta con profesionales de animación
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Únete a la comunidad de profesionales de animación más grande.
            Comparte tu portafolio, encuentra colaboradores y crece tu red profesional.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!user && (
              <>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Comenzar gratis
                </Link>
                <Link
                  href="/directory"
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  Ver directorio <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                Perfiles profesionales
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Crea tu perfil detallado con tu portafolio, especialidades y experiencia.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                Búsqueda avanzada
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Filtra por especialidad, ubicación y nivel de experiencia para encontrar el talento perfecto.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Cuenta Premium
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Accede a funciones exclusivas y destaca tu perfil en el directorio.
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}
