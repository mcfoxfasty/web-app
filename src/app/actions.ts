'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { pexelsAPI } from '@/lib/pexels';
import { newsAPI } from '@/lib/newsapi';
import { AFFILIATE_LINKS } from '@/lib/config';
import { createSlug } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { generateArticle } from '@/ai/flows/generate-article';
import type { Article } from '@/types';

export async function generateArticleAction(category: string) {
  try {
    const newsArticles = await newsAPI.getTopHeadlines(category, 1);
    if (!newsArticles.length) {
      throw new Error('No news articles found for this category.');
    }
    const newsArticle = newsArticles[0];

    if (!newsArticle.title || !newsArticle.description) {
      throw new Error('Fetched news article is missing title or description.');
    }

    const affiliateLink = AFFILIATE_LINKS[category as keyof typeof AFFILIATE_LINKS];
    const generatedContent = await generateArticle({
      title: newsArticle.title,
      description: newsArticle.description,
      category,
      affiliateLink,
    });

    const images = await pexelsAPI.searchImages(`${category} ${newsArticle.title.split(' ')[0]}`, 1);
    const coverImage = images[0]?.src?.large || `https://via.placeholder.com/800x600.png?text=News+Image`;

    const articleData = {
      title: generatedContent.seoTitle,
      slug: createSlug(generatedContent.seoTitle),
      category,
      content: generatedContent.content,
      metaDescription: generatedContent.metaDescription,
      coverImage,
      author: 'AI News' as const,
      affiliateLink,
      published: false, // Default to unpublished
    };

    const savedArticle = await storage.saveArticle(articleData);

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath(`/category/${category}`);
    
    return { success: true, article: savedArticle };
  } catch (error) {
    console.error('Error in generateArticleAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
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
        await storage.updateArticle(id, articleData);
        revalidatePath('/admin');
        revalidatePath(`/article/${articleData.slug}`);
        revalidatePath(`/category/${articleData.category}`);
    } catch (error) {
        console.error('Failed to update article:', error);
        return { success: false, error: 'Could not update the article.' };
    }

    redirect('/admin');
}
