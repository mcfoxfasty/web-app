import { storage } from '@/lib/storage';
import { ArticleGenerator } from '@/components/article-generator';
import { ArticleListClient } from '@/components/admin/article-list-client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const articles = await storage.getAllArticles(true); // Get all articles, including unpublished

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      
      <ArticleGenerator />

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Here you can view, edit, and delete all generated articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleListClient articles={articles} />
        </CardContent>
      </Card>
    </div>
  );
}
