import { NextRequest, NextResponse } from 'next/server';
import { newsAPI } from '@/lib/newsapi';
import { pexelsAPI } from '@/lib/pexels';
import { AFFILIATE_LINKS, CATEGORIES } from '@/lib/config';
import { createSlug } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { generateArticle } from '@/ai/flows/generate-article';
import type { Article } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json();
    
    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }
    
    // 1. Get a news headline
    const newsArticles = await newsAPI.getTopHeadlines(category, 1);
    if (!newsArticles.length) {
      return NextResponse.json({ error: 'No news articles found for this category.' }, { status: 502 });
    }
    const newsArticle = newsArticles[0];
    
    if (!newsArticle.title || !newsArticle.description) {
      return NextResponse.json({ error: 'Fetched news article is missing title or description.' }, { status: 502 });
    }
    
    // 2. Generate article content using Genkit AI flow
    const affiliateLink = AFFILIATE_LINKS[category as keyof typeof AFFILIATE_LINKS];
    const generatedContent = await generateArticle({
      title: newsArticle.title,
      description: newsArticle.description,
      category,
      affiliateLink,
    });
    
    // 3. Get a cover image from Pexels
    const images = await pexelsAPI.searchImages(`${category} ${newsArticle.title.split(' ')[0]}`, 1);
    const coverImage = images[0]?.src?.large || `https://placehold.co/800x600.png`;

    // 4. Create and save the article object
    const newArticle: Article = {
      id: new Date().getTime().toString(),
      title: generatedContent.seoTitle,
      slug: createSlug(generatedContent.seoTitle),
      category,
      content: generatedContent.content,
      metaDescription: generatedContent.metaDescription,
      coverImage,
      author: 'AI',
      affiliateLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    };
    
    const savedArticle = await storage.saveArticle(newArticle);
    
    return NextResponse.json(savedArticle, { status: 201 });
  } catch (error) {
    console.error('Error in generate-article endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate article', details: errorMessage }, 
      { status: 500 }
    );
  }
}
