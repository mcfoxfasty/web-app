import { notFound } from 'next/navigation';
import { storage } from '@/lib/storage';
import { ArticleForm } from '@/components/admin/article-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await storage.getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
          <CardDescription>Make changes to the article details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm article={article} />
        </CardContent>
      </Card>
    </div>
  );
}
