// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Provide fallback values to ensure the build process works
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqamddepfymdtfyphran.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYW1kZGVwZnltZHRmeXBocmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDMyMDMsImV4cCI6MjA2ODU3OTIwM30.Ax3ZrrkL_qorpjy4KXgHAH76WK-NNw9-EehKO39cd0Y';

// Create the Supabase client with error handling
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock client for build process
  supabaseClient = {
    auth: { signIn: () => {}, signOut: () => {}, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    from: () => ({ select: () => ({ data: null, error: null }) }),
  };
}

export const supabase = supabaseClient;

// Service role client for server-side operations
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYW1kZGVwZnltZHRmeXBocmFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAwMzIwMywiZXhwIjoyMDY4NTc5MjAzfQ.Yx_PVqjPxNsL3nq3m0bDQrQwV3yke4xhQgYyYQNSGt4';
  try {
    return createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Failed to initialize Supabase service client:', error);
    // Return a mock client for build process
    return {
      from: () => ({ select: () => ({ data: null, error: null }) }),
    };
  }
};