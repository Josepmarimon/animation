# Sistema de Autenticación y Gestión de Usuarios

## 📋 Descripción General

Sistema completo de autenticación y gestión de usuarios para el **Directorio de Profesionales de Animación**, implementado con **Supabase Auth** y **Next.js**, desplegable en **Vercel** vía **GitHub**.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Supabase Auth**: Gestión de autenticación de usuarios
2. **PostgreSQL con RLS**: Base de datos con seguridad a nivel de fila
3. **Custom Access Token Hook**: Inyección de roles en JWT
4. **Next.js (SSR/SSG)**: Frontend y backend
5. **Vercel**: Hosting y deployment

---

## 👥 Niveles de Usuario

| Rol | Descripción | Características |
|-----|-------------|-----------------|
| **standard** | Usuario gratuito | Perfil básico, visibilidad limitada |
| **premium** | Usuario de pago | Perfil destacado, funciones avanzadas |
| **admin** | Administrador | Gestión completa del sistema |

---

## 🗄️ Estructura de Base de Datos

### Tabla: `public.profiles`

Almacena información pública de profesionales.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,                      -- Referencia a auth.users
  email TEXT,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,

  -- Ubicación
  country TEXT NOT NULL,
  city TEXT NOT NULL,

  -- Especialización
  specializations animation_specialization[] NOT NULL DEFAULT '{}',

  -- Contacto
  contact_info JSONB DEFAULT '{...}',

  -- Portfolio
  portfolio_projects JSONB[] DEFAULT '{}',

  -- Visibilidad
  is_public BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  show_contact_info BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Índices optimizados:**
- `idx_profiles_country`: Búsqueda por país
- `idx_profiles_city`: Búsqueda por ciudad
- `idx_profiles_specializations` (GIN): Búsqueda por especializaciones
- `idx_profiles_is_public`: Filtrado de perfiles públicos

### Tabla: `public.user_roles`

Gestiona roles y suscripciones.

```sql
CREATE TABLE public.user_roles (
  id BIGINT PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  role user_role NOT NULL DEFAULT 'standard',

  -- Suscripción (para premium)
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, role)
);
```

### Tipos Personalizados

```sql
-- Roles de usuario
CREATE TYPE user_role AS ENUM ('standard', 'premium', 'admin');

-- Especializaciones en animación
CREATE TYPE animation_specialization AS ENUM (
  '2d_animation',
  '3d_animation',
  'character_design',
  'storyboard',
  'motion_graphics',
  'visual_effects',
  'stop_motion',
  'concept_art',
  'rigging',
  'compositing',
  'lighting',
  'texturing',
  'modeling'
);
```

---

## 🔐 Sistema de Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas específicas:

#### Políticas en `profiles`

**SELECT (Lectura):**
- ✅ Usuarios anónimos y autenticados pueden ver perfiles públicos
- ✅ Usuarios pueden ver su propio perfil (público o privado)
- ✅ Administradores pueden ver todos los perfiles

**UPDATE (Actualización):**
- ✅ Usuarios solo pueden editar su propio perfil
- ✅ Administradores pueden editar cualquier perfil

**DELETE (Eliminación):**
- ✅ Usuarios pueden eliminar su propio perfil
- ✅ Administradores pueden eliminar cualquier perfil

#### Políticas en `user_roles`

**SELECT:**
- ✅ Usuarios pueden ver su propio rol
- ✅ Administradores pueden ver todos los roles

**INSERT/UPDATE/DELETE:**
- ✅ Solo administradores pueden modificar roles

### Custom Access Token Hook

El hook inyecta información del rol en el JWT:

```json
{
  "user_role": "premium",
  "is_premium_active": true
}
```

Esto permite:
- Verificación de roles en el cliente
- Validación de permisos en políticas RLS
- Autorización en Edge Functions y API Routes

---

## 🔧 Funciones de Autorización

### Funciones Helper Disponibles

```sql
-- Obtener rol del usuario actual
SELECT public.get_current_user_role();

-- Verificar si es admin
SELECT public.is_admin();

-- Verificar si es premium activo
SELECT public.is_premium();

-- Verificar si es premium o admin
SELECT public.is_premium_or_admin();

-- Obtener perfil completo del usuario actual
SELECT public.get_user_profile();

-- Verificar si puede editar un perfil
SELECT public.can_edit_profile('uuid-del-perfil');

-- Actualizar usuario a premium (solo admins)
SELECT public.upgrade_to_premium('uuid-del-usuario', '2025-12-31'::TIMESTAMPTZ);

-- Degradar usuario a standard (solo admins)
SELECT public.downgrade_from_premium('uuid-del-usuario');
```

