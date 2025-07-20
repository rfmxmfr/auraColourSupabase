// check-tables.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Check users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('Error with users table:', usersError.message);
    } else {
      console.log('✅ Users table exists');
      console.log('Users columns:', Object.keys(usersData[0] || {}).join(', '));
    }
    
    // Check submissions table
    const { data: submissionsData, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .limit(1);
    
    if (submissionsError) {
      console.error('Error with submissions table:', submissionsError.message);
    } else {
      console.log('✅ Submissions table exists');
      console.log('Submissions columns:', Object.keys(submissionsData[0] || {}).join(', '));
    }
    
    // Check reports table
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .limit(1);
    
    if (reportsError) {
      console.error('Error with reports table:', reportsError.message);
    } else {
      console.log('✅ Reports table exists');
      console.log('Reports columns:', Object.keys(reportsData[0] || {}).join(', '));
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();