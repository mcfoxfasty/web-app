import { NextRequest, NextResponse } from 'next/server';
import { newsAPI } from '@/lib/newsapi';
import { pexelsAPI } from '@/lib/pexels';
import { AFFILIATE_LINKS, CATEGORIES } from '@/lib/config';
import { createSlug } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { generateArticle } from '@/ai/flows/generate-article';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const generatedArticles: { title: string; category: string }[] = [];
  const skippedCategories: { category: string; reason: string }[] = [];

  for (const category of CATEGORIES) {
    try {
      // 1. Fetch top headline from NewsAPI
      const newsArticles = await newsAPI.getTopHeadlines(category, 1);
      if (!newsArticles.length || !newsArticles[0].title) {
        console.warn(`No headline found for category: ${category}`);
        skippedCategories.push({ category, reason: 'No headline found' });
        continue;
      }
      const headline = newsArticles[0];

      // 2. Prevent duplicates by checking the original headline
      const isDuplicate = await storage.isDuplicateHeadline(headline.title);
      if (isDuplicate) {
        console.log(`Skipping duplicate headline for ${category}: "${headline.title}"`);
        skippedCategories.push({ category, reason: 'Duplicate headline' });
        continue;
      }
      
      // 3. Generate AI Content
      const affiliateLink = AFFILIATE_LINKS[category as keyof typeof AFFILIATE_LINKS];
      const generatedContent = await generateArticle({
        title: headline.title,
        description: headline.description || 'A news story.',
        category,
        affiliateLink,
      });
      
      // 4. Fetch Cover Image from Pexels
      const images = await pexelsAPI.searchImages(`${category} news`, 1);
      const coverImage = images[0]?.src?.large || `https://placehold.co/800x600.png`;
      
      // 5. Save to Firestore
      const articleData = {
        title: generatedContent.seoTitle,
        slug: createSlug(generatedContent.seoTitle),
        sourceHeadline: headline.title,
        category,
        content: generatedContent.content,
        metaDescription: generatedContent.metaDescription,
        coverImage,
        author: 'NewsRadar Staff' as const,
        affiliateLink,
        published: true, // Published by default
      };

      const savedArticle = await storage.saveArticle(articleData);
      generatedArticles.push({ title: savedArticle.title, category: savedArticle.category });

    } catch (error) {
        console.error(`Failed to process category ${category}:`, error);
        skippedCategories.push({ category, reason: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return NextResponse.json({
    message: 'Cron job finished.',
    generatedCount: generatedArticles.length,
    skippedCount: skippedCategories.length,
    generatedArticles,
    skippedCategories,
  });
}
