-- Create admin role
CREATE ROLE admin;

-- Create admin dashboard view for submissions
CREATE OR REPLACE VIEW admin_dashboard_submissions AS
SELECT 
  s.id,
  s.created_at,
  s.status,
  s.updated_at,
  CASE 
    WHEN s.user_id = 'anonymous' THEN COALESCE(s.metadata->>'email', 'anonymous@user.com')
    ELSE u.email 
  END as user_email,
  CASE 
    WHEN s.user_id = 'anonymous' THEN 'Anonymous User'
    ELSE u.email 
  END as user_name,
  s.questionnaire_data,
  s.image_url,
  s.metadata
FROM 
  public.submissions s
LEFT JOIN 
  public.users u ON s.user_id = u.id AND s.user_id != 'anonymous'
ORDER BY 
  s.created_at DESC;

-- Create admin dashboard view for reports
CREATE OR REPLACE VIEW admin_dashboard_reports AS
SELECT 
  r.id,
  r.created_at,
  r.updated_at,
  s.id as submission_id,
  CASE 
    WHEN s.user_id = 'anonymous' THEN COALESCE(s.metadata->>'email', 'anonymous@user.com')
    ELSE u.email 
  END as user_email,
  CASE 
    WHEN s.user_id = 'anonymous' THEN 'Anonymous User'
    ELSE u.email 
  END as user_name,
  r.report_data->>'color_analysis' as color_analysis,
  r.report_data->>'style_report' as style_report,
  s.metadata as submission_metadata
FROM 
  public.reports r
JOIN 
  public.submissions s ON r.submission_id = s.id
LEFT JOIN 
  public.users u ON s.user_id = u.id AND s.user_id != 'anonymous'
ORDER BY 
  r.created_at DESC;

-- Grant permissions to admin role
GRANT SELECT ON admin_dashboard_submissions TO admin;
GRANT SELECT ON admin_dashboard_reports TO admin;
GRANT SELECT, INSERT, UPDATE ON public.submissions TO admin;
GRANT SELECT, INSERT, UPDATE ON public.reports TO admin;
GRANT SELECT ON public.users TO admin;

-- Create admin user function
-- This should be executed in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT)
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
    role
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    'authenticated'
  )
  RETURNING id INTO new_user_id;
  
  -- Insert into users table with admin role
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new_user_id, admin_email, 'admin', now(), now());
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage (run this in SQL Editor):
-- SELECT create_admin_user('admin@aurastyle.ai', 'securepassword123');