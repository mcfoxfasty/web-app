import { SITE_CONFIG } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
