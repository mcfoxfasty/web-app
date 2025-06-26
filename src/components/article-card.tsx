import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={`${article.category} news`}
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col p-4">
          <Badge variant="secondary" className="mb-2 w-fit capitalize">{article.category}</Badge>
          <h3 className="font-headline text-lg font-semibold leading-tight group-hover:text-primary">
            {article.title}
          </h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">
            {format(new Date(article.createdAt), 'MMM d, yyyy')}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
