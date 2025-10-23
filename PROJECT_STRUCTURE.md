# 📂 Estructura del Proyecto

Documentación visual de la arquitectura y estructura de archivos del Directorio de Profesionales de Animación.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Next.js)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │Components │  │   Hooks    │            │
│  │  (App Dir) │  │    (UI)    │  │(useUser)  │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
│        └────────────────┴────────────────┘                   │
│                        │                                     │
│               ┌────────▼────────┐                           │
│               │  Supabase Client │                           │
│               │   (@supabase/js) │                           │
│               └────────┬────────┘                           │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ HTTPS + JWT
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   SUPABASE BACKEND                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Auth                            │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  Custom Access Token Hook                     │    │   │
│  │  │  (Inyecta rol en JWT)                         │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │            PostgreSQL Database                        │   │
│  │  ┌────────────────┐  ┌────────────────┐              │   │
│  │  │ auth.users     │  │ public.profiles │              │   │
│  │  │ (Supabase)     │◄─┤ (Custom)        │              │   │
│  │  └────────────────┘  └────────────────┘              │   │
│  │                      ┌────────────────┐              │   │
│  │                      │public.user_roles│              │   │
│  │                      └────────────────┘              │   │
│  │                                                       │   │
│  │  Row Level Security (RLS)                            │   │
│  │  ✓ Políticas por tabla                               │   │
│  │  ✓ Verificación de roles desde JWT                   │   │
│  │  ✓ Funciones de autorización                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                         │
                         │ Deploy
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Hosting)                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Production │  │  Preview   │  │    Edge    │            │
│  │   Deploy   │  │  Deploys   │  │ Functions  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
animation/
│
├── 📄 README.md                           # Documentación principal del proyecto
├── 📄 AUTHENTICATION_SYSTEM.md            # Documentación completa del sistema de auth
├── 📄 NEXTJS_EXAMPLES.md                  # Ejemplos de código para Next.js
├── 📄 DEPLOYMENT_GUIDE.md                 # Guía de despliegue en Vercel
├── 📄 PROJECT_STRUCTURE.md                # Este archivo
├── 📄 .env.example                        # Template de variables de entorno
│
├── 📁 supabase/                           # Configuración de Supabase
│   └── 📁 migrations/                     # Migraciones de base de datos
│       ├── 20250123_001_init_profiles_and_roles.sql
│       ├── 20250123_002_auto_create_profile_trigger.sql
│       ├── 20250123_003_custom_access_token_hook.sql
│       ├── 20250123_004_row_level_security_policies.sql
│       └── 20250123_005_authorization_functions.sql
│
├── 📁 app/                                # Next.js App Router (a crear)
│   ├── 📁 auth/                           # Rutas de autenticación
│   │   ├── 📁 login/
│   │   │   └── page.tsx
│   │   ├── 📁 signup/
│   │   │   └── page.tsx
│   │   └── 📁 callback/
│   │       └── route.ts
│   │
│   ├── 📁 profile/                        # Perfil de usuario
│   │   ├── page.tsx
│   │   └── 📁 edit/
│   │       └── page.tsx
│   │
│   ├── 📁 directory/                      # Directorio de profesionales
│   │   └── page.tsx
│   │
│   ├── 📁 admin/                          # Panel de administración
│   │   ├── page.tsx
│   │   └── 📁 users/
│   │       └── page.tsx
│   │
│   ├── 📁 api/                            # API Routes
│   │   └── 📁 [...endpoints]/
│   │
│   ├── layout.tsx                         # Layout global
│   └── page.tsx                           # Home page
│
├── 📁 components/                         # Componentes reutilizables (a crear)
│   ├── LogoutButton.tsx
│   ├── PremiumBadge.tsx
│   ├── RoleBasedButton.tsx
│   └── ProfileCard.tsx
│
├── 📁 lib/                                # Utilidades y configuración (a crear)
│   ├── supabase.ts                        # Cliente de Supabase
│   └── utils.ts
│
├── 📁 hooks/                              # Custom hooks (a crear)
│   └── useUserRole.ts
│
├── 📁 types/                              # TypeScript types (a crear)
│   └── database.types.ts                  # Generado por Supabase
│
├── 📄 middleware.ts                       # Middleware para protección de rutas
├── 📄 next.config.js                      # Configuración de Next.js
├── 📄 package.json
└── 📄 tsconfig.json
```

---

## 🗄️ Esquema de Base de Datos

### Diagrama Entidad-Relación

```
┌─────────────────────────────────────┐
│          auth.users                 │
│  (Tabla de Supabase Auth)           │
├─────────────────────────────────────┤
│ • id (UUID) PK                      │
│ • email                             │
│ • encrypted_password                │
│ • raw_user_meta_data (JSONB)       │
│ • raw_app_meta_data (JSONB)        │
│ • created_at                        │
│ • updated_at                        │
└───────────┬─────────────────────────┘
            │
            │ 1:1
            │
┌───────────▼─────────────────────────┐
│      public.profiles                │
│  (Perfiles públicos)                │
├─────────────────────────────────────┤
│ • id (UUID) PK, FK → auth.users     │
│ • email                             │
│ • full_name                         │
│ • bio                               │
│ • avatar_url                        │
│ • country                           │
│ • city                              │
│ • specializations (ENUM[])          │
│ • contact_info (JSONB)              │
│ • portfolio_projects (JSONB[])      │
│ • is_public (BOOLEAN)               │
│ • show_email (BOOLEAN)              │
│ • show_contact_info (BOOLEAN)       │
│ • created_at                        │
│ • updated_at                        │
└─────────────────────────────────────┘
            │
            │ 1:N
            │
┌───────────▼─────────────────────────┐
│     public.user_roles               │
│  (Roles y suscripciones)            │
├─────────────────────────────────────┤
│ • id (BIGINT) PK                    │
│ • user_id (UUID) FK → auth.users    │
│ • role (ENUM)                       │
│   - standard                        │
│   - premium                         │
│   - admin                           │
│ • subscription_start_date           │
│ • subscription_end_date             │
│ • created_at                        │
│ • updated_at                        │
└─────────────────────────────────────┘
```

### Índices

```sql
profiles:
  - idx_profiles_country (country)
  - idx_profiles_city (city)
  - idx_profiles_is_public (is_public) WHERE is_public = true
  - idx_profiles_specializations GIN (specializations)

user_roles:
  - idx_user_roles_role (role)
  - idx_user_roles_user_id (user_id)
```

---

## 🔐 Flujo de Autenticación

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       │ 1. Registro (signUp)
       │    - email
       │    - password
       │    - metadata (nombre, país, ciudad)
       ▼
┌─────────────────────────────────────┐
│     Supabase Auth                   │
│  ┌───────────────────────────────┐  │
│  │  Crear usuario en auth.users  │  │
│  └────────────┬──────────────────┘  │
└───────────────┼─────────────────────┘
                │
                │ 2. Trigger automático
                │    (handle_new_user)
                ▼
┌─────────────────────────────────────┐
│  Creación automática de:            │
│  ✓ Registro en public.profiles      │
│  ✓ Asignación de rol 'standard'     │
│    en public.user_roles             │
└───────────────┬─────────────────────┘
                │
                │ 3. Login (signInWithPassword)
                ▼
┌─────────────────────────────────────┐
│  Custom Access Token Hook           │
│  ┌───────────────────────────────┐  │
│  │ • Lee rol desde user_roles    │  │
│  │ • Verifica suscripción premium│  │
│  │ • Inyecta en JWT:             │  │
│  │   - user_role                 │  │
│  │   - is_premium_active         │  │
│  └────────────┬──────────────────┘  │
└───────────────┼─────────────────────┘
                │
                │ 4. JWT emitido
                ▼
┌─────────────────────────────────────┐
│      Usuario autenticado            │
│  JWT contiene:                      │
│  {                                  │
│    "sub": "user-uuid",              │
│    "email": "user@example.com",     │
│    "user_role": "standard",         │
│    "is_premium_active": false       │
│  }                                  │
└─────────────────────────────────────┘
```

---

## 🛡️ Sistema de Seguridad (RLS)

### Políticas por Operación

```
profiles:
  SELECT:
    ✓ Cualquiera → perfiles públicos (is_public = true)
    ✓ Propietario → su propio perfil (privado o público)
    ✓ Admin → todos los perfiles

  INSERT:
    ✓ Usuario → solo su propio perfil (id = auth.uid())

  UPDATE:
    ✓ Propietario → su propio perfil
    ✓ Admin → cualquier perfil

  DELETE:
    ✓ Propietario → su propio perfil
    ✓ Admin → cualquier perfil

user_roles:
  SELECT:
    ✓ Propietario → su propio rol
    ✓ Admin → todos los roles

  INSERT/UPDATE/DELETE:
    ✓ Solo Admin
```

---

## 🚀 Flujo de Deploy

```
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │
       │ git push origin feature/x
       ▼
┌─────────────────────────────────────┐
│           GitHub                     │
│  ┌───────────────────────────────┐  │
│  │  Repository: animation        │  │
│  │  Branch: feature/x            │  │
│  └────────────┬──────────────────┘  │
└───────────────┼─────────────────────┘
                │
                │ Webhook
                ▼
┌─────────────────────────────────────┐
│           Vercel                     │
│  ┌───────────────────────────────┐  │
│  │  1. Clone repository          │  │
│  │  2. npm install               │  │
│  │  3. npm run build             │  │
│  │  4. Deploy to Edge Network    │  │
│  └────────────┬──────────────────┘  │
└───────────────┼─────────────────────┘
                │
                │ Preview URL
                ▼
┌─────────────────────────────────────┐
│  https://animation-xxx.vercel.app   │
│  (Preview Deployment)                │
└─────────────────────────────────────┘

       │ Merge to main
       ▼

┌─────────────────────────────────────┐
│  https://animation.vercel.app       │
│  (Production Deployment)             │
└─────────────────────────────────────┘
```

---

## 📊 Tipos de Datos Personalizados

### user_role

```sql
CREATE TYPE user_role AS ENUM (
  'standard',   -- Usuario gratuito
  'premium',    -- Usuario de pago
  'admin'       -- Administrador
);
```

### animation_specialization

```sql
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

## 🔧 Funciones Principales

### Funciones de Autorización

```sql
-- Obtener rol del usuario actual
public.get_current_user_role() → user_role

-- Verificar si es admin
public.is_admin() → boolean

-- Verificar si es premium activo
public.is_premium() → boolean

-- Verificar si es premium o admin
public.is_premium_or_admin() → boolean

-- Obtener perfil completo del usuario
public.get_user_profile() → profiles

-- Verificar si puede editar un perfil
public.can_edit_profile(profile_id UUID) → boolean
```

### Funciones de Gestión (Solo Admin)

```sql
-- Actualizar usuario a premium
public.upgrade_to_premium(
  target_user_id UUID,
  subscription_end TIMESTAMPTZ
) → boolean

-- Degradar usuario a standard
public.downgrade_from_premium(
  target_user_id UUID
) → boolean
```

### Triggers

```sql
-- Actualizar campo updated_at automáticamente
public.update_updated_at_column()
  → Se ejecuta en BEFORE UPDATE en:
     - public.profiles
     - public.user_roles

-- Crear perfil y rol al registrarse
public.handle_new_user()
  → Se ejecuta en AFTER INSERT en:
     - auth.users
```

### Hooks

```sql
-- Inyectar rol en JWT
public.custom_access_token_hook(event JSONB) → JSONB
  → Se ejecuta antes de emitir el JWT
  → Agrega claims:
     - user_role
     - is_premium_active
```

---

## 🎯 Próximos Pasos

Para implementar la aplicación completa:

1. ✅ **Base de datos configurada** (Completado)
2. ⬜ Crear proyecto Next.js
3. ⬜ Implementar páginas de autenticación
4. ⬜ Implementar perfil de usuario
5. ⬜ Implementar directorio de profesionales
6. ⬜ Implementar panel de administración
7. ⬜ Agregar sistema de pagos (Stripe)
8. ⬜ Deploy a Vercel

---

**Toda la arquitectura de backend y base de datos está lista para usar.**