---

## 🚀 Flujo de Registro de Usuario

### 1. Usuario se registra

```typescript
// Cliente Next.js
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@ejemplo.com',
  password: 'contraseña-segura',
  options: {
    data: {
      full_name: 'Juan Pérez',
      country: 'España',
      city: 'Barcelona'
    }
  }
})
```

### 2. Trigger automático (handle_new_user)

El sistema automáticamente:
1. Crea un registro en `public.profiles`
2. Asigna el rol `standard` en `public.user_roles`

### 3. Custom Access Token Hook

Al iniciar sesión, el hook inyecta el rol en el JWT:
- Lee el rol desde `user_roles`
- Verifica si la suscripción premium está activa
- Agrega claims al JWT

### 4. Usuario autenticado

El usuario ya puede:
- Ver su perfil
- Editar su información
- Aparecer en el directorio público

---

## 📝 Ejemplo de Uso en Next.js

### Configuración de Supabase Client

```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### Registro de Usuario

```typescript
// app/auth/signup/page.tsx
import { supabase } from '@/lib/supabase'

async function handleSignUp(formData: FormData) {
  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        country: formData.get('country') as string,
        city: formData.get('city') as string,
      }
    }
  })

  if (error) {
    console.error('Error en registro:', error.message)
    return
  }

  // Usuario creado automáticamente con perfil y rol 'standard'
  console.log('Usuario registrado:', data.user)
}
```

### Obtener Rol del Usuario en el Cliente

```typescript
import { jwtDecode } from 'jwt-decode'

// Obtener sesión
const { data: { session } } = await supabase.auth.getSession()

if (session) {
  // Decodificar JWT para obtener el rol
  const jwt = jwtDecode<{ user_role: string }>(session.access_token)
  const userRole = jwt.user_role

  console.log('Rol del usuario:', userRole) // 'standard', 'premium', o 'admin'
}
```

### Verificar Rol en Server Component

```typescript
// app/admin/page.tsx (Server Component)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })

  // Obtener sesión
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Verificar si es admin usando la función de la BD
  const { data: isAdmin } = await supabase.rpc('is_admin')

  if (!isAdmin) {
    redirect('/') // Redirigir si no es admin
  }

  return <div>Panel de Administración</div>
}
```

### Actualizar Perfil de Usuario

```typescript
// app/profile/edit/page.tsx
async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      bio: updates.bio,
      specializations: updates.specializations,
      country: updates.country,
      city: updates.city,
    })
    .eq('id', userId)

  if (error) {
    console.error('Error actualizando perfil:', error)
    return
  }

  console.log('Perfil actualizado:', data)
}
```

### Directorio de Profesionales (con filtros)

```typescript
// app/directory/page.tsx
async function getProfiles(filters: {
  specialization?: string
  country?: string
  city?: string
}) {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)

  // Filtrar por especialización
  if (filters.specialization) {
    query = query.contains('specializations', [filters.specialization])
  }

  // Filtrar por país
  if (filters.country) {
    query = query.eq('country', filters.country)
  }

  // Filtrar por ciudad
  if (filters.city) {
    query = query.eq('city', filters.city)
  }

  const { data, error } = await query

  return data
}
```

---

## 📦 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 2. Configurar Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 3. Aplicar Migraciones

#### Opción A: Dashboard de Supabase

1. Ve a tu proyecto en [https://app.supabase.com](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Ejecuta las migraciones en orden:
   - `20250123_001_init_profiles_and_roles.sql`
   - `20250123_002_auto_create_profile_trigger.sql`
   - `20250123_003_custom_access_token_hook.sql`
   - `20250123_004_row_level_security_policies.sql`
   - `20250123_005_authorization_functions.sql`

#### Opción B: Supabase CLI (Desarrollo Local)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar Supabase en el proyecto
supabase init

# Vincular al proyecto remoto
supabase link --project-ref ejsaxspiunmyebveufon

# Aplicar migraciones
supabase db push
```

### 4. Configurar Custom Access Token Hook

En el Dashboard de Supabase:

1. Ve a **Authentication > Hooks (Beta)**
2. Selecciona **Custom Access Token**
3. Elige la función: `public.custom_access_token_hook`
4. Guarda los cambios

---

## 🔑 Gestión de Roles

### Asignar Rol de Administrador (Primera vez)

Ejecuta desde el SQL Editor:

```sql
-- Reemplaza 'uuid-del-usuario' con el ID real del usuario
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid-del-usuario', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Actualizar Usuario a Premium

```sql
-- Desde la aplicación (como admin)
SELECT public.upgrade_to_premium(
  'uuid-del-usuario',
  '2025-12-31 23:59:59+00'::TIMESTAMPTZ
);
```

### Degradar Usuario a Standard

```sql
SELECT public.downgrade_from_premium('uuid-del-usuario');
```

---

## 🧪 Testing

### Probar Registro de Usuario

```bash
curl -X POST 'https://ejsaxspiunmyebveufon.supabase.co/auth/v1/signup' \
  -H 'apikey: tu-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "data": {
      "full_name": "Test User",
      "country": "España",
      "city": "Madrid"
    }
  }'
```

### Verificar que se creó el perfil

```sql
SELECT * FROM public.profiles WHERE email = 'test@example.com';
```

### Verificar que se asignó el rol

```sql
SELECT * FROM public.user_roles WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'test@example.com'
);
```

---

## 📊 Monitoreo y Logs

### Ver logs de autenticación

```sql
-- Últimos 10 logins
SELECT * FROM auth.audit_log_entries
ORDER BY created_at DESC
LIMIT 10;
```

### Ver usuarios registrados recientemente

```sql
SELECT
  u.id,
  u.email,
  p.full_name,
  ur.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 20;
```

---

## 🚨 Seguridad

### ✅ Mejores Prácticas Implementadas

1. **RLS habilitado en todas las tablas**: Ningún dato es accesible sin políticas explícitas
2. **Roles en JWT**: Verificación de permisos sin consultas adicionales
3. **Funciones SECURITY DEFINER**: Control granular de permisos
4. **No exposición de auth.users**: Los datos sensibles están protegidos
5. **Triggers automáticos**: Consistencia de datos garantizada
6. **Índices optimizados**: Rendimiento en consultas complejas

### ⚠️ Consideraciones de Seguridad

- **Nunca expongas el `SUPABASE_SERVICE_ROLE_KEY`** en el cliente
- **No uses `user_metadata` para decisiones de seguridad** (puede ser modificado por el usuario)
- **Usa `app_metadata` o `user_roles`** para información crítica de autorización
- **Valida siempre los inputs** en el servidor antes de insertar/actualizar

---

## 🛠️ Troubleshooting

### El trigger no crea el perfil automáticamente

**Solución:** Verifica que el trigger esté activo:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### El rol no aparece en el JWT

**Solución:** Verifica que el hook esté configurado en el Dashboard:

```sql
-- Verificar que la función existe
SELECT * FROM pg_proc WHERE proname = 'custom_access_token_hook';
```

### Error 403 al acceder a datos

**Solución:** Verifica las políticas RLS:

```sql
-- Ver todas las políticas
SELECT * FROM pg_policies;
```

---

## 📚 Recursos Adicionales

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Custom Access Token Hooks](https://supabase.com/docs/guides/auth/auth-hooks#hook-custom-access-token)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## ✨ Características del Sistema

- ✅ Registro rápido y seguro
- ✅ 3 niveles de usuario (standard, premium, admin)
- ✅ Perfiles profesionales personalizables
- ✅ Portfolio de proyectos en JSON
- ✅ Directorio filtrable por especialización, país y ciudad
- ✅ Control de visibilidad del perfil
- ✅ Sistema de suscripciones premium
- ✅ Gestión de roles desde la aplicación
- ✅ Seguridad a nivel de base de datos (RLS)
- ✅ Compatible con SSR/SSG en Next.js
- ✅ Desplegable en Vercel con integración GitHub

---

**Fecha de Creación:** 23 de enero de 2025
**Proyecto ID:** `ejsaxspiunmyebveufon`
**Stack Tecnológico:** Next.js + Supabase + PostgreSQL + Vercel
