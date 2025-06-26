import { Suspense } from 'react';
import { LoginCard } from '@/components/admin/login-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function LoginSkeleton() {
    return (
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Use your Google account to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-10 w-full" />
        </CardContent>
        </Card>
    );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginCard />
      </Suspense>
    </div>
  );
}
