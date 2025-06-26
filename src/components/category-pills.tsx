import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { FEATURED_CATEGORIES } from '@/lib/config';

export function CategoryPills() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Featured:</span>
      {FEATURED_CATEGORIES.map((category) => (
        <Link key={category} href={`/category/${category}`}>
          <Badge
            variant="default"
            className="capitalize transition-colors hover:bg-primary/80"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
