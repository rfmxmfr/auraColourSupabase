-- Create admin role
CREATE ROLE admin;

-- Create admin dashboard view for submissions
CREATE OR REPLACE VIEW admin_dashboard_submissions AS
SELECT 
  s.id,
  s.created_at,
  s.status,
  s.updated_at,
  p.email as user_email,
  p.full_name as user_name,
  s.questionnaire_responses,
  s.photo_url
FROM 
  public.submissions s
JOIN 
  public.profiles p ON s.user_id = p.id
ORDER BY 
  s.created_at DESC;

-- Create admin dashboard view for reports
CREATE OR REPLACE VIEW admin_dashboard_reports AS
SELECT 
  r.id,
  r.created_at,
  r.updated_at,
  s.id as submission_id,
  p.email as user_email,
  p.full_name as user_name,
  r.color_analysis,
  r.style_report
FROM 
  public.reports r
JOIN 
  public.submissions s ON r.submission_id = s.id
JOIN 
  public.profiles p ON s.user_id = p.id
ORDER BY 
  r.created_at DESC;

-- Grant permissions to admin role
GRANT SELECT ON admin_dashboard_submissions TO admin;
GRANT SELECT ON admin_dashboard_reports TO admin;
GRANT SELECT, INSERT, UPDATE ON public.submissions TO admin;
GRANT SELECT, INSERT, UPDATE ON public.reports TO admin;
GRANT SELECT ON public.profiles TO admin;

-- Create admin user function
-- This should be executed in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT, admin_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert user into auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    is_super_admin
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('full_name', admin_name),
    now(),
    now(),
    'authenticated',
    TRUE
  )
  RETURNING id INTO new_user_id;
  
  -- The trigger will automatically create the profile
  
  -- Grant admin role to the user
  GRANT admin TO authenticated;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage (run this in SQL Editor):
-- SELECT create_admin_user('admin@aurastyle.ai', 'securepassword123', 'Admin User');