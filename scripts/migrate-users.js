// This script helps migrate users from Firebase to Supabase
// Run this script with Node.js after setting up both Firebase and Supabase

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateUsers() {
  try {
    // Load Firebase users from exported JSON file
    // You need to export users from Firebase Authentication first
    const firebaseUsers = JSON.parse(fs.readFileSync('./firebase-users.json', 'utf8'));
    
    console.log(`Found ${firebaseUsers.length} users to migrate`);
    
    for (const user of firebaseUsers) {
      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
        password: 'TEMPORARY_PASSWORD', // You should implement a password reset flow
        user_metadata: {
          firebase_uid: user.uid
        }
      });
      
      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        continue;
      }
      
      console.log(`Created Supabase auth user for ${user.email}`);
      
      // Create or update user profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: authUser.id,
          email: user.email,
          role: user.customClaims?.admin ? 'admin' : 'customer',
          firebase_uid: user.uid
        });
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError);
        continue;
      }
      
      console.log(`Created user profile for ${user.email}`);
    }
    
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateUsers();