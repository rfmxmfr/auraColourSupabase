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

export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
    
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