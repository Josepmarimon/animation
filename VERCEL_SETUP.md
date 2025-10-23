# 🚀 Deploy en Vercel - Configuración Lista

Tus credenciales de Supabase están listas. Sigue estos pasos para desplegar en Vercel.

---

## 📋 Paso 1: Importar Proyecto en Vercel

1. **Ve a Vercel**: https://vercel.com/new

2. **Importa desde GitHub**:
   - Busca: `Josepmarimon/animation`
   - Click en **"Import"**

---

## ⚙️ Paso 2: Configurar Variables de Entorno

En la sección **"Environment Variables"**, copia y pega estos valores **EXACTAMENTE** como están:

### ✅ Variable 1: NEXT_PUBLIC_SUPABASE_URL

```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**
```
https://ejsaxspiunmyebveufon.supabase.co
```

**Environments:** ✅ Production, ✅ Preview, ✅ Development

---

### ✅ Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc2F4c3BpdW5teWVidmV1Zm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExOTM4NzIsImV4cCI6MjA3Njc2OTg3Mn0.nD_Hfa7hYqN6WsXDO4q4JjZJFdIGrnrbCvzdv0EC-Ko
```

**Environments:** ✅ Production, ✅ Preview, ✅ Development

---

### ✅ Variable 3: SUPABASE_SERVICE_ROLE_KEY

```
SUPABASE_SERVICE_ROLE_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc2F4c3BpdW5teWVidmV1Zm9uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE5Mzg3MiwiZXhwIjoyMDc2NzY5ODcyfQ.Tu8zN0oKQ8LmzRMmNl_937mr1BDjW70-svDz9WTWSi4
```

**Environments:** ✅ Production, ✅ Preview, ❌ Development

⚠️ **IMPORTANTE**: Esta clave es SECRETA. Solo márcala en Production y Preview.

---

## 🎯 Paso 3: Configuración del Build

Deja los valores por defecto:

- **Framework Preset**: Other (o déjalo detectar automáticamente)
- **Root Directory**: `./`
- **Build Command**: (vacío o `echo "Documentation only"`)
- **Output Directory**: (vacío)

---

## 🚀 Paso 4: Deploy

1. Click en **"Deploy"**
2. Espera 1-2 minutos
3. ¡Listo! Verás tu URL: `https://animation-xxx.vercel.app`

---

## ⚙️ Paso 5: Configurar Hook en Supabase (CRÍTICO)

**Esto es OBLIGATORIO para que los roles funcionen:**

1. Ve a: https://app.supabase.com/project/ejsaxspiunmyebveufon/auth/hooks

2. En **"Hooks"**, busca **"Custom Access Token"**

3. Activa el toggle y selecciona:
   ```
   public.custom_access_token_hook
   ```

4. Click en **"Save"**

Sin este paso, los roles NO se inyectarán en el JWT.

---

## 🌐 Paso 6: Configurar URLs Permitidas en Supabase

1. Ve a: https://app.supabase.com/project/ejsaxspiunmyebveufon/auth/url-configuration

2. Agrega tu URL de Vercel en **"Redirect URLs"**:

**Después del deploy, agrega:**
```
https://animation-xxx.vercel.app/**
https://*.vercel.app/**
http://localhost:3000/**
```

(Reemplaza `xxx` con tu dominio real de Vercel)

---

## ✅ Checklist Final

- [ ] Proyecto importado en Vercel
- [ ] 3 variables de entorno configuradas
- [ ] Deploy completado exitosamente
- [ ] Custom Access Token Hook activado en Supabase
- [ ] URLs permitidas agregadas en Supabase
- [ ] Verificar que la documentación se ve correctamente

---

## 🎉 ¡Listo para Producción!

Tu backend de autenticación está completamente configurado:

- ✅ Base de datos con RLS
- ✅ Autenticación con 3 niveles de usuario
- ✅ JWT con roles automáticos
- ✅ Documentación desplegada
- ✅ Variables de entorno seguras

---

## 🔄 Próximos Pasos

Cuando agregues tu aplicación Next.js:

1. Las variables de entorno ya estarán configuradas
2. Los deployments serán automáticos en cada push
3. Podrás usar las funciones de autorización
4. El sistema de roles funcionará de inmediato

---

**Repositorio**: https://github.com/Josepmarimon/animation
**Proyecto Supabase**: https://app.supabase.com/project/ejsaxspiunmyebveufon
**Documentación Local**: `AUTHENTICATION_SYSTEM.md`
