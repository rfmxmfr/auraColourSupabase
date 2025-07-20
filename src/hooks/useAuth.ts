'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { getUserProfile } from '@/services/clientAuthService';

export interface UserWithRole extends User {
  role?: 'admin' | 'customer';
}

export function useAuth() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Session found for user:', session.user.id);
          try {
            const profile = await getUserProfile(session.user.id);
            console.log('User profile:', profile);
            
            if (profile) {
              setUser({ ...session.user, role: profile.role });
              console.log('User authenticated with role:', profile.role);
            } else {
              console.warn('User profile not found for authenticated user');
              setUser({ ...session.user, role: 'customer' }); // Default role
            }
          } catch (profileError) {
            console.error('Error getting user profile:', profileError);
            setUser({ ...session.user, role: 'customer' }); // Default role
          }
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        try {
          if (session?.user) {
            console.log('New session for user:', session.user.id);
            
            try {
              const profile = await getUserProfile(session.user.id);
              console.log('User profile from auth change:', profile);
              
              if (profile) {
                setUser({ ...session.user, role: profile.role });
                console.log('User authenticated with role:', profile.role);
              } else {
                console.warn('User profile not found for authenticated user');
                setUser({ ...session.user, role: 'customer' }); // Default role
              }
            } catch (profileError) {
              console.error('Error getting user profile:', profileError);
              setUser({ ...session.user, role: 'customer' }); // Default role
            }
          } else {
            console.log('No session in auth change event');
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Force refresh the auth state when the component mounts
  useEffect(() => {
    const refreshAuth = async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) console.error('Error refreshing session:', error);
      } catch (error) {
        console.error('Error refreshing auth:', error);
      }
    };
    
    refreshAuth();
  }, []);

  return { user, loading };
}