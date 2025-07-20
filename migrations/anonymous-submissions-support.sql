-- Migration to update database schema to better support anonymous submissions

-- 1. Modify the submissions table to allow 'anonymous' as user_id
ALTER TABLE public.submissions ALTER COLUMN user_id TYPE TEXT;
COMMENT ON COLUMN public.submissions.user_id IS 'User ID (UUID for registered users, "anonymous" for anonymous users)';

-- 2. Add index on metadata->>'email' for faster lookups of anonymous submissions by email
CREATE INDEX IF NOT EXISTS idx_submissions_metadata_email ON public.submissions USING gin ((metadata -> 'email'));

-- 3. Add index on user_id for faster filtering of anonymous vs. registered user submissions
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions (user_id);

-- 4. Update RLS policies to handle anonymous submissions
CREATE OR REPLACE POLICY "Users can view their own submissions" 
ON public.submissions 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (user_id = 'anonymous' AND metadata->>'email' = auth.email())
);

CREATE OR REPLACE POLICY "Users can update their own submissions" 
ON public.submissions 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id = 'anonymous' AND metadata->>'email' = auth.email())
);

-- 5. Create a view for users to see their submissions (including anonymous ones linked by email)
CREATE OR REPLACE VIEW user_submissions AS
SELECT 
  s.id,
  s.created_at,
  s.status,
  s.updated_at,
  s.questionnaire_data,
  s.image_url,
  s.metadata
FROM 
  public.submissions s
WHERE 
  s.user_id = auth.uid() OR 
  (s.user_id = 'anonymous' AND s.metadata->>'email' = auth.email());

-- Grant permissions on the view
GRANT SELECT ON user_submissions TO authenticated;
GRANT SELECT ON user_submissions TO anon;