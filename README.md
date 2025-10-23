# 🎨 Directorio de Profesionales de Animación

Plataforma web para conectar profesionales de animación, compartir portafolios y colaborar en proyectos.

## 🚀 Características

- ✅ Autenticación segura con Supabase
- ✅ 3 niveles de usuario (Standard, Premium, Admin)
- ✅ Perfiles profesionales con portafolio
- ✅ Directorio filtrable por especialización
- ✅ Sistema de roles en JWT
- ✅ Row Level Security (RLS)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Repository**: GitHub

## 📋 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Josepmarimon/animation.git
cd animation
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación Completa

Toda la documentación técnica está disponible en la carpeta `/docs`:

- **[QUICK_START.md](docs/QUICK_START.md)** - Guía de configuración rápida
- **[AUTHENTICATION_SYSTEM.md](docs/AUTHENTICATION_SYSTEM.md)** - Sistema de autenticación completo
- **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Guía de deployment en Vercel
- **[VERCEL_SETUP.md](docs/VERCEL_SETUP.md)** - Configuración de Vercel paso a paso
- **[NEXTJS_EXAMPLES.md](docs/NEXTJS_EXAMPLES.md)** - Ejemplos de código Next.js
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Arquitectura del proyecto

## 🗄️ Migraciones de Base de Datos

Las migraciones SQL están en `supabase/migrations/`:

1. `20250123_001_init_profiles_and_roles.sql` - Schema inicial
2. `20250123_002_auto_create_profile_trigger.sql` - Trigger de perfiles
3. `20250123_003_custom_access_token_hook.sql` - Hook JWT
4. `20250123_004_row_level_security_policies.sql` - Políticas RLS
5. `20250123_005_authorization_functions.sql` - Funciones de autorización

## 🔐 Seguridad

- Row Level Security (RLS) activado en todas las tablas
- JWT con roles inyectados automáticamente
- Variables de entorno para claves sensibles
- HTTPS obligatorio en producción

## 🌐 Deploy en Vercel

1. Importa el repositorio en Vercel
2. Configura las variables de entorno (ver `docs/VERCEL_SETUP.md`)
3. Deploy automático en cada push a `main`

**URL del proyecto**: [https://animation-xxx.vercel.app](https://vercel.com)

## 📞 Soporte

Para dudas o problemas, revisa la documentación en `/docs` o abre un issue en GitHub.

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para el propietario del repositorio.

---

**Desarrollado con Next.js + Supabase + Vercel**
