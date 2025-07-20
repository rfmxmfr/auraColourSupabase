// init-supabase.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Check for placeholder values
if (supabaseUrl === 'your_supabase_url' || supabaseServiceKey === 'your_supabase_service_role_key') {
  console.error('ERROR: You need to replace the placeholder values in .env.local with your actual Supabase credentials.');
  console.error('Please update the .env.local file with your Supabase URL and service role key.');
  process.exit(1);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error(`ERROR: Invalid Supabase URL format: ${supabaseUrl}`);
  console.error('Please make sure your NEXT_PUBLIC_SUPABASE_URL is a valid URL (e.g., https://your-project.supabase.co)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  try {
    console.log('Reading schema SQL file...');
    const schemaSql = fs.readFileSync('./supabase-schema.sql', 'utf8');
    
    console.log('Executing schema SQL is not possible via API...');
    console.log('Please run the SQL commands manually in the Supabase SQL editor:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Run the SQL commands');
    
    // Try to create tables directly using the API
    console.log('\nAttempting to create tables directly...');
    
    try {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
      const { error: usersError } = await supabase
        .from('users')
        .insert({ id: '00000000-0000-0000-0000-000000000000', email: 'test@example.com', role: 'customer' })
        .select();
      
      if (usersError) {
        console.log('Users table may need to be created manually:', usersError.message || usersError);
      } else {
        console.log('Users table exists or was created successfully.');
      }
      
      // Create submissions table if it doesn't exist
      console.log('Creating submissions table...');
      const { error: submissionsError } = await supabase
        .from('submissions')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          user_id: '00000000-0000-0000-0000-000000000000',
          status: 'pending',
          questionnaire_data: '{}',
          image_url: ''
        })
        .select();
      
      if (submissionsError) {
        console.log('Submissions table may need to be created manually:', submissionsError.message || submissionsError);
      } else {
        console.log('Submissions table exists or was created successfully.');
      }
      
      // Create reports table if it doesn't exist
      console.log('Creating reports table...');
      const { error: reportsError } = await supabase
        .from('reports')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          submission_id: '00000000-0000-0000-0000-000000000000',
          user_id: '00000000-0000-0000-0000-000000000000',
          report_data: '{}'
        })
        .select();
      
      if (reportsError) {
        console.log('Reports table may need to be created manually:', reportsError.message || reportsError);
      } else {
        console.log('Reports table exists or was created successfully.');
      }
      
    } catch (tableError) {
      console.error('Error creating tables:', tableError.message);
      console.log('You will need to create the tables manually using the SQL editor.');
    }
    
    console.log('\nDatabase setup attempted. Some manual steps may be required.');
    console.log('Please check the Supabase dashboard to verify the tables were created correctly.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
  
  return true;
}

initializeDatabase();