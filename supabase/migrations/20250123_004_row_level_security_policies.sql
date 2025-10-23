-- ========================================
-- MIGRACIÓN 004: Políticas de Row Level Security (RLS)
-- ========================================
-- Descripción: Define políticas de seguridad para controlar acceso a datos
-- Proyecto: Directorio de Profesionales de Animación
-- Fecha: 2025-01-23

-- ========================================
-- TABLA: public.profiles
-- ========================================

-- Habilitar RLS en la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- POLÍTICAS SELECT (Lectura)
-- ----------------------------------------

-- Política: Todos pueden ver perfiles públicos
CREATE POLICY "Anyone can view public profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Política: Usuarios autenticados pueden ver su propio perfil (incluso si no es público)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

-- Política: Administradores pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ----------------------------------------
-- POLÍTICAS INSERT (Creación)
-- ----------------------------------------

-- Política: Los usuarios solo pueden crear su propio perfil
-- Nota: En la práctica, esto lo hace el trigger automáticamente
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

-- ----------------------------------------
-- POLÍTICAS UPDATE (Actualización)
-- ----------------------------------------

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Política: Administradores pueden actualizar cualquier perfil
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ----------------------------------------
-- POLÍTICAS DELETE (Eliminación)
-- ----------------------------------------

-- Política: Los usuarios pueden eliminar su propio perfil
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = id);

-- Política: Administradores pueden eliminar cualquier perfil
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ========================================
-- TABLA: public.user_roles
-- ========================================

-- Habilitar RLS en la tabla user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- POLÍTICAS SELECT (Lectura)
-- ----------------------------------------

-- Política: Los usuarios pueden ver su propio rol
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Política: Administradores pueden ver todos los roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ----------------------------------------
-- POLÍTICAS INSERT (Creación)
-- ----------------------------------------

-- Política: Solo los administradores pueden asignar roles manualmente
-- Nota: El trigger handle_new_user crea el rol inicial automáticamente
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ----------------------------------------
-- POLÍTICAS UPDATE (Actualización)
-- ----------------------------------------

-- Política: Solo los administradores pueden actualizar roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
)
WITH CHECK (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ----------------------------------------
-- POLÍTICAS DELETE (Eliminación)
-- ----------------------------------------

-- Política: Solo los administradores pueden eliminar roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  (SELECT (auth.jwt() ->> 'user_role')::public.user_role) = 'admin'
);

-- ========================================
-- COMENTARIOS
-- ========================================

COMMENT ON POLICY "Anyone can view public profiles" ON public.profiles IS 'Permite a cualquiera ver perfiles marcados como públicos';
COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS 'Los usuarios pueden ver su propio perfil incluso si no es público';
COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS 'Los usuarios solo pueden editar su propio perfil';
COMMENT ON POLICY "Admins can view all profiles" ON public.profiles IS 'Los administradores pueden ver todos los perfiles';
COMMENT ON POLICY "Only admins can update roles" ON public.user_roles IS 'Solo administradores pueden cambiar roles de usuarios';
