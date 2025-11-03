import { createClient } from '@/lib/supabase/server'

export default async function WallDebugPage() {
  const supabase = await createClient()

  let debugInfo: any = {
    walls: null,
    error: null,
    tablesExist: null,
  }

  try {
    // Check if walls table exists
    const { data: walls, error: wallsError } = await supabase
      .from('walls')
      .select('*')
      .limit(5)

    debugInfo.walls = walls
    debugInfo.error = wallsError

    // Try to list all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    debugInfo.tablesExist = tables
    debugInfo.tablesError = tablesError
  } catch (err: any) {
    debugInfo.catchError = err.message
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Walls Debug Info</h1>

        <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Walls Data</h2>
          <pre className="text-white text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-blue-100 space-y-2">
            <p>If you see an error about "relation walls does not exist":</p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Open your Supabase dashboard</li>
              <li>Go to SQL Editor</li>
              <li>Copy the contents of: supabase/migrations/20250203_011_create_walls_system.sql</li>
              <li>Paste and execute it</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
