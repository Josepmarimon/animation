-- ========================================
-- MIGRACIÓN 005: Funciones de Autorización
-- ========================================
-- Descripción: Funciones helper para verificar roles y permisos en la aplicación
-- Proyecto: Directorio de Profesionales de Animación
-- Fecha: 2025-01-23

-- ----------------------------------------
-- FUNCIÓN: get_current_user_role
-- ----------------------------------------
-- Retorna el rol del usuario actual desde el JWT

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  role_value TEXT;
BEGIN
  -- Obtener el rol del JWT
  role_value := (SELECT auth.jwt() ->> 'user_role');

  -- Si no tiene rol, retornar 'standard'
  IF role_value IS NULL THEN
    RETURN 'standard'::public.user_role;
  END IF;

  RETURN role_value::public.user_role;
END;
$$;

COMMENT ON FUNCTION public.get_current_user_role() IS 'Retorna el rol del usuario actual desde el JWT';

-- ----------------------------------------
-- FUNCIÓN: is_admin
-- ----------------------------------------
-- Verifica si el usuario actual es administrador

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT public.get_current_user_role()) = 'admin';
END;
$$;

COMMENT ON FUNCTION public.is_admin() IS 'Retorna true si el usuario actual es administrador';

-- ----------------------------------------
-- FUNCIÓN: is_premium
-- ----------------------------------------
-- Verifica si el usuario actual tiene cuenta premium activa

CREATE OR REPLACE FUNCTION public.is_premium()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  premium_active BOOLEAN;
BEGIN
  -- Primero verificar si el rol es premium desde el JWT
  IF (SELECT public.get_current_user_role()) != 'premium' THEN
    RETURN false;
  END IF;

  -- Verificar que la suscripción esté activa
  SELECT (
    subscription_end_date IS NULL OR
    subscription_end_date > NOW()
  ) INTO premium_active
  FROM public.user_roles
  WHERE user_id = (SELECT auth.uid())
    AND role = 'premium';

  RETURN COALESCE(premium_active, false);
END;
$$;

COMMENT ON FUNCTION public.is_premium() IS 'Retorna true si el usuario tiene cuenta premium activa';

-- ----------------------------------------
-- FUNCIÓN: is_premium_or_admin
-- ----------------------------------------
-- Verifica si el usuario es premium o admin

CREATE OR REPLACE FUNCTION public.is_premium_or_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    (SELECT public.get_current_user_role()) IN ('premium', 'admin')
  );
END;
$$;

COMMENT ON FUNCTION public.is_premium_or_admin() IS 'Retorna true si el usuario es premium o administrador';

-- ----------------------------------------
-- FUNCIÓN: get_user_profile
-- ----------------------------------------
-- Obtiene el perfil completo del usuario actual

CREATE OR REPLACE FUNCTION public.get_user_profile()
RETURNS public.profiles
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  profile_record public.profiles;
BEGIN
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN profile_record;
END;
$$;

COMMENT ON FUNCTION public.get_user_profile() IS 'Retorna el perfil completo del usuario actual';

-- ----------------------------------------
-- FUNCIÓN: can_edit_profile
-- ----------------------------------------
-- Verifica si el usuario puede editar un perfil específico

CREATE OR REPLACE FUNCTION public.can_edit_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    -- Es su propio perfil
    (SELECT auth.uid()) = profile_id
    OR
    -- Es administrador
    (SELECT public.is_admin())
  );
END;
$$;

COMMENT ON FUNCTION public.can_edit_profile(UUID) IS 'Verifica si el usuario puede editar un perfil específico';

-- ----------------------------------------
-- FUNCIÓN: upgrade_to_premium
-- ----------------------------------------
-- Actualiza un usuario a premium (solo para admins o sistema de pagos)

CREATE OR REPLACE FUNCTION public.upgrade_to_premium(
  target_user_id UUID,
  subscription_end TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo admins pueden ejecutar esta función
  IF NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Only admins can upgrade users to premium';
  END IF;

  -- Actualizar el rol existente o insertar uno nuevo
  INSERT INTO public.user_roles (user_id, role, subscription_start_date, subscription_end_date)
  VALUES (target_user_id, 'premium', NOW(), subscription_end)
  ON CONFLICT (user_id, role)
  DO UPDATE SET
    subscription_start_date = NOW(),
    subscription_end_date = subscription_end,
    updated_at = NOW();

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.upgrade_to_premium(UUID, TIMESTAMPTZ) IS 'Actualiza un usuario a premium (solo admins)';

-- ----------------------------------------
-- FUNCIÓN: downgrade_from_premium
-- ----------------------------------------
-- Degrada un usuario de premium a standard

CREATE OR REPLACE FUNCTION public.downgrade_from_premium(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo admins pueden ejecutar esta función
  IF NOT (SELECT public.is_admin()) THEN
    RAISE EXCEPTION 'Only admins can downgrade users from premium';
  END IF;

  -- Eliminar el rol premium
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'premium';

  -- Asegurarse de que tenga rol standard
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'standard')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.downgrade_from_premium(UUID) IS 'Degrada un usuario de premium a standard (solo admins)';

-- ----------------------------------------
-- PERMISOS
-- ----------------------------------------

-- Permitir a usuarios autenticados usar estas funciones
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_premium() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_premium_or_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.upgrade_to_premium(UUID, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.downgrade_from_premium(UUID) TO authenticated;

-- Revocar de usuarios no autenticados
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_premium() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_premium_or_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_profile() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_edit_profile(UUID) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.upgrade_to_premium(UUID, TIMESTAMPTZ) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.downgrade_from_premium(UUID) FROM anon, public;
