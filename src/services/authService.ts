'use server';

import { supabase, getServiceSupabase } from '@/lib/supabase';

interface UserProfile {
    id: string;
    email: string | null;
    role: 'admin' | 'customer';
    firebase_uid?: string; // For migration purposes
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