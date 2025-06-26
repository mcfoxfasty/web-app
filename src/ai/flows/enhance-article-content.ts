// EnhanceArticleContent flow enhances existing article content for SEO and readability.
// It takes a title, content, and category as input and returns SEO-optimized title,
// meta description, and enhanced HTML content.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceArticleContentInputSchema = z.object({
  title: z.string().describe('The title of the article.'),
  content: z.string().describe('The main content of the article.'),
  category: z.string().describe('The category of the article.'),
});
export type EnhanceArticleContentInput = z.infer<typeof EnhanceArticleContentInputSchema>;

const EnhanceArticleContentOutputSchema = z.object({
  seoTitle: z.string().describe('SEO optimized title for the article.'),
  metaDescription: z.string().describe('A brief compelling description for the article.'),
  enhancedContent: z.string().describe('Enhanced HTML article content.'),
});
export type EnhanceArticleContentOutput = z.infer<typeof EnhanceArticleContentOutputSchema>;

export async function enhanceArticleContent(input: EnhanceArticleContentInput): Promise<EnhanceArticleContentOutput> {
  return enhanceArticleContentFlow(input);
}

const enhanceArticleContentPrompt = ai.definePrompt({
  name: 'enhanceArticleContentPrompt',
  input: {schema: EnhanceArticleContentInputSchema},
  output: {schema: EnhanceArticleContentOutputSchema},
  prompt: `Enhance this article for SEO and readability:\n\nTitle: {{{title}}}\nCategory: {{{category}}}\nContent: {{{content}}}\n\nRequirements:\n1. Create an SEO-optimized title (max 60 characters)\n2. Generate a compelling meta description (max 150 characters)\n3. Enhance the content with proper HTML formatting (<h2>, <p>, <strong>, <em>)\n4. Add engaging subheadings if needed\n5. Improve readability and flow\n6. Ensure the content is well-structured and engaging\n\nFormat as JSON:\n{\n  "seoTitle": "SEO title here",
  "metaDescription": "Meta description here",
  "enhancedContent": "Enhanced HTML content here"
}`,
});

const enhanceArticleContentFlow = ai.defineFlow(
  {
    name: 'enhanceArticleContentFlow',
    inputSchema: EnhanceArticleContentInputSchema,
    outputSchema: EnhanceArticleContentOutputSchema,
  },
  async input => {
    const {output} = await enhanceArticleContentPrompt(input);
    return output!;
  }
);
