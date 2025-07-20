'use client';

import { supabase } from '@/lib/supabase';

interface UserProfile {
    id: string;
    email: string | null;
    role: 'admin' | 'customer';
    firebase_uid?: string; // For migration purposes
}

export async function signUpWithEmail(email: string, password: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile in Supabase
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'customer'
        });

      if (profileError) throw profileError;
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: any; user?: any }> {
  try {
    console.log('Attempting to sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful, user:', data.user?.id);
    
    // Get user profile to check role
    if (data.user) {
      try {
        const profile = await getUserProfile(data.user.id);
        console.log('User profile:', profile);
        
        // Store session in localStorage for more reliable auth state
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at
        }));
        
        return { 
          success: true, 
          user: { ...data.user, role: profile?.role } 
        };
      } catch (profileError) {
        console.error('Error getting user profile:', profileError);
        return { 
          success: true, 
          user: data.user 
        };
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

export async function logout(): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log('Getting user profile for:', userId);
    
    // First try with the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user profile from users table:", error);
      
      // If no profile exists, create a default one
      if (error.code === 'PGRST116') { // Record not found
        console.log('Creating default profile for user:', userId);
        
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error getting user data:', authError);
          return null;
        }
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: userData.user?.email,
            role: 'customer', // Default role
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating default profile:', insertError);
          return null;
        }
        
        return {
          id: userId,
          email: userData.user?.email,
          role: 'customer'
        };
      }
      
      return null;
    }
    
    console.log('User profile found:', data);
    return data as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}