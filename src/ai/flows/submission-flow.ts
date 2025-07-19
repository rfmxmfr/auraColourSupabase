// src/ai/flows/submission-flow.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for handling questionnaire submissions.
 *
 * - submitQuestionnaire - The main function to trigger the submission flow.
 * - SubmissionInput - The input type for the submitQuestionnaire function.
 * - SubmissionOutput - The output type for the submitQuestionnaire function.
 */

import {ai} from '@/ai/genkit';
import { saveSubmission } from '@/services/submissionService';
import {z} from 'zod';

const SubmissionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  questionnaireResponses: z.string().describe('The user responses to the style questionnaire.'),
});
export type SubmissionInput = z.infer<typeof SubmissionInputSchema>;

const SubmissionOutputSchema = z.object({
  submissionId: z.string().describe('A unique identifier for the submission.'),
  message: z.string().describe('A confirmation message for the user.'),
});
export type SubmissionOutput = z.infer<typeof SubmissionOutputSchema>;

export async function submitQuestionnaire(input: SubmissionInput): Promise<SubmissionOutput> {
  return submissionFlow(input);
}

const submissionFlow = ai.defineFlow(
  {
    name: 'submissionFlow',
    inputSchema: SubmissionInputSchema,
    outputSchema: SubmissionOutputSchema,
  },
  async (input) => {
    // Save the submission to Firestore.
    const submissionId = await saveSubmission(input.questionnaireResponses, input.photoDataUri);
    
    // This is where you would trigger a notification for the admin/stylist.

    return {
        submissionId,
        message: 'Your submission has been received and is now in the queue for analysis.',
    };
  }
);
