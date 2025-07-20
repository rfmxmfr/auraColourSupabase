// src/services/submissionService.ts
'use server';
import { supabase, getServiceSupabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export type SubmissionStatus = 'draft' | 'pending_payment' | 'paid' | 'in_progress' | 'completed';

export interface Submission {
  id: string;
  user_id: string;
  status: SubmissionStatus;
  questionnaire_data: string;
  image_url: string;
  stripe_session_id?: string;
  created_at: Date;
  updated_at: Date;
}

// Client-side version of the Submission interface
export interface ClientSubmission {
  id: string;
  userId: string;
  status: SubmissionStatus;
  questionnaireResponses: string;
  photoDataUri: string;
  createdAt: Date;
  lastModified: Date;
}

// Map server submission to client submission
export function mapServerToClientSubmission(serverSubmission: Submission): ClientSubmission {
  return {
    id: serverSubmission.id,
    userId: serverSubmission.user_id,
    status: serverSubmission.status,
    questionnaireResponses: typeof serverSubmission.questionnaire_data === 'string' 
      ? serverSubmission.questionnaire_data 
      : JSON.stringify(serverSubmission.questionnaire_data),
    photoDataUri: serverSubmission.image_url,
    createdAt: new Date(serverSubmission.created_at),
    lastModified: new Date(serverSubmission.updated_at)
  };
}

export async function createDraftSubmission(userId: string, email?: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: userId,
        status: 'pending',
        questionnaire_data: {},
        image_url: '',
        created_by: userId,
        updated_by: userId,
        metadata: { 
          source: 'web_app',
          email: email || null,
          is_anonymous: userId === 'anonymous'
        },
        priority: 'standard'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error creating draft submission: ", error);
    throw new Error("Failed to start submission.");
  }
}

export async function findActiveDraftSubmission(userId: string): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw error;
    }

    return data as Submission | null;
  } catch (error) {
    console.error("Error finding active draft submission: ", error);
    throw new Error("Failed to look for existing drafts.");
  }
}

export async function updateDraftSubmission(submissionId: string, data: Partial<Omit<Submission, 'id' | 'user_id' | 'created_at'>>) {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating draft submission: ", error);
    throw new Error("Failed to save progress.");
  }
}

export async function finalizeSubmissionForPayment(submissionId: string, questionnaireData: string, imageUrl: string, email?: string): Promise<void> {
  try {
    // Get the current user
    const cookieStore = cookies();
    const supabaseClient = createServerActionClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('submissions')
      .update({
        questionnaire_data: JSON.parse(questionnaireData),
        image_url: imageUrl,
        status: 'in_review',
        updated_at: new Date().toISOString(),
        updated_by: user.id,
        metadata: { 
          ...JSON.parse(questionnaireData),
          submission_completed: true,
          payment_status: 'completed'
        }
      })
      .eq('id', submissionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error finalizing submission: ", error);
    throw new Error("Failed to finalize submission for payment.");
  }
}

export async function getSubmissions(statuses: SubmissionStatus[]): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .in('status', statuses)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Submission[];
  } catch (error) {
    console.error("Error getting submissions: ", error);
    throw new Error("Failed to get submissions.");
  }
}

export async function getSubmission(id: string): Promise<Submission | null> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Submission;
  } catch (error) {
    console.error("Error getting submission: ", error);
    throw new Error("Failed to get submission.");
  }
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating status: ", error);
    throw new Error("Failed to update submission status.");
  }
}

export async function addStripeSessionId(submissionId: string, stripeSessionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ 
        stripe_session_id: stripeSessionId, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', submissionId);

    if (error) throw error;
  } catch (error) {
    console.error("Error adding Stripe session ID: ", error);
    throw new Error("Failed to link Stripe session to submission.");
  }
}

export async function saveSubmission(questionnaireData: string, imageUrl: string): Promise<string> {
  try {
    // Get the current user
    const cookieStore = cookies();
    const supabaseClient = createServerActionClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Create a new submission
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        status: 'approved', // Assuming this is a direct submission without review
        questionnaire_data: JSON.parse(questionnaireData),
        image_url: imageUrl,
        created_by: user.id,
        updated_by: user.id,
        metadata: { 
          source: 'direct_submission',
          payment_status: 'completed'
        },
        priority: 'standard'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error("Error saving submission: ", error);
    throw new Error("Failed to save submission.");
  }
}

// Get submissions for a specific user
export async function getUserSubmissions(userId: string): Promise<ClientSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map server submissions to client submissions
    return (data as Submission[]).map(mapServerToClientSubmission);
  } catch (error) {
    console.error("Error getting user submissions: ", error);
    throw new Error("Failed to get user submissions.");
  }
}

// Get a specific submission by ID
export async function getSubmissionById(id: string): Promise<ClientSubmission> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return mapServerToClientSubmission(data as Submission);
  } catch (error) {
    console.error("Error getting submission by ID: ", error);
    throw new Error("Failed to get submission details.");
  }
}