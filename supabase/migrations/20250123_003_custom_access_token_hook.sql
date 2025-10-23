-- ========================================
-- MIGRACIÓN 003: Custom Access Token Hook
-- ========================================
-- Descripción: Inyecta el rol del usuario en el JWT para autorización
-- Proyecto: Directorio de Profesionales de Animación
-- Fecha: 2025-01-23

-- ----------------------------------------
-- FUNCIÓN HOOK PARA TOKEN DE ACCESO
-- ----------------------------------------

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims JSONB;
  user_role_value public.user_role;
  is_premium_active BOOLEAN;
BEGIN
  -- Extraer claims del evento
  claims := event->'claims';

  -- Obtener el rol del usuario desde user_roles
  SELECT role INTO user_role_value
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::UUID
  LIMIT 1;

  -- Si el usuario tiene rol, agregarlo al JWT
  IF user_role_value IS NOT NULL THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role_value));

    -- Si el rol es premium, verificar si la suscripción está activa
    IF user_role_value = 'premium' THEN
      SELECT (
        subscription_end_date IS NULL OR
        subscription_end_date > NOW()
      ) INTO is_premium_active
      FROM public.user_roles
      WHERE user_id = (event->>'user_id')::UUID
        AND role = 'premium';

      -- Agregar flag de premium activo
      claims := jsonb_set(claims, '{is_premium_active}', to_jsonb(is_premium_active));
    END IF;
  ELSE
    -- Si no tiene rol, asignar 'standard' por defecto
    claims := jsonb_set(claims, '{user_role}', to_jsonb('standard'));
  END IF;

  -- Actualizar el evento con los claims modificados
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
END;
$$;

COMMENT ON FUNCTION public.custom_access_token_hook(JSONB) IS 'Hook que inyecta el rol del usuario en el JWT antes de emitirlo';

-- ----------------------------------------
-- PERMISOS PARA EL HOOK
-- ----------------------------------------

-- Dar acceso al schema public a supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

-- Dar permisos de ejecución solo a supabase_auth_admin
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

-- Revocar permisos innecesarios
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM anon;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM public;

-- Dar permisos de lectura a la tabla user_roles para el servicio de auth
GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;

-- ----------------------------------------
-- POLÍTICA RLS PARA supabase_auth_admin
-- ----------------------------------------

-- Permitir a supabase_auth_admin leer roles (necesario para el hook)
CREATE POLICY "Allow auth admin to read user roles"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO supabase_auth_admin
USING (true);

-- ----------------------------------------
-- NOTAS DE CONFIGURACIÓN
-- ----------------------------------------

-- IMPORTANTE: Después de ejecutar esta migración, debes:
-- 1. Ir al Dashboard de Supabase
-- 2. Navegar a Authentication > Hooks (Beta)
-- 3. Seleccionar "Custom Access Token"
-- 4. Elegir la función: public.custom_access_token_hook
-- 5. Guardar los cambios
--
-- Alternativamente, si usas Supabase CLI local:
-- Edita el archivo supabase/config.toml y agrega:
--
-- [auth.hook.custom_access_token]
-- enabled = true
-- uri = "pg-functions://postgres/public/custom_access_token_hook"
