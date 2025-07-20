// update-user-role.js
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

// Update user role to admin
async function updateUserRole() {
  try {
    // Replace with the email of the user you want to update
    const userEmail = process.argv[2];
    
    if (!userEmail) {
      console.error('Please provide a user email as an argument');
      console.error('Usage: node update-user-role.js user@example.com');
      process.exit(1);
    }
    
    // First, get the user ID from the auth.users table
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw userError;
    }
    
    const user = userData.users.find(u => u.email === userEmail);
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }
    
    // Update the user's role in the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', user.id);
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`User ${userEmail} (ID: ${user.id}) has been updated to admin role`);
  } catch (error) {
    console.error('Error updating user role:', error.message || error);
  }
}

updateUserRole();