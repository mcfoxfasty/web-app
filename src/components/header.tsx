"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { getAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CATEGORIES, SITE_CONFIG } from '@/lib/config';
import { cn } from '@/lib/utils';
import { Menu, Newspaper, User, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

function AuthAwareHeader() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const navLinks = CATEGORIES.map((category) => ({
    href: `/category/${category}`,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  const renderAuthButtons = () => {
    if (loading) {
      return <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />;
    }
    if (user) {
      return (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <Button asChild size="sm">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Admin Login
        </Link>
      </Button>
    );
  }

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
            {renderAuthButtons()}
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
                  {renderAuthButtons()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


export function Header() {
  return (
    <AuthAwareHeader />
  )
}
