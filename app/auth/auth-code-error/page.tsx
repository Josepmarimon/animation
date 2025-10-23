import Link from 'next/link'

export default function AuthCodeError({
  searchParams,
}: {
  searchParams: { reason?: string; details?: string }
}) {
  const { reason, details } = searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Error de confirmación</h2>
          <p className="text-red-700 mb-4">
            Hubo un problema al confirmar tu email. Esto puede ocurrir si:
          </p>
          <ul className="text-left text-sm text-red-600 mb-6 space-y-2">
            <li>• El enlace ya expiró (válido por 1 hora)</li>
            <li>• El enlace ya fue utilizado</li>
            <li>• Hubo un problema de configuración</li>
          </ul>

          {reason && (
            <div className="mb-4 p-3 bg-red-100 rounded text-left">
              <p className="text-xs font-mono text-red-800">
                <strong>Código de error:</strong> {reason}
              </p>
              {details && (
                <p className="text-xs font-mono text-red-700 mt-1">
                  <strong>Detalles:</strong> {decodeURIComponent(details)}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Link
              href="/auth/signup"
              className="block w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Registrarse de nuevo
            </Link>
            <Link
              href="/auth/login"
              className="block w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/"
              className="block text-sm text-gray-600 hover:text-gray-900"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
