// src/ai/flows/color-analysis.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for color analysis.
 *
 * - analyzeColor - The main function to trigger the color analysis flow.
 * - ColorAnalysisInput - The input type for the analyzeColor function.
 * - ColorAnalysisOutput - The output type for the analyzeColor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColorAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  questionnaireResponses: z.string().describe('The user responses to the style questionnaire.'),
});
export type ColorAnalysisInput = z.infer<typeof ColorAnalysisInputSchema>;

const ColorAnalysisOutputSchema = z.object({
  colorPalette: z.string().describe("The user's determined 12-season color palette (e.g., 'True Winter', 'Soft Autumn')."),
  stylingTips: z.string().describe('A paragraph of personalized styling tips for the user based on their color season.'),
});
export type ColorAnalysisOutput = z.infer<typeof ColorAnalysisOutputSchema>;

export async function analyzeColor(input: ColorAnalysisInput): Promise<ColorAnalysisOutput> {
  return analyzeColorFlow(input);
}

const analyzeColorPrompt = ai.definePrompt({
  name: 'analyzeColorPrompt',
  input: {schema: ColorAnalysisInputSchema},
  output: {schema: ColorAnalysisOutputSchema},
  prompt: `You are a world-renowned personal stylist and an expert in the 12-season color analysis system. Your task is to analyze the provided user information to determine their seasonal color palette and offer actionable styling advice.

  **User Information:**
  - **Photo:** {{media url=photoDataUri}}
  - **Questionnaire Responses:** {{{questionnaireResponses}}}

  **Your Analysis Must Include:**

  1.  **Seasonal Color Palette Determination:**
      -   Analyze the user's skin undertones (cool, warm, neutral), eye color, and hair color from the photo.
      -   Correlate these features with the 12-season color system (e.g., True Winter, Soft Autumn, Light Spring, Cool Summer, etc.).
      -   The final value for 'colorPalette' should be ONLY the name of the season you determine (e.g., "Deep Winter").

  2.  **Personalized Styling Tips:**
      -   Based on the determined season, write a detailed paragraph for 'stylingTips'.
      -   This paragraph should explain WHY they are that season.
      -   Recommend specific color families they should embrace (e.g., "rich jewel tones like emerald and sapphire," "warm, earthy tones like mustard and terracotta").
      -   Suggest colors to avoid.
      -   Provide advice on metals for jewelry (e.g., gold, silver, rose gold).
      -   Offer brief tips on makeup tones for lipstick, blush, and eyeshadow that would be most flattering.

  Your response must be concise, encouraging, and professional.
  `,
});

const analyzeColorFlow = ai.defineFlow(
  {
    name: 'analyzeColorFlow',
    inputSchema: ColorAnalysisInputSchema,
    outputSchema: ColorAnalysisOutputSchema,
  },
  async input => {
    const {output} = await analyzeColorPrompt(input);
    return output!;
  }
);
