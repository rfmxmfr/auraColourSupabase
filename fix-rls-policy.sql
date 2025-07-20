-- Fix the infinite recursion in RLS policies

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;

-- Create a function to safely check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users
    JOIN public.users ON auth.users.id = public.users.id
    WHERE auth.users.id = auth.uid() AND public.users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policies using the function instead of a direct query
CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all submissions" ON public.submissions
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all reports" ON public.reports
  FOR ALL USING (public.is_admin());