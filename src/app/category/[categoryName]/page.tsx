import { notFound } from 'next/navigation';
import { storage } from '@/lib/storage';
import { CATEGORIES } from '@/lib/config';
import { ArticleCard } from '@/components/article-card';
import type { Metadata } from 'next';

type Props = {
  params: { categoryName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.categoryName;
  if (!CATEGORIES.includes(category as any)) {
    return {};
  }
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${capitalizedCategory} News`,
    description: `Latest AI-generated news in the ${category} category.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = params.categoryName;

  if (!CATEGORIES.includes(category as any)) {
    notFound();
  }

  const articles = await storage.getArticlesByCategory(category);
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container py-8">
      <h1 className="font-headline text-4xl font-bold mb-6 capitalize">{capitalizedCategory}</h1>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No Articles in this Category Yet</h3>
          <p className="text-muted-foreground mt-2">
            Generate a new article for this category to see it appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    categoryName: category,
  }));
}
