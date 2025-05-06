'use server';

/**
 * @fileOverview An AI agent for suggesting new vocabulary words based on a given category.
 *
 * - suggestNewWords - A function that suggests new words based on the category.
 * - SuggestNewWordsInput - The input type for the suggestNewWords function.
 * - SuggestNewWordsOutput - The output type for the suggestNewWords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNewWordsInputSchema = z.object({
  category: z
    .string()
    .describe('The category of words to suggest (e.g., Emotional, Professional, Intellectual).'),
  numberOfWords: z.number().default(5).describe('The number of words to generate'),
});
export type SuggestNewWordsInput = z.infer<typeof SuggestNewWordsInputSchema>;

const SuggestNewWordsOutputSchema = z.array(
  z.object({
    english: z.string().describe('The English word.'),
    arabic: z.string().describe('The Arabic translation of the word.'),
    definition: z.string().describe('The definition of the word.'),
    example: z.string().describe('An example sentence using the word.'),
  })
);
export type SuggestNewWordsOutput = z.infer<typeof SuggestNewWordsOutputSchema>;

export async function suggestNewWords(input: SuggestNewWordsInput): Promise<SuggestNewWordsOutput> {
  return suggestNewWordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNewWordsPrompt',
  input: {schema: SuggestNewWordsInputSchema},
  output: {schema: SuggestNewWordsOutputSchema},
  prompt: `You are a vocabulary expert.  Suggest {{numberOfWords}} new English words related to the category '{{{category}}}'. Provide the Arabic translation, definition, and an example sentence for each word.

Output should be a JSON array of objects with the following format:

[
  {
    "english": "English word",
    "arabic": "Arabic translation",
    "definition": "Definition of the word",
    "example": "Example sentence using the word"
  },
  ...
]
`,
});

const suggestNewWordsFlow = ai.defineFlow(
  {
    name: 'suggestNewWordsFlow',
    inputSchema: SuggestNewWordsInputSchema,
    outputSchema: SuggestNewWordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
