
// src/ai/flows/style-report-generator.ts
'use server';

/**
 * @fileOverview Generates a personalized style report based on color analysis.
 *
 * - generateStyleReport - A function that generates the style report.
 * - StyleReportInput - The input type for the generateStyleReport function.
 * - StyleReportOutput - The return type for the generateStyleReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleReportInputSchema = z.object({
  colorAnalysisResult: z
    .string()
    .describe(
      'The result of the color analysis, including the identified color season.'
    ),
  stylePreferences: z
    .string()
    .describe('A description of the user\u0027s style preferences.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type StyleReportInput = z.infer<typeof StyleReportInputSchema>;

const StyleReportOutputSchema = z.object({
  report: z.string().describe('A summary of the personalized style report.'),
  recommendations: z.array(z.object({
    item: z.string().describe("The type of clothing item, e.g., 'T-Shirt', 'Jeans', 'Summer Dress'."),
    description: z.string().describe("A brief description of the recommended item and why it suits the user."),
    color: z.string().describe("The recommended color for the item."),
  })).describe("A list of specific clothing recommendations."),
});

export type StyleReportOutput = z.infer<typeof StyleReportOutputSchema>;

export async function generateStyleReport(input: StyleReportInput): Promise<StyleReportOutput> {
  return generateStyleReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleReportPrompt',
  input: {schema: StyleReportInputSchema},
  output: {schema: StyleReportOutputSchema},
  prompt: `You are a personal stylist who specializes in creating style reports and clothing recommendations based on color analysis.

You will use the color analysis result and style preferences to create a personalized style report.

Color Analysis Result: {{{colorAnalysisResult}}}
Style Preferences: {{{stylePreferences}}}
User Photo: {{media url=photoDataUri}}

First, write a comprehensive style report summary that includes:
- An overview of the user's color season and its characteristics.
- General recommendations for clothing colors that complement the user's complexion.
- Styling tips based on the user's style preferences and color season.

Second, provide a list of 5-7 specific clothing recommendations. For each item, specify the type of clothing, a brief description of why it works for the user, and a suitable color from their palette.
`,
});

const generateStyleReportFlow = ai.defineFlow(
  {
    name: 'generateStyleReportFlow',
    inputSchema: StyleReportInputSchema,
    outputSchema: StyleReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
