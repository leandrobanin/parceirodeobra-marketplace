-- =============================================================================
--                 PARCEIRO DE OBRA - SUPABASE HARDENING & RLS POLICIES
-- =============================================================================
-- Run this script in the Supabase SQL Editor AFTER the Prisma tables are created.
-- This ensures strict security, automatic profile creation, and proper RLS.
-- =============================================================================

-- =============================================================================
-- 1. SETUP & EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 2. HELPER FUNCTIONS
-- =============================================================================

/**
 * Gets the role of the currently authenticated user.
 * Marked as SECURITY DEFINER to bypass RLS restrictions during lookup.
 */
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role
  FROM public."User"
  WHERE id = auth.uid()::TEXT
  LIMIT 1
$$;

-- =============================================================================
-- 3. USER SIGNUP TRIGGER (Profile Auto-Creation)
-- =============================================================================

/**
 * Automatically creates a matching "Customer" or "Professional" profile
 * in the public schema when a user registers via Supabase Auth.
 */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role  TEXT;
  user_role       TEXT;
  user_name       TEXT;
  user_city       TEXT;
  user_state      TEXT;
  profile_photo   TEXT;
  slug_name       TEXT;
BEGIN
  -- 1. Resolve and normalize user role
  requested_role := UPPER(COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'));
  user_role      := CASE
    WHEN requested_role = 'PROFESSIONAL' THEN 'PROFESSIONAL'
    ELSE 'CUSTOMER'
  END;

  -- 2. Clean and format name & location metadata
  user_name  := LEFT(BTRIM(COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  )), 120);

  user_city     := LEFT(BTRIM(COALESCE(NEW.raw_user_meta_data->>'city', 'Porto Ferreira')), 80);
  user_state    := 'SP';
  profile_photo := NULLIF(NEW.raw_user_meta_data->>'avatar_url', '');

  -- 3. Insert primary User account record
  INSERT INTO public."User" (id, email, password, role, "createdAt", "updatedAt")
  VALUES (NEW.id::TEXT, LOWER(NEW.email), '', user_role, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- 4. Create role-specific profiles
  IF user_role = 'PROFESSIONAL' THEN
    slug_name := LOWER(REGEXP_REPLACE(user_name, '[^a-zA-Z0-9]+', '-', 'g'))
      || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);

    INSERT INTO public."Professional" (
      id,
      "userId",
      name,
      "profilePhoto",
      slug,
      city,
      state,
      availability,
      "createdAt",
      "updatedAt"
    )
    VALUES (
      gen_random_uuid()::TEXT,
      NEW.id::TEXT,
      user_name,
      profile_photo,
      slug_name,
      user_city,
      user_state,
      TRUE,
      NOW(),
      NOW()
    )
    ON CONFLICT ("userId") DO NOTHING;
  ELSE
    INSERT INTO public."Customer" (
      id,
      "userId",
      name,
      city,
      "createdAt",
      "updatedAt"
    )
    VALUES (
      gen_random_uuid()::TEXT,
      NEW.id::TEXT,
      user_name,
      user_city,
      NOW(),
      NOW()
    )
    ON CONFLICT ("userId") DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 4. ROW LEVEL SECURITY (RLS) ACTIVATION
-- =============================================================================

ALTER TABLE public."User"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Customer"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Professional"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProfessionalCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Review"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PortfolioPhoto"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Favorite"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Notification"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session"              ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- --- [User Table Policies] ---------------------------------------------------

DROP POLICY IF EXISTS "user_select_self_or_admin" ON public."User";
CREATE POLICY "user_select_self_or_admin"
  ON public."User"
  FOR SELECT
  TO authenticated
  USING (id = auth.uid()::TEXT OR public.current_user_role() = 'ADMIN');

-- --- [Customer Table Policies] -----------------------------------------------

DROP POLICY IF EXISTS "customer_select_self_or_admin" ON public."Customer";
CREATE POLICY "customer_select_self_or_admin"
  ON public."Customer"
  FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid()::TEXT OR public.current_user_role() = 'ADMIN');

DROP POLICY IF EXISTS "customer_update_self" ON public."Customer";
CREATE POLICY "customer_update_self"
  ON public."Customer"
  FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid()::TEXT)
  WITH CHECK ("userId" = auth.uid()::TEXT);

-- --- [Professional Table Policies] -------------------------------------------

