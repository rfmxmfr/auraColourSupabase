-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Create an audit schema for tracking changes
CREATE SCHEMA IF NOT EXISTS audit;

-- Audit log function for tracking table changes
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Implement audit logging logic
  INSERT INTO audit.change_log (
    table_name, 
    operation, 
    user_id, 
    record_id, 
    old_data, 
    new_data
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    (SELECT auth.uid()),
    COALESCE(NEW.id, OLD.id),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit log table
DROP TABLE IF EXISTS audit.change_log CASCADE;
CREATE TABLE audit.change_log (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with enhanced security and tracking
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' 
    CHECK (role IN ('customer', 'admin', 'moderator')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'deleted')),
  firebase_uid TEXT UNIQUE, 
  last_login TIMESTAMP WITH TIME ZONE,
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional metadata for enhanced user management
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE
);

-- Create comprehensive indexes for users
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_last_login ON public.users(last_login);

-- Submissions table with enhanced tracking and validation
DROP TABLE IF EXISTS public.submissions CASCADE;
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  image_url TEXT,
  questionnaire_data JSONB,
  metadata JSONB,
  
  -- Enhanced tracking columns
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional constraints and metadata
  review_count INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'standard' 
    CHECK (priority IN ('low', 'standard', 'high', 'urgent'))
);

-- Indexes for submissions
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_priority ON public.submissions(priority);

-- Reports table with comprehensive design
DROP TABLE IF EXISTS public.reports CASCADE;
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL 
    CHECK (report_type IN ('initial', 'follow_up', 'final')),
  report_data JSONB,
  
  -- Enhanced tracking and validation
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_review', 'approved', 'rejected')),
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional metadata
  version INTEGER DEFAULT 1,
  is_final BOOLEAN DEFAULT FALSE
);

-- Indexes for reports
CREATE INDEX idx_reports_submission_id ON public.reports(submission_id);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_type ON public.reports(report_type);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Comprehensive RLS Policies for Users
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
CREATE POLICY "Users can manage own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Submissions Policies
DROP POLICY IF EXISTS "Users can manage own submissions" ON public.submissions;
CREATE POLICY "Users can manage own submissions" ON public.submissions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;
CREATE POLICY "Admins can manage all submissions" ON public.submissions
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'moderator')
  );

-- Reports Policies
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;
CREATE POLICY "Admins can manage all reports" ON public.reports
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'moderator')
  );

-- Trigger to add audit logging to tables
CREATE OR REPLACE FUNCTION public.add_audit_trigger(table_name TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('
    CREATE TRIGGER %I_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.%I
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
  ', table_name, table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new user creation with enhanced logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user with additional default values
  INSERT INTO public.users (
    id, 
    email, 
    role, 
    status, 
    firebase_uid
  ) VALUES (
    NEW.id, 
    NEW.email, 
    'customer', 
    'active', 
    NEW.raw_user_meta_data->>'firebase_uid'
  );
  
  -- Optional: Trigger any post-signup actions
  -- PERFORM public.send_welcome_email(NEW.email);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add audit triggers to tables
SELECT public.add_audit_trigger('users');
SELECT public.add_audit_trigger('submissions');
SELECT public.add_audit_trigger('reports');