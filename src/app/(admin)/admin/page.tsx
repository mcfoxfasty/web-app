import { storage } from '@/lib/storage';
import { ArticleListClient } from '@/components/admin/article-list-client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const articles = await storage.getAllArticles(true); // Get all articles, including unpublished

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Content Management</AlertTitle>
        <AlertDescription>
          You can generate new articles from the "Generate Article" button in the main header. 
          Generated articles are saved as drafts and can be published from the edit screen below.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Article List</CardTitle>
          <CardDescription>
            Here you can view, edit, and publish all articles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleListClient articles={articles} />
        </CardContent>
      </Card>
    </div>
  );
}
