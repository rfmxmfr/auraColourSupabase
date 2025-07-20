'use server';
import { supabase } from '@/lib/supabase';

export interface FeedbackData {
  rating: number;
  comment: string;
  page: string;
}

export async function saveFeedback(feedback: FeedbackData): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        ...feedback,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
      
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error adding feedback document: ", error);
    throw new Error("Failed to save feedback.");
  }
}
