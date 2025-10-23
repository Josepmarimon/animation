import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  // Capturar todos los parámetros
  const params = {
    code: requestUrl.searchParams.get('code'),
    token_hash: requestUrl.searchParams.get('token_hash'),
    type: requestUrl.searchParams.get('type'),
    next: requestUrl.searchParams.get('next'),
    error: requestUrl.searchParams.get('error'),
    error_code: requestUrl.searchParams.get('error_code'),
    error_description: requestUrl.searchParams.get('error_description'),
  }

  const headers = {
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
    'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
    'host': request.headers.get('host'),
  }

  return NextResponse.json({
    message: 'Debug info',
    url: requestUrl.toString(),
    origin: requestUrl.origin,
    params,
    headers,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  }, { status: 200 })
}
