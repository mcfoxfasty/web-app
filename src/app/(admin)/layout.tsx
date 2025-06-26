'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // RootLayout already provides the header and main content structure
  return <div className="bg-muted/40">{children}</div>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The AuthProvider is now in the root layout, so we just need to require auth here.
  return (
      <RequireAuth>{children}</RequireAuth>
  );
}
