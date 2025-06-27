"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CATEGORIES, SITE_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateArticleAction } from '@/app/actions';

import { Menu, Newspaper, Shield, Wand2, Loader2 } from 'lucide-react';


function ArticleGeneratorDropdown() {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = async (category: string) => {
    setLoadingCategory(category);
    startTransition(async () => {
      const result = await generateArticleAction(category);
      if (result.success) {
        toast({
          title: 'Article Generated!',
          description: `New article "${result.article?.title}" has been created as a draft.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      }
      setLoadingCategory(null);
    });
  };
  
  const isLoading = isPending || loadingCategory !== null;

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Article
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select a Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CATEGORIES.map((category) => (
            <DropdownMenuItem key={category} onClick={() => handleGenerate(category)} disabled={isLoading} className="capitalize cursor-pointer">
                {loadingCategory === category ? 
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                    <Wand2 className="mr-2 h-4 w-4" />
                }
                <span>Generate {category}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}


export function Header() {
  const pathname = usePathname();

  const navLinks = CATEGORIES.map((category) => ({
    href: `/category/${category}`,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const renderButtons = () => (
      <div className="flex items-center gap-2">
        <ArticleGeneratorDropdown />
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Link>
        </Button>
      </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
           <div className="hidden sm:flex items-center gap-2">
            {renderButtons()}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                The main navigation menu for the site.
              </SheetDescription>
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Newspaper className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline sm:inline-block">
                  {SITE_CONFIG.name}
                </span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                 <div className="sm:hidden flex flex-col pt-4 border-t space-y-2">
                  {renderButtons()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
