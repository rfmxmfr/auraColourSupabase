// check-connection.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with anon key for basic connection test
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Check for placeholder values
if (supabaseUrl === 'https://your-project-id.supabase.co' || 
    supabaseAnonKey === 'your-anon-key-from-supabase-dashboard') {
  console.error('ERROR: You need to replace the placeholder values in .env.local with your actual Supabase credentials.');
  console.error('Please update the .env.local file with your Supabase URL and API keys.');
  process.exit(1);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error(`ERROR: Invalid Supabase URL format: ${supabaseUrl}`);
  console.error('Please make sure your NEXT_PUBLIC_SUPABASE_URL is a valid URL (e.g., https://your-project-id.supabase.co)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    // Use a simple health check instead of querying a table
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Your Supabase credentials are valid.');
    
    return true;
  } catch (error) {
    if (error.message && error.message.includes('Failed to fetch')) {
      console.error('❌ Connection to Supabase failed!');
      console.error('Please check your Supabase URL and make sure your project is running.');
    } else {
      console.error('❌ Error connecting to Supabase:', error.message || error);
    }
    return false;
  }
}

checkConnection().then(success => {
  if (!success) {
    process.exit(1);
  }
});