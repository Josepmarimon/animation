-- Arreglar el hook para que no falle si no encuentra rol
DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_role_value public.user_role;
  is_premium_active boolean;
BEGIN
  -- Extraer claims del evento
  claims := event->'claims';

  -- Intentar obtener el rol del usuario (puede ser NULL)
  BEGIN
    SELECT role INTO user_role_value
    FROM public.user_roles
    WHERE user_id = (event->>'user_id')::uuid
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    -- Si falla la query, continuar sin error
    user_role_value := NULL;
  END;

  -- Si el usuario tiene rol, agregarlo al JWT
  IF user_role_value IS NOT NULL THEN
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role_value::text));

    -- Si el rol es premium, verificar si la suscripción está activa
    IF user_role_value = 'premium' THEN
      BEGIN
        SELECT (
          subscription_end_date IS NULL OR
          subscription_end_date > NOW()
        ) INTO is_premium_active
        FROM public.user_roles
        WHERE user_id = (event->>'user_id')::uuid
          AND role = 'premium';

        -- Agregar flag de premium activo
        claims := jsonb_set(claims, '{is_premium_active}', to_jsonb(is_premium_active));
      EXCEPTION WHEN OTHERS THEN
        -- Si falla, continuar sin error
        NULL;
      END;
    END IF;
  ELSE
    -- Si no tiene rol, asignar 'standard' por defecto en el JWT
    claims := jsonb_set(claims, '{user_role}', to_jsonb('standard'::text));
  END IF;

  -- Actualizar el evento con los claims modificados
  event := jsonb_set(event, '{claims}', claims);

  RETURN event;
EXCEPTION WHEN OTHERS THEN
  -- Si hay cualquier error, devolver el evento sin modificar
  -- Esto evita que el login falle completamente
  RETURN event;
END;
$$;

-- Dar permisos
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
GRANT SELECT ON TABLE public.user_roles TO supabase_auth_admin;

COMMENT ON FUNCTION public.custom_access_token_hook(jsonb) IS 'Hook que inyecta el rol del usuario en el JWT. No falla si el usuario no tiene rol aún.';
