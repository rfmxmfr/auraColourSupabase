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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create admin user
async function createAdminUser() {
  try {
    // Replace with your desired admin user email and password
    const email = 'admin@aurastyle.ai';
    const password = 'Admin123!';
    
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      throw authError;
    }
    
    // Add admin role to the user in Supabase
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: email,
        role: 'admin',
        created_at: new Date().toISOString()
      });
    
    if (profileError) {
      throw profileError;
    }
    
    console.log('Admin user created successfully:', authUser.user.id);
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
}

createAdminUser();