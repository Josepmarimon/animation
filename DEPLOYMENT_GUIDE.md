# 🚀 Guía de Despliegue en Vercel

Guía paso a paso para desplegar tu aplicación de Directorio de Profesionales de Animación en Vercel con integración continua desde GitHub.

---

## 📋 Requisitos Previos

- ✅ Cuenta de [GitHub](https://github.com)
- ✅ Cuenta de [Vercel](https://vercel.com)
- ✅ Cuenta de [Supabase](https://supabase.com) con proyecto creado
- ✅ Repositorio Git con el código del proyecto

---

## 🔧 Parte 1: Configuración de Supabase

### 1.1. Aplicar Migraciones

1. Abre tu proyecto en Supabase: https://app.supabase.com/project/ejsaxspiunmyebveufon
2. Navega a **SQL Editor** en el menú lateral
3. Ejecuta las migraciones en orden:

```bash
# Orden de ejecución:
1. 20250123_001_init_profiles_and_roles.sql
2. 20250123_002_auto_create_profile_trigger.sql
3. 20250123_003_custom_access_token_hook.sql
4. 20250123_004_row_level_security_policies.sql
5. 20250123_005_authorization_functions.sql
```

**Copiar y pegar cada archivo en el SQL Editor y ejecutar con "Run"**

### 1.2. Configurar Custom Access Token Hook

1. Ve a **Authentication** → **Hooks (Beta)**
2. Selecciona **Custom Access Token**
3. En el dropdown, selecciona: `public.custom_access_token_hook`
4. Haz clic en **Save**

### 1.3. Obtener Credenciales de API

1. Ve a **Project Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL**: `https://ejsaxspiunmyebveufon.supabase.co`
   - **anon/public key**: Clave pública (segura para cliente)
   - **service_role key**: Clave privada (¡NUNCA expongas!)

### 1.4. Configurar Email Templates (Opcional)

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los templates de:
   - Confirmación de registro
   - Recuperación de contraseña
   - Cambio de email

---

## 🐙 Parte 2: Configuración de GitHub

### 2.1. Crear Repositorio

```bash
# Si aún no has inicializado Git
git init
git add .
git commit -m "Initial commit: Animation Directory Project"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/tu-usuario/animation.git
git branch -M main
git push -u origin main
```

### 2.2. Estructura Recomendada de Ramas

```
main           → Producción (desplegado automáticamente)
develop        → Desarrollo/Staging
feature/*      → Nuevas funcionalidades
hotfix/*       → Correcciones urgentes
```

### 2.3. Configurar GitHub Actions (Opcional)

Crea `.github/workflows/ci.yml` para testing automático:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint
      - name: Build project
        run: npm run build
```

---

## ☁️ Parte 3: Despliegue en Vercel

### 3.1. Método 1: Importar desde GitHub (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona **"Import Git Repository"**
4. Autoriza a Vercel acceso a tu cuenta de GitHub
5. Selecciona el repositorio `animation`
6. Configura el proyecto:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3.2. Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

**Importante**:
- Marca las variables públicas (`NEXT_PUBLIC_*`) para todos los entornos
- Marca `SUPABASE_SERVICE_ROLE_KEY` solo para Production y Preview

### 3.3. Deploy

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. Tu sitio estará disponible en: `https://tu-proyecto.vercel.app`

### 3.4. Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# O directamente a producción
vercel --prod
```

---

## 🔄 Parte 4: CI/CD Automático

### 4.1. Configuración de Deploy Automático

Vercel automáticamente:
- ✅ Despliega cada push a `main` como **Production**
- ✅ Despliega cada PR como **Preview Deployment**
- ✅ Ejecuta builds en cada push

### 4.2. Configurar Supabase en Vercel

Vercel detecta automáticamente Supabase. Para integración avanzada:

1. Ve a tu proyecto en Vercel
2. Navega a **Integrations**
3. Busca **Supabase** y haz clic en **Add Integration**
4. Autoriza la conexión
5. Selecciona tu proyecto de Supabase

### 4.3. Preview Deployments

Cada Pull Request crea un deployment de preview:

```bash
# Crear una rama
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y commit
git add .
git commit -m "Add new feature"

# Push a GitHub
git push origin feature/nueva-funcionalidad
```

Vercel automáticamente:
1. Crea un preview deployment
2. Ejecuta los tests
3. Comenta en el PR con la URL de preview

---

## 🌐 Parte 5: Configuración de Dominio Personalizado

### 5.1. Agregar Dominio

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Domains**
3. Ingresa tu dominio: `tudominio.com`
4. Vercel te dará los DNS records a configurar

### 5.2. Configurar DNS

En tu proveedor de DNS (GoDaddy, Namecheap, etc.):

**Opción A: Dominio raíz (tudominio.com)**

```
A Record:
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Opción B: Subdominio (www.tudominio.com)**

```
CNAME Record:
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 5.3. Actualizar Variables de Entorno

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

---

## 📊 Parte 6: Monitoreo y Analytics

### 6.1. Vercel Analytics

1. Ve a tu proyecto → **Analytics**
2. Activa **Vercel Analytics** (gratis en plan Pro)
3. Instala el paquete:

```bash
npm install @vercel/analytics
```

4. Agrega al layout:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 6.2. Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### 6.3. Supabase Logs

Monitorea actividad en tiempo real:

1. Dashboard de Supabase → **Logs**
2. Filtra por:
   - API requests
   - Auth events
   - Database queries
   - Edge Functions

---

## 🔐 Parte 7: Seguridad

### 7.1. Configurar Allowed URLs en Supabase

1. Ve a **Authentication** → **URL Configuration**
2. Agrega tus URLs autorizadas:

```
Site URL: https://tudominio.com
Redirect URLs:
  - https://tudominio.com/**
  - https://*.vercel.app/**  (para preview deployments)
```

### 7.2. CORS Configuration

En Supabase, los CORS ya están configurados. Para customizar:

1. **Settings** → **API** → **API Settings**
2. Agrega dominios permitidos

### 7.3. Rate Limiting

Supabase tiene rate limiting por defecto. Para customizar:

1. **Settings** → **API**
2. Configura límites por IP/usuario

### 7.4. Secrets en Vercel

Nunca expongas secrets en el código:

```bash
# Agregar secret desde CLI
vercel secrets add supabase-service-role-key "tu-key-aqui"

# Referenciar en vercel.json
{
  "env": {
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  }
}
```

---

## 🧪 Parte 8: Testing Pre-Deployment

### 8.1. Build Local

```bash
# Crear build de producción
npm run build

# Probar build local
npm run start
```

### 8.2. Checklist Pre-Deploy

- [ ] ✅ Todas las migraciones aplicadas en Supabase
- [ ] ✅ Hook de autenticación configurado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Build exitoso localmente
- [ ] ✅ Tests pasando (si existen)
- [ ] ✅ No hay secrets expuestos en el código
- [ ] ✅ URLs permitidas configuradas en Supabase

---

## 🔄 Parte 9: Workflow de Desarrollo

### Flujo Recomendado

```bash
# 1. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar localmente
npm run dev

# 3. Commit frecuentes
git add .
git commit -m "feat: descripción del cambio"

# 4. Push y crear PR
git push origin feature/nueva-funcionalidad

# 5. Vercel crea preview deployment automáticamente

# 6. Review y test en preview URL

# 7. Merge a main → Deploy automático a producción
```

### Convención de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo de código
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
```

---

## 📈 Parte 10: Optimización

### 10.1. Edge Functions

Para funcionalidades que requieran edge computing:

```typescript
// app/api/some-endpoint/route.ts
export const runtime = 'edge'

export async function GET(request: Request) {
  // Tu código aquí
}
```

### 10.2. Image Optimization

Next.js optimiza imágenes automáticamente:

```typescript
import Image from 'next/image'

<Image
  src={profile.avatar_url}
  width={200}
  height={200}
  alt={profile.full_name}
/>
```

### 10.3. Caching

```typescript
// Revalidar cada hora
export const revalidate = 3600

export default async function Page() {
  // Fetch data
}
```

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Ver logs detallados en Vercel Dashboard
# O localmente:
npm run build -- --debug
```

### Variables de Entorno No Funcionan

1. Verifica que tengan el prefijo `NEXT_PUBLIC_` si se usan en cliente
2. Redeploy después de cambiar variables
3. Limpia caché: `rm -rf .next`

### Errores de Supabase

```bash
# Verificar conectividad
curl https://ejsaxspiunmyebveufon.supabase.co/rest/v1/

# Ver logs en Dashboard de Supabase
```

---

## ✅ Checklist Final

Antes de lanzar a producción:

- [ ] ✅ Migraciones aplicadas
- [ ] ✅ Hook de auth configurado
- [ ] ✅ RLS habilitado y testeado
- [ ] ✅ Variables de entorno en Vercel
- [ ] ✅ Dominio configurado (si aplica)
- [ ] ✅ Analytics activado
- [ ] ✅ HTTPS forzado
- [ ] ✅ Allowed URLs configuradas
- [ ] ✅ Tests pasando
- [ ] ✅ Build exitoso
- [ ] ✅ Preview deployment testeado
- [ ] ✅ Performance auditado (Lighthouse)

---

## 📞 Soporte

**Vercel**: https://vercel.com/support
**Supabase**: https://supabase.com/support
**Next.js**: https://nextjs.org/docs

---

**¡Felicidades! 🎉 Tu aplicación está en producción.**
