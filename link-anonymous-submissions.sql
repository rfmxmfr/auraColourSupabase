-- Function to link anonymous submissions to a user account
CREATE OR REPLACE FUNCTION link_anonymous_submission_to_user(
  p_submission_id TEXT,
  p_user_id UUID,
  p_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_success BOOLEAN := FALSE;
BEGIN
  -- Update the submission to link it to the user
  UPDATE public.submissions
  SET 
    user_id = p_user_id,
    updated_at = NOW(),
    updated_by = p_user_id,
    metadata = jsonb_set(
      jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{linked_to_account}',
        'true'
      ),
      '{original_status}',
      to_jsonb(status)
    )
  WHERE 
    id = p_submission_id 
    AND (user_id = 'anonymous' OR metadata->>'email' = p_email);

  -- Check if the update was successful
  GET DIAGNOSTICS v_success = ROW_COUNT;
  
  RETURN v_success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically link submissions when a user is created
CREATE OR REPLACE FUNCTION link_submissions_on_user_create()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_submission_id TEXT;
BEGIN
  -- Get the email from the new user
  v_email := NEW.email;
  
  -- Check if there's a submission_id in the user metadata
  v_submission_id := NEW.raw_user_meta_data->>'submission_id';
  
  -- If there's a specific submission ID, link it
  IF v_submission_id IS NOT NULL THEN
    PERFORM link_anonymous_submission_to_user(v_submission_id, NEW.id, v_email);
  ELSE
    -- Otherwise, try to find and link any anonymous submissions with this email
    UPDATE public.submissions
    SET 
      user_id = NEW.id,
      updated_at = NOW(),
      updated_by = NEW.id,
      metadata = jsonb_set(
        jsonb_set(
          COALESCE(metadata, '{}'::jsonb),
          '{linked_to_account}',
          'true'
        ),
        '{original_status}',
        to_jsonb(status)
      )
    WHERE 
      user_id = 'anonymous' 
      AND metadata->>'email' = v_email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE TRIGGER link_submissions_after_user_create
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION link_submissions_on_user_create();

-- Grant permissions to admin role
GRANT EXECUTE ON FUNCTION link_anonymous_submission_to_user TO admin;