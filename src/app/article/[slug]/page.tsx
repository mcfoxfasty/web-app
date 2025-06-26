import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { storage } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { SITE_CONFIG } from '@/lib/config';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await storage.getArticleBySlug(params.slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `${SITE_CONFIG.url}/article/${article.slug}`,
      images: [
        {
          url: article.coverImage,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await storage.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="container max-w-4xl py-8">
      <header className="mb-8">
        <Link href={`/category/${article.category}`}>
          <Badge variant="secondary" className="mb-2 capitalize">
            {article.category}
          </Badge>
        </Link>
        <h1 className="font-headline text-4xl font-extrabold leading-tight tracking-tighter lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Published on {format(new Date(article.createdAt), 'MMMM d, yyyy')} by {article.author}
        </p>
      </header>

      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1000px"
          priority
          data-ai-hint={`${article.category} news`}
        />
      </div>

      <div
        className="prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-a:text-primary hover:prose-a:text-primary/80"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
