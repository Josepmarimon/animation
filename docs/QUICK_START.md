# ⚡ Quick Start - Guía Rápida de 5 Minutos

Configura tu proyecto de Directorio de Profesionales de Animación en menos de 5 minutos.

---

## 🎯 Paso 1: Aplicar Migraciones en Supabase (2 min)

1. Ve a tu proyecto Supabase: https://app.supabase.com/project/ejsaxspiunmyebveufon
2. Navega a **SQL Editor** (icono de datos en el menú lateral)
3. Ejecuta estos archivos **en orden**:

```
✓ 20250123_001_init_profiles_and_roles.sql
✓ 20250123_002_auto_create_profile_trigger.sql
✓ 20250123_003_custom_access_token_hook.sql
✓ 20250123_004_row_level_security_policies.sql
✓ 20250123_005_authorization_functions.sql
```

**Cómo ejecutar:**
- Abre cada archivo desde `supabase/migrations/`
- Copia todo el contenido
- Pégalo en el SQL Editor
- Haz clic en **"Run"** o presiona `Ctrl+Enter`
- Espera el mensaje "Success. No rows returned"
- Repite con el siguiente archivo

---

## 🔧 Paso 2: Configurar Hook de Autenticación (30 seg)

1. En el Dashboard de Supabase, ve a **Authentication** → **Hooks (Beta)**
2. Selecciona **"Custom Access Token"**
3. En el dropdown, elige: `public.custom_access_token_hook`
4. Haz clic en **"Save"**

✅ **Hecho!** Los roles ahora se inyectarán en el JWT automáticamente.

---

## 🔑 Paso 3: Obtener Credenciales de API (30 seg)

1. Ve a **Project Settings** → **API**
2. Copia estos valores:

```env
Project URL: https://ejsaxspiunmyebveufon.supabase.co
anon key: eyJ... (clave pública)
service_role key: eyJ... (clave privada - ¡NO EXPONGAS!)
```

---

## 💻 Paso 4: Configurar Variables de Entorno (30 seg)

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ejsaxspiunmyebveufon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

---

## 🧪 Paso 5: Probar el Sistema (1 min)

### Opción A: Probar desde el Dashboard

1. Ve a **Authentication** → **Users** en Supabase
2. Haz clic en **"Add user"** → **"Create new user"**
3. Ingresa:
   - Email: `test@example.com`
   - Password: `test123456`
   - User Metadata (JSON):
   ```json
   {
     "full_name": "Usuario de Prueba",
     "country": "España",
     "city": "Barcelona"
   }
   ```
4. Haz clic en **"Create user"**

### Verificar que Funciona

Ve a **SQL Editor** y ejecuta:

```sql
-- Ver el perfil creado automáticamente
SELECT * FROM public.profiles WHERE email = 'test@example.com';

-- Ver el rol asignado
SELECT
  p.full_name,
  p.email,
  ur.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'test@example.com';
```

**Deberías ver:**
- ✅ Un perfil en `profiles` con nombre "Usuario de Prueba"
- ✅ Un rol `standard` en `user_roles`

---

## 👑 Paso 6: Crear tu Primer Admin (30 seg)

```sql
-- Reemplaza 'tu-email@ejemplo.com' con tu email real
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

Ejecuta esto en el SQL Editor. Ahora tu cuenta tiene privilegios de admin.

---

## 🚀 Paso 7: Siguiente - Crear la Aplicación Next.js

Tu base de datos está lista. Ahora puedes:

### Opción A: Crear proyecto desde cero

```bash
npx create-next-app@latest animation-app --typescript --tailwind --app
cd animation-app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs jwt-decode
```

### Opción B: Usar ejemplos de código

Consulta **`NEXTJS_EXAMPLES.md`** para ver:
- Página de registro
- Página de login
- Perfil de usuario
- Directorio de profesionales
- Panel de administración

---

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Visión general del proyecto |
| `AUTHENTICATION_SYSTEM.md` | **⭐ Documentación completa** del sistema de auth |
| `NEXTJS_EXAMPLES.md` | Ejemplos de código para Next.js |
| `DEPLOYMENT_GUIDE.md` | Guía paso a paso para deploy en Vercel |
| `PROJECT_STRUCTURE.md` | Arquitectura y diagramas |
| `QUICK_START.md` | Esta guía |

---

## ✅ Checklist de Configuración

- [ ] ✅ Migraciones aplicadas (5 archivos .sql)
- [ ] ✅ Hook de auth configurado
- [ ] ✅ Variables de entorno copiadas
- [ ] ✅ Usuario de prueba creado
- [ ] ✅ Cuenta de admin configurada
- [ ] ⬜ Proyecto Next.js creado
- [ ] ⬜ Deploy en Vercel

---

## 🆘 ¿Problemas?

### Error: "relation does not exist"
**Solución:** Verifica que todas las migraciones se ejecutaron en orden.

```sql
-- Ver tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

Deberías ver:
- ✅ `profiles`
- ✅ `user_roles`

### Error: "function does not exist"
**Solución:** Ejecuta la migración 005 (authorization_functions.sql).

```sql
-- Verificar funciones creadas
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';
```

### El trigger no crea el perfil automáticamente
**Solución:** Verifica el trigger:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Si no aparece, ejecuta de nuevo: `20250123_002_auto_create_profile_trigger.sql`

---

## 📞 Siguientes Pasos

1. ✅ **Sistema configurado** → Lee `NEXTJS_EXAMPLES.md`
2. ⬜ **Crear frontend** → Implementa las páginas de ejemplo
3. ⬜ **Deploy** → Sigue `DEPLOYMENT_GUIDE.md`
4. ⬜ **Personalizar** → Adapta el diseño a tu marca

---

## 🎉 ¡Listo!

Tu backend está completamente configurado con:
- ✅ Autenticación segura (Supabase Auth)
- ✅ 3 niveles de usuario (standard, premium, admin)
- ✅ Perfiles profesionales
- ✅ Sistema de roles en JWT
- ✅ Row Level Security
- ✅ Funciones de autorización

**Tiempo total:** ~5 minutos ⚡

Ahora puedes empezar a construir el frontend con Next.js usando los ejemplos de código en `NEXTJS_EXAMPLES.md`.

---

**¿Necesitas ayuda? Revisa la documentación completa en `AUTHENTICATION_SYSTEM.md`**