DROP POLICY IF EXISTS "professional_public_read" ON public."Professional";
CREATE POLICY "professional_public_read"
  ON public."Professional"
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "professional_update_owner_or_admin" ON public."Professional";
CREATE POLICY "professional_update_owner_or_admin"
  ON public."Professional"
  FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid()::TEXT OR public.current_user_role() = 'ADMIN')
  WITH CHECK ("userId" = auth.uid()::TEXT OR public.current_user_role() = 'ADMIN');

-- --- [Category Table Policies] -----------------------------------------------

DROP POLICY IF EXISTS "category_public_read" ON public."Category";
CREATE POLICY "category_public_read"
  ON public."Category"
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "category_admin_write" ON public."Category";
CREATE POLICY "category_admin_write"
  ON public."Category"
  FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'ADMIN')
  WITH CHECK (public.current_user_role() = 'ADMIN');

-- --- [ProfessionalCategory Table Policies] -----------------------------------

DROP POLICY IF EXISTS "professional_category_public_read" ON public."ProfessionalCategory";
CREATE POLICY "professional_category_public_read"
  ON public."ProfessionalCategory"
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "professional_category_admin_write" ON public."ProfessionalCategory";
CREATE POLICY "professional_category_admin_write"
  ON public."ProfessionalCategory"
  FOR ALL
  TO authenticated
  USING (public.current_user_role() = 'ADMIN')
  WITH CHECK (public.current_user_role() = 'ADMIN');

-- --- [Review Table Policies] -------------------------------------------------

DROP POLICY IF EXISTS "review_public_read" ON public."Review";
CREATE POLICY "review_public_read"
  ON public."Review"
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "review_insert_own_customer" ON public."Review";
CREATE POLICY "review_insert_own_customer"
  ON public."Review"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    rating BETWEEN 1 AND 5
    AND EXISTS (
      SELECT 1 FROM public."Customer"
      WHERE id = "customerId"
        AND "userId" = auth.uid()::TEXT
    )
  );

DROP POLICY IF EXISTS "review_update_delete_own_or_admin" ON public."Review";
CREATE POLICY "review_update_delete_own_or_admin"
  ON public."Review"
  FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'ADMIN'
    OR EXISTS (
      SELECT 1 FROM public."Customer"
      WHERE id = "customerId"
        AND "userId" = auth.uid()::TEXT
    )
  )
  WITH CHECK (
    rating BETWEEN 1 AND 5
    AND (
      public.current_user_role() = 'ADMIN'
      OR EXISTS (
        SELECT 1 FROM public."Customer"
        WHERE id = "customerId"
          AND "userId" = auth.uid()::TEXT
      )
    )
  );

-- --- [PortfolioPhoto Table Policies] -----------------------------------------

DROP POLICY IF EXISTS "portfolio_photo_public_read" ON public."PortfolioPhoto";
CREATE POLICY "portfolio_photo_public_read"
  ON public."PortfolioPhoto"
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "portfolio_photo_owner_write" ON public."PortfolioPhoto";
CREATE POLICY "portfolio_photo_owner_write"
  ON public."PortfolioPhoto"
  FOR ALL
  TO authenticated
  USING (
    public.current_user_role() = 'ADMIN'
    OR EXISTS (
      SELECT 1 FROM public."Professional"
      WHERE id = "professionalId"
        AND "userId" = auth.uid()::TEXT
    )
  )
  WITH CHECK (
    public.current_user_role() = 'ADMIN'
    OR EXISTS (
      SELECT 1 FROM public."Professional"
      WHERE id = "professionalId"
        AND "userId" = auth.uid()::TEXT
    )
  );

-- --- [Favorite Table Policies] -----------------------------------------------

DROP POLICY IF EXISTS "favorite_owner_crud" ON public."Favorite";
CREATE POLICY "favorite_owner_crud"
  ON public."Favorite"
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Customer"
      WHERE id = "customerId"
        AND "userId" = auth.uid()::TEXT
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."Customer"
      WHERE id = "customerId"
        AND "userId" = auth.uid()::TEXT
    )
  );

-- --- [Notification Table Policies] -------------------------------------------

DROP POLICY IF EXISTS "notification_owner_or_admin" ON public."Notification";
CREATE POLICY "notification_owner_or_admin"
  ON public."Notification"
  FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid()::TEXT OR public.current_user_role() = 'ADMIN');

DROP POLICY IF EXISTS "notification_owner_update" ON public."Notification";
CREATE POLICY "notification_owner_update"
  ON public."Notification"
  FOR UPDATE
  TO authenticated
  USING ("userId" = auth.uid()::TEXT)
  WITH CHECK ("userId" = auth.uid()::TEXT);
