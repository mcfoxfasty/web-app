'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Link href="/admin" className="mr-6 flex items-center space-x-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            {SITE_CONFIG.name} Admin
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
           <Button asChild variant="outline">
              <Link href="/">Back to Site</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
