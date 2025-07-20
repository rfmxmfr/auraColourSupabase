// make-admin.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeAdmin() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.error('Please provide email and password');
      console.error('Usage: node make-admin.js email@example.com password');
      process.exit(1);
    }
    
    // Sign in with the provided credentials
    console.log(`Signing in as ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      process.exit(1);
    }
    
    if (!data.user) {
      console.error('No user returned from sign in');
      process.exit(1);
    }
    
    console.log(`Signed in as ${data.user.email} (${data.user.id})`);
    
    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') { // Record not found
        // Create profile if it doesn't exist
        console.log('Creating user profile...');
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'admin',
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError.message);
          process.exit(1);
        }
        
        console.log('Created new profile with admin role');
      } else {
        console.error('Error checking profile:', profileError.message);
        process.exit(1);
      }
    } else {
      // Update existing profile to admin
      console.log('Updating existing profile to admin role...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', data.user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError.message);
        process.exit(1);
      }
      
      console.log('Updated profile to admin role');
    }
    
    console.log('Success! User is now an admin');
    
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

makeAdmin();