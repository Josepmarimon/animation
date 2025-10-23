# 🚀 Guía de Deployment en Vercel - Paso a Paso

## 📋 Paso 1: Obtener Credenciales de Supabase

1. Ve a tu proyecto de Supabase:
   **https://app.supabase.com/project/ejsaxspiunmyebveufon/settings/api**

2. Copia estos valores:

   **Project URL:**
   ```
   https://ejsaxspiunmyebveufon.supabase.co
   ```

   **anon/public key:** (la clave que empieza con `eyJhbGci...`)
   ```
   [Copia la clave completa]
   ```

   **service_role key:** (⚠️ SECRETA - nunca expongas en cliente)
   ```
   [Copia la clave completa]
   ```

---

## 🚀 Paso 2: Crear Proyecto en Vercel

1. **Abre Vercel**: https://vercel.com/login

2. **Login con GitHub**:
   - Click en "Continue with GitHub"
   - Autoriza Vercel a acceder a tus repositorios

3. **Importar Proyecto**:
   - Click en **"Add New..."** → **"Project"**
   - Busca y selecciona: `Josepmarimon/animation`
   - Click en **"Import"**

---

## ⚙️ Paso 3: Configurar el Proyecto

### Framework Preset:
- Vercel detectará automáticamente que es un proyecto de **documentación**
- Si pregunta, selecciona: **"Other"** (porque aún no hay código Next.js)

### Root Directory:
- Déjalo en: `./` (raíz del proyecto)

### Build Settings:
- **Build Command**: Déjalo vacío por ahora (o usa `echo "No build needed"`)
- **Output Directory**: Déjalo vacío

---

## 🔐 Paso 4: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega estas 3 variables:

### Variable 1:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ejsaxspiunmyebveufon.supabase.co
Environment: Production, Preview, Development
```

### Variable 2:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [tu anon key de Supabase]
Environment: Production, Preview, Development
```

### Variable 3:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [tu service_role key de Supabase]
Environment: Production, Preview (⚠️ NO Development)
```

⚠️ **IMPORTANTE**: La `service_role` key solo debe estar en Production y Preview, NUNCA en Development.

---

## 🎯 Paso 5: Deploy

1. Click en **"Deploy"**
2. Espera 1-2 minutos mientras Vercel construye el proyecto
3. Una vez completado, verás la URL de tu proyecto:
   ```
   https://animation-xxx.vercel.app
   ```

---

## ⚙️ Paso 6: Configurar Custom Access Token Hook en Supabase

**MUY IMPORTANTE**: Debes configurar esto para que los roles funcionen en JWT.

1. Ve a tu Dashboard de Supabase:
   **https://app.supabase.com/project/ejsaxspiunmyebveufon/auth/hooks**

2. En la sección **"Hooks"**, busca **"Custom Access Token"**

3. Activa el hook y selecciona:
   - **Function**: `public.custom_access_token_hook`

4. Click en **"Save"**

---

## ✅ Verificar que Todo Funciona

### 1. Verificar Variables de Entorno en Vercel:

- Ve a tu proyecto en Vercel
- Settings → Environment Variables
- Confirma que las 3 variables están configuradas

### 2. Verificar Hook en Supabase:

- Ve a Authentication → Hooks
- Confirma que "Custom Access Token" está activo

### 3. Actualizar URLs Permitidas en Supabase:

Ve a: **https://app.supabase.com/project/ejsaxspiunmyebveufon/auth/url-configuration**

Agrega estas URLs:

**Site URL:**
```
https://animation-xxx.vercel.app
```
(Reemplaza `xxx` con tu dominio real de Vercel)

**Redirect URLs:**
```
https://animation-xxx.vercel.app/**
https://*.vercel.app/**
http://localhost:3000/**
```

---

## 🎉 ¡Listo!

Tu proyecto de documentación ya está desplegado en Vercel. Ahora puedes:

1. ✅ Compartir el link con tu equipo
2. ✅ Ver la documentación en vivo
3. ✅ Cada push a `main` desplegará automáticamente

---

## 🔄 Próximos Pasos (cuando agregues Next.js)

Cuando crees tu aplicación Next.js:

1. Crea el proyecto Next.js en el mismo repositorio
2. Vercel detectará automáticamente el framework
3. Las variables de entorno ya estarán configuradas
4. Los deployments automáticos seguirán funcionando

---

## 📞 ¿Problemas?

Si algo no funciona:

1. Verifica que las migraciones estén aplicadas en Supabase
2. Confirma que el Hook está activado
3. Revisa los logs en Vercel Dashboard
4. Verifica que las URLs estén permitidas en Supabase

---

**Fecha de creación**: 23 de octubre de 2025
**Repositorio**: https://github.com/Josepmarimon/animation
