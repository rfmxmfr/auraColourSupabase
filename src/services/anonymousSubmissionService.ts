// src/services/anonymousSubmissionService.ts
'use server';
import { supabase } from '@/lib/supabase';

export async function finalizeAnonymousSubmission(
  submissionId: string, 
  questionnaireData: string, 
  imageUrl: string, 
  email?: string
): Promise<void> {
  try {
    const parsedData = typeof questionnaireData === 'string' 
      ? JSON.parse(questionnaireData) 
      : questionnaireData;
    
    const { error } = await supabase
      .from('submissions')
      .update({
        questionnaire_data: parsedData,
        image_url: imageUrl,
        status: 'in_review',
        updated_at: new Date().toISOString(),
        updated_by: 'anonymous',
        metadata: { 
          ...parsedData,
          email: email || null,
          is_anonymous: true,
          submission_completed: true,
          payment_status: 'pending'
        }
      })
      .eq('id', submissionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error finalizing anonymous submission: ", error);
    throw new Error("Failed to finalize submission for payment.");
  }
}

export async function createAnonymousSubmission(email?: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: 'anonymous',
        status: 'draft',
        questionnaire_data: {},
        image_url: '',
        created_by: 'anonymous',
        updated_by: 'anonymous',
        metadata: { 
          source: 'web_app',
          email: email || null,
          is_anonymous: true
        },
        priority: 'standard'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error creating anonymous submission: ", error);
    throw new Error("Failed to start submission.");
  }
}