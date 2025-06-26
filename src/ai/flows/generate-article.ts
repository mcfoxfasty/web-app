'use server';

/**
 * @fileOverview Generates news articles based on a chosen category using AI, complete with SEO-optimized titles and meta descriptions.
 *
 * - generateArticle - A function that handles the article generation process.
 * - GenerateArticleInput - The input type for the generateArticle function.
 * - GenerateArticleOutput - The return type for the generateArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleInputSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  description: z.string().describe('A short description or summary of the news article.'),
  category: z.string().describe('The category of the news article (e.g., business, tech, sports).'),
  affiliateLink: z.string().describe('The affiliate link to be included in the article.'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GenerateArticleOutputSchema = z.object({
  seoTitle: z.string().describe('The SEO-optimized title of the article.'),
  metaDescription: z.string().describe('The meta description of the article.'),
  content: z.string().describe('The main content of the article in HTML format.'),
});
export type GenerateArticleOutput = z.infer<typeof GenerateArticleOutputSchema>;

export async function generateArticle(input: GenerateArticleInput): Promise<GenerateArticleOutput> {
  return generateArticleFlow(input);
}

const generateArticlePrompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  input: {schema: GenerateArticleInputSchema},
  output: {schema: GenerateArticleOutputSchema},
  prompt: `Write a 400-word news blog post in a clear, engaging, and neutral tone.

Headline: {{{title}}}
Summary: {{{description}}}
Category: {{{category}}}

Requirements:
1. Create a catchy SEO title (different from the headline, max 60 characters)
2. Write a compelling meta description (150 characters max)
3. Write the main article content in HTML format using <h2>, <p>, <strong>, and <em> tags
4. Include 3-4 paragraphs with proper structure:
   - Opening paragraph with key information
   - 2-3 body paragraphs expanding on details
   - Closing paragraph with conclusion or future outlook
5. Naturally incorporate a relevant product or service recommendation with this affiliate link: {{{affiliateLink}}}
6. Use engaging subheadings where appropriate
7. Make the content informative and reader-friendly
8. Ensure the content is original and not copied from the source

Format your response as JSON:
{
  "seoTitle": "SEO optimized title here",
  "metaDescription": "Brief compelling description here",
  "content": "Full HTML article content here"
}
`,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: GenerateArticleOutputSchema,
  },
  async input => {
    const {output} = await generateArticlePrompt(input);
    return output!;
  }
);
