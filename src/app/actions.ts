'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSlug } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { newsAPI } from '@/lib/newsapi';
import { pexelsAPI } from '@/lib/pexels';
import { generateArticle } from '@/ai/flows/generate-article';
import { AFFILIATE_LINKS, CATEGORIES } from '@/lib/config';
import type { Article } from '@/types';

export async function generateArticleAction(category: string) {
  try {
    if (!category || !CATEGORIES.includes(category as any)) {
      return { success: false, error: 'A valid category is required.' };
    }
    
    // 1. Get a news headline
    const newsArticles = await newsAPI.getTopHeadlines(category, 1);
    if (!newsArticles.length) {
      return { success: false, error: 'No news articles found for this category.' };
    }
    const newsArticle = newsArticles[0];
    
    if (!newsArticle.title || !newsArticle.description) {
      return { success: false, error: 'Fetched news article is missing a title or description.' };
    }

    // 2. Prevent duplicates by checking the original headline
    const isDuplicate = await storage.isDuplicateHeadline(newsArticle.title);
    if (isDuplicate) {
      return { success: false, error: `An article with a similar headline already exists.` };
    }
    
    // 3. Generate article content using Genkit AI flow
    const affiliateLink = AFFILIATE_LINKS[category as keyof typeof AFFILIATE_LINKS];
    const generatedContent = await generateArticle({
      title: newsArticle.title,
      description: newsArticle.description,
      category,
      affiliateLink,
    });
    
    // 4. Get a cover image from Pexels
    const images = await pexelsAPI.searchImages(`${category} news`, 1);
    const coverImage = images[0]?.src?.large || `https://placehold.co/800x600.png`;

    // 5. Create and save the article object
    const articleData = {
      title: generatedContent.seoTitle,
      slug: createSlug(generatedContent.seoTitle),
      sourceHeadline: newsArticle.title,
      category,
      content: generatedContent.content,
      metaDescription: generatedContent.metaDescription,
      coverImage,
      author: 'NewsRadar Staff' as const,
      affiliateLink,
      published: false, // Save as draft for manual review
    };
    
    const savedArticle = await storage.saveArticle(articleData);
    
    revalidatePath('/admin');
    
    return { success: true, article: savedArticle };

  } catch (error) {
    console.error('Error in generateArticleAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: `Failed to generate article: ${errorMessage}` };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    await storage.deleteArticle(id);
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: false, error: 'Failed to delete article.' };
  }
  return { success: true };
}

export async function updateArticleAction(id: string, formData: FormData) {
    const articleData = {
        title: formData.get('title') as string,
        slug: createSlug(formData.get('title') as string),
        content: formData.get('content') as string,
        published: formData.get('published') === 'on',
        category: formData.get('category') as string,
        metaDescription: formData.get('metaDescription') as string,
    };

    try {
        const article = await storage.getArticleById(id);
        if (article) {
          await storage.updateArticle(id, articleData);
          revalidatePath('/admin');
          revalidatePath(`/article/${articleData.slug}`);
          revalidatePath(`/category/${articleData.category}`);
        } else {
           throw new Error('Article not found');
        }

    } catch (error) {
        console.error('Failed to update article:', error);
        return { success: false, error: 'Could not update the article.' };
    }

    redirect('/admin');
}
