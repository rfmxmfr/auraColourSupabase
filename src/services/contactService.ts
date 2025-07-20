'use server';
import { supabase } from '@/lib/supabase';

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export async function saveContactInquiry(formData: ContactFormData): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...formData,
        created_at: new Date().toISOString(),
        status: 'new', // to track if it's been read or actioned
      })
      .select('id')
      .single();
      
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error adding contact inquiry document: ", error);
    throw new Error("Failed to save contact inquiry.");
  }
}
