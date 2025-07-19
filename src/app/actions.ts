
'use server';

import { saveFeedback, FeedbackData } from '@/services/feedbackService';
import { saveContactInquiry, ContactFormData } from '@/services/contactService';

export async function submitFeedbackAction(feedback: FeedbackData) {
    try {
        await saveFeedback(feedback);
        return { success: true };
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: 'Failed to submit feedback.' };
    }
}

export async function submitContactFormAction(formData: ContactFormData) {
  try {
    await saveContactInquiry(formData);
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit your message. Please try again later.' };
  }
}
