# 🎬 Directorio de Profesionales de Animación

Plataforma web participativa para profesionales de animación con sistema de perfiles, portfolio y directorio filtrable.

## 🚀 Stack Tecnológico

- **Frontend/Backend**: Next.js 14+
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## 📋 Características Principales

### Sistema de Usuarios

- ✅ **3 Niveles de Usuario**:
  - 🆓 Standard (Gratuito)
  - 💎 Premium (Pago)
  - 👑 Admin (Administrador)

- ✅ **Registro Rápido y Seguro**:
  - Email + contraseña
  - Creación automática de perfil
  - JWT con roles integrados

### Perfiles Profesionales

- Información personal y profesional
- 13 especialidades de animación
- Portfolio de proyectos (JSON)
- Información de contacto personalizable
- Control de visibilidad del perfil

### Directorio Filtrable

- Búsqueda por especialización
- Filtro por país y ciudad
- Perfiles públicos/privados
- Optimizado con índices GIN

## 📁 Estructura del Proyecto

```
animation/
├── supabase/
│   └── migrations/
│       ├── 20250123_001_init_profiles_and_roles.sql
│       ├── 20250123_002_auto_create_profile_trigger.sql
│       ├── 20250123_003_custom_access_token_hook.sql
│       ├── 20250123_004_row_level_security_policies.sql
│       └── 20250123_005_authorization_functions.sql
├── AUTHENTICATION_SYSTEM.md          # 📖 Documentación completa
└── README.md                          # Este archivo
```

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/animation.git
cd animation
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 4. Aplicar Migraciones de Base de Datos

Ve al [Dashboard de Supabase](https://app.supabase.com) → SQL Editor y ejecuta las migraciones en orden numérico.

### 5. Configurar el Hook de Autenticación

Dashboard → **Authentication** → **Hooks (Beta)** → **Custom Access Token**
- Selecciona: `public.custom_access_token_hook`

### 6. Ejecutar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📖 Documentación

Para documentación completa del sistema de autenticación, arquitectura, funciones y ejemplos de código, consulta:

**→ [AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md)**

## 🔐 Seguridad

- ✅ Row Level Security (RLS) habilitado en todas las tablas
- ✅ Roles en JWT para autorización
- ✅ Funciones SECURITY DEFINER
- ✅ No exposición de `auth.users`
- ✅ Validación de datos en servidor

## 🧪 Testing

### Crear Usuario de Prueba

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Usuario de Prueba',
      country: 'España',
      city: 'Barcelona'
    }
  }
})
```

### Verificar Rol del Usuario

```typescript
import { jwtDecode } from 'jwt-decode'

const { data: { session } } = await supabase.auth.getSession()
const jwt = jwtDecode(session.access_token)
console.log('Rol:', jwt.user_role) // 'standard', 'premium', 'admin'
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🚀 Deployment en Vercel

### Vía GitHub (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push a `main`

```bash
# O manualmente con Vercel CLI
npm install -g vercel
vercel
```

## 📊 Base de Datos

### Tablas Principales

- `public.profiles` - Perfiles de usuarios
- `public.user_roles` - Roles y suscripciones
- `auth.users` - Datos de autenticación (Supabase)

### Funciones Helper

```sql
-- Verificar si el usuario actual es admin
SELECT public.is_admin();

-- Obtener perfil del usuario actual
SELECT public.get_user_profile();

-- Actualizar a premium (solo admins)
SELECT public.upgrade_to_premium('user-uuid', '2025-12-31'::TIMESTAMPTZ);
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Contacto

Para soporte o consultas:
- 📧 Email: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/animation/issues)

---

**Desarrollado con ❤️ usando Next.js y Supabase**
