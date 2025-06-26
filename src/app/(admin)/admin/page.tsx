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
        <AlertTitle>Automated Content Pipeline</AlertTitle>
        <AlertDescription>
          This system automatically generates and publishes new articles daily. 
          Use the content management table below to review, edit, or unpublish any generated content.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Here you can view, edit, and delete all articles. Articles are generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleListClient articles={articles} />
        </CardContent>
      </Card>
    </div>
  );
}
