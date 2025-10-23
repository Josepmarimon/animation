# Next.js + Supabase - Ejemplos de Código

Guía de ejemplos prácticos para implementar autenticación y gestión de usuarios en Next.js con Supabase.

---

## 📦 Configuración Inicial

### Instalación de Dependencias

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs jwt-decode
```

### Configuración de Cliente Supabase

```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Cliente para componentes de cliente
export const createClient = () => createClientComponentClient()

// Cliente para componentes de servidor
export const createServerClient = () => createServerComponentClient({ cookies })
```

### Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

---

## 🔐 Autenticación

### Página de Registro

```typescript
// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignUp(formData: FormData) {
    setLoading(true)
    setError(null)

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const country = formData.get('country') as string
    const city = formData.get('city') as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          country,
          city,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirigir al perfil después del registro
    router.push('/profile')
    setLoading(false)
  }

  return (
    <form action={handleSignUp}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        required
      />
      <input
        name="full_name"
        type="text"
        placeholder="Nombre completo"
        required
      />
      <input
        name="country"
        type="text"
        placeholder="País"
        required
      />
      <input
        name="city"
        type="text"
        placeholder="Ciudad"
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
```

### Página de Login

```typescript
// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(formData: FormData) {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/profile')
    router.refresh()
    setLoading(false)
  }

  return (
    <form action={handleLogin}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
```

### Callback de Autenticación

```typescript
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

### Logout

```typescript
// components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout}>
      Cerrar Sesión
    </button>
  )
}
```

---

## 👤 Gestión de Perfiles

### Obtener Perfil del Usuario (Server Component)

```typescript
// app/profile/page.tsx
import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createServerClient()

  // Verificar autenticación
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Obtener perfil del usuario
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error || !profile) {
    return <div>Error cargando perfil</div>
  }

  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>{profile.bio}</p>
      <p>📍 {profile.city}, {profile.country}</p>
      <p>🎨 Especializaciones: {profile.specializations.join(', ')}</p>
    </div>
  )
}
```

### Editar Perfil (Client Component)

```typescript
// app/profile/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.get('full_name'),
        bio: formData.get('bio'),
        country: formData.get('country'),
        city: formData.get('city'),
        specializations: formData.getAll('specializations'),
      })
      .eq('id', profile.id)

    if (error) {
      alert('Error actualizando perfil')
      setSaving(false)
      return
    }

    router.push('/profile')
    setSaving(false)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="full_name"
        defaultValue={profile.full_name}
        placeholder="Nombre completo"
        required
      />

      <textarea
        name="bio"
        defaultValue={profile.bio}
        placeholder="Biografía"
        rows={4}
      />

      <input
        name="country"
        defaultValue={profile.country}
        placeholder="País"
        required
      />

      <input
        name="city"
        defaultValue={profile.city}
        placeholder="Ciudad"
        required
      />

      <select name="specializations" multiple>
        <option value="2d_animation">Animación 2D</option>
        <option value="3d_animation">Animación 3D</option>
        <option value="character_design">Diseño de Personajes</option>
        <option value="storyboard">Storyboard</option>
        {/* ... más opciones */}
      </select>

      <button type="submit" disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  )
}
```

---

## 🔍 Directorio de Profesionales

### Listado con Filtros

```typescript
// app/directory/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string
  full_name: string
  bio: string
  country: string
  city: string
  specializations: string[]
  avatar_url: string
}

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    specialization: '',
    country: '',
    city: ''
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true)

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)

      // Aplicar filtros
      if (filters.specialization) {
        query = query.contains('specializations', [filters.specialization])
      }

      if (filters.country) {
        query = query.eq('country', filters.country)
      }

      if (filters.city) {
        query = query.eq('city', filters.city)
      }

      const { data } = await query

      setProfiles(data || [])
      setLoading(false)
    }

    loadProfiles()
  }, [filters, supabase])

  return (
    <div>
      <h1>Directorio de Profesionales</h1>

      {/* Filtros */}
      <div className="filters">
        <select
          value={filters.specialization}
          onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
        >
          <option value="">Todas las especializaciones</option>
          <option value="2d_animation">Animación 2D</option>
          <option value="3d_animation">Animación 3D</option>
          <option value="character_design">Diseño de Personajes</option>
          {/* ... más opciones */}
        </select>

        <input
          type="text"
          placeholder="País"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />

        <input
          type="text"
          placeholder="Ciudad"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
      </div>

      {/* Listado */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div key={profile.id} className="profile-card">
              <img src={profile.avatar_url || '/default-avatar.png'} alt={profile.full_name} />
              <h3>{profile.full_name}</h3>
              <p>{profile.bio}</p>
              <p>📍 {profile.city}, {profile.country}</p>
              <p>🎨 {profile.specializations.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🔒 Protección de Rutas

### Middleware para Autenticación

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rutas protegidas
  if (req.nextUrl.pathname.startsWith('/profile') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Rutas de admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Verificar si es admin
    const { data: isAdmin } = await supabase.rpc('is_admin')

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*']
}
```

### Hook para Verificar Rol

```typescript
// hooks/useUserRole.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { jwtDecode } from 'jwt-decode'

type UserRole = 'standard' | 'premium' | 'admin'

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getRole() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoading(false)
        return
      }

      const jwt = jwtDecode<{ user_role: UserRole }>(session.access_token)
      setRole(jwt.user_role)
      setLoading(false)
    }

    getRole()
  }, [supabase])

  return { role, loading, isAdmin: role === 'admin', isPremium: role === 'premium' }
}
```

### Uso del Hook

```typescript
// app/dashboard/page.tsx
'use client'

import { useUserRole } from '@/hooks/useUserRole'

export default function DashboardPage() {
  const { role, loading, isAdmin, isPremium } = useUserRole()

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Tu rol: {role}</p>

      {isPremium && (
        <div className="premium-features">
          <h2>Funciones Premium</h2>
          {/* ... contenido premium */}
        </div>
      )}

      {isAdmin && (
        <div className="admin-panel">
          <h2>Panel de Administración</h2>
          {/* ... panel de admin */}
        </div>
      )}
    </div>
  )
}
```

---

## 👑 Panel de Administración

### Listar Todos los Usuarios

```typescript
// app/admin/users/page.tsx
import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = createServerClient()

  // Verificar que sea admin
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (!isAdmin) {
    redirect('/')
  }

  // Obtener todos los perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles (
        role,
        subscription_start_date,
        subscription_end_date
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Administración de Usuarios</h1>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profiles?.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.full_name}</td>
              <td>{profile.email}</td>
              <td>{profile.user_roles?.[0]?.role || 'standard'}</td>
              <td>{profile.city}, {profile.country}</td>
              <td>
                <button>Editar</button>
                <button>Cambiar Rol</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### Actualizar Rol de Usuario

```typescript
// app/admin/users/[id]/upgrade/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Verificar que sea admin
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { subscription_end_date } = body

  // Actualizar a premium
  const { data, error } = await supabase.rpc('upgrade_to_premium', {
    target_user_id: params.id,
    subscription_end: subscription_end_date
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
```

---

## 🎨 Componentes Útiles

### Botón Condicional por Rol

```typescript
// components/RoleBasedButton.tsx
'use client'

import { useUserRole } from '@/hooks/useUserRole'

interface Props {
  requiredRole: 'standard' | 'premium' | 'admin'
  children: React.ReactNode
  onClick?: () => void
}

export function RoleBasedButton({ requiredRole, children, onClick }: Props) {
  const { role, loading } = useUserRole()

  if (loading) {
    return <button disabled>Cargando...</button>
  }

  const hasPermission =
    role === 'admin' ||
    (requiredRole === 'premium' && (role === 'premium' || role === 'admin')) ||
    (requiredRole === 'standard' && role !== null)

  if (!hasPermission) {
    return null
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}
```

### Badge de Usuario Premium

```typescript
// components/PremiumBadge.tsx
'use client'

import { useUserRole } from '@/hooks/useUserRole'

export function PremiumBadge() {
  const { isPremium, loading } = useUserRole()

  if (loading || !isPremium) {
    return null
  }

  return (
    <span className="premium-badge">
      💎 Premium
    </span>
  )
}
```

---

## 📊 Consultas Avanzadas

### Búsqueda por Texto Completo

```typescript
// Búsqueda en nombre, bio y ciudad
const { data } = await supabase
  .from('profiles')
  .select('*')
  .or('full_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%')
  .eq('is_public', true)
```

### Perfil con Portfolio

```typescript
// Obtener perfil con proyectos de portfolio
const { data: profile } = await supabase
  .from('profiles')
  .select('*, portfolio_projects')
  .eq('id', userId)
  .single()

// portfolio_projects es un array de objetos JSON:
// [{ title: 'Proyecto 1', url: '...', thumbnail: '...' }]
```

---

**Documentación creada para Next.js 14+ con App Router y Supabase Auth**
