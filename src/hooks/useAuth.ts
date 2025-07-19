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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setUser({ ...session.user, role: profile?.role });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          setUser({ ...session.user, role: profile?.role });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}