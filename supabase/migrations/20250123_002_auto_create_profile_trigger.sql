-- ========================================
-- MIGRACIÓN 002: Trigger para Crear Perfil Automático
-- ========================================
-- Descripción: Crea automáticamente un perfil y asigna rol 'standard' cuando se registra un usuario
-- Proyecto: Directorio de Profesionales de Animación
-- Fecha: 2025-01-23

-- ----------------------------------------
-- FUNCIÓN PARA MANEJAR NUEVOS USUARIOS
-- ----------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insertar perfil básico para el nuevo usuario
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    country,
    city
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario Nuevo'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'No especificado'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'No especificado')
  );

  -- Asignar rol 'standard' por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'standard');

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Crea automáticamente un perfil y asigna el rol standard cuando un usuario se registra';

-- ----------------------------------------
-- TRIGGER EN auth.users
-- ----------------------------------------

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger que se ejecuta automáticamente al crear un usuario nuevo';

-- ----------------------------------------
-- PERMISOS
-- ----------------------------------------

-- Revocar permisos públicos innecesarios
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

-- Solo el sistema puede ejecutar esta función
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
