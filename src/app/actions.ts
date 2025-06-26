'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSlug } from '@/lib/utils';
import { storage } from '@/lib/storage';

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
