'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateArticleAction } from '@/app/(admin)/actions';

export function ArticleGenerator() {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = async (category: string) => {
    setLoadingCategory(category);
    startTransition(async () => {
      const result = await generateArticleAction(category);
      if (result.success) {
        toast({
          title: 'Article Generated!',
          description: `New article "${result.article?.title}" has been created as a draft.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
      setLoadingCategory(null);
    });
  };

  const isLoading = isPending || loadingCategory !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <span>Article Generator</span>
        </CardTitle>
        <CardDescription>
          Select a category to generate a new AI-powered news article. It will be saved as a draft.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => handleGenerate(category)}
              disabled={isLoading}
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
