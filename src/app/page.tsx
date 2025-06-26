import { ArticleGenerator } from '@/components/article-generator';
import { ArticleCard } from '@/components/article-card';
import { CategoryPills } from '@/components/category-pills';
import { storage } from '@/lib/storage';
import type { Article } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles: Article[] = await storage.getAllArticles();

  return (
    <div className="container py-8">
      <div className="space-y-4 mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          News, <span className="text-primary">Reimagined by AI</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to NewsAI. Instantly generate unique, SEO-optimized articles from the latest headlines across various categories.
        </p>
      </div>

      <div className="mb-8">
        <ArticleGenerator />
      </div>
      
      <div className="mb-8">
        <CategoryPills />
      </div>

      <section>
        <h2 className="font-headline text-3xl font-bold mb-6">Latest Articles</h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Articles Yet</h3>
            <p className="text-muted-foreground mt-2">
              Generate your first article above to see it appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
