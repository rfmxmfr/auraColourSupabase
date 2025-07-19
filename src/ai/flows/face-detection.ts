// src/ai/flows/face-detection.ts
'use server';

/**
 * @fileOverview A Genkit flow to detect if a human face is present and if the image quality is sufficient for analysis.
 *
 * - detectFace - The main function to trigger the face detection flow.
 * - FaceDetectionInput - The input type for the detectFace function.
 * - FaceDetectionOutput - The output type for the detectFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaceDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FaceDetectionInput = z.infer<typeof FaceDetectionInputSchema>;

const FaceDetectionOutputSchema = z.object({
  faceDetected: z.boolean().describe('Whether or not a human face was detected in the photo.'),
  lightingQuality: z.enum(['poor', 'good']).describe("The lighting quality of the photo."),
  imageClarity: z.enum(['blurry', 'clear']).describe("The clarity of the photo."),
  reason: z.string().describe('A brief explanation for the detection result. For example, "A clear, front-facing human face was detected in good lighting." or "No face detected, the image is blurry and poorly lit."'),
});
export type FaceDetectionOutput = z.infer<typeof FaceDetectionOutputSchema>;

export async function detectFace(input: FaceDetectionInput): Promise<FaceDetectionOutput> {
  return detectFaceFlow(input);
}

const detectFacePrompt = ai.definePrompt({
  name: 'detectFacePrompt',
  input: {schema: FaceDetectionInputSchema},
  output: {schema: FaceDetectionOutputSchema},
  prompt: `You are an AI image validation service. Your task is to determine if the provided image contains a clear, front-facing human face suitable for color analysis. You must also assess the image quality.

  Analyze the following photo: {{media url=photoDataUri}}

  1.  **Face Detection**: Is there a clear, reasonably front-facing human face? Set 'faceDetected' to true or false.
  2.  **Lighting Quality**: Is the lighting on the face even and sufficient (good), or is it dark, backlit, or have harsh shadows (poor)? Set 'lightingQuality'.
  3.  **Image Clarity**: Is the face in focus and clear, or is it out of focus and blurry? Set 'imageClarity'.
  4.  **Reason**: Provide a brief, consolidated reason for your findings. For example: "A clear human face was detected in good, even lighting." or "The image is too blurry and the lighting is poor, making it unsuitable for analysis."

  Your response must be accurate and based only on the visual information.
  `,
});

const detectFaceFlow = ai.defineFlow(
  {
    name: 'detectFaceFlow',
    inputSchema: FaceDetectionInputSchema,
    outputSchema: FaceDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectFacePrompt(input);
    return output!;
  }
);
