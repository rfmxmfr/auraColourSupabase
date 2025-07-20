// create-admin-user.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

// Create admin user
async function createAdminUser() {
  try {
    // Replace with your desired admin user email and password
    const email = 'admin@aurastyle.ai';
    const password = 'Admin123!';
    
    // Create the user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://example.com/welcome'
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!data || !data.user) {
      throw new Error('User creation failed - no user data returned');
    }
    
    // Add admin role to the user in Supabase
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: email,
        role: 'admin',
        status: 'active',
        profile_data: { isSetupComplete: true }
      });
    
    if (profileError) {
      throw profileError;
    }
    
    console.log('Admin user created successfully:', data.user.id);
    console.log('Email:', email);
    console.log('Password:', password);
    return data.user.id;
  } catch (error) {
    console.error('Error creating admin user:', error.message || error);
    return null;
  }
}

createAdminUser();