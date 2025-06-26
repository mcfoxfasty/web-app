'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import type { Article } from '@/types';
import { CATEGORIES } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ArticleGenerator() {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async (category: string) => {
    setLoadingCategory(category);
    try {
      const response = await axios.post<Article>('/api/generate-article', { category });
      toast({
        title: 'Article Generated!',
        description: `New article "${response.data.title}" has been created.`,
      });
      router.refresh(); // Refresh page to show new article
    } catch (error) {
      console.error('Failed to generate article:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a new article. Please try again.',
      });
    } finally {
      setLoadingCategory(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span>Article Generator</span>
        </CardTitle>
        <CardDescription>
          Select a category to generate a new AI-powered news article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => handleGenerate(category)}
              disabled={loadingCategory !== null}
              className="capitalize"
            >
              {loadingCategory === category ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {category}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
