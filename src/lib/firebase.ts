// src/lib/firebase.ts - Compatibility layer for Supabase migration
// This file is kept for backward compatibility during migration
// It re-exports from supabase.ts to minimize code changes in other files

import { supabase, getServiceSupabase } from './supabase';

// Export supabase client as db for compatibility with old Firebase code
export const db = supabase;
export const auth = supabase.auth;
export const app = { name: 'supabase-app' };

// Export the service client for admin operations
export const serviceClient = getServiceSupabase();
