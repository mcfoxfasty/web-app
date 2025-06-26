'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.2-1.89-6.06-4.44H2.35v2.84C4.26 21.12 7.85 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.94 14.05c-.18-.54-.28-1.1-.28-1.67s.1-1.13.28-1.67V7.87H2.35C1.65 9.25 1.25 10.8 1.25 12.42s.4 3.17 1.1 4.55l3.59-2.92z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.85 1 4.26 2.88 2.35 6.08l3.59 2.84c.86-2.55 3.26-4.44 6.06-4.44z"
        fill="#EA4335"
      />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );

const ADMIN_EMAIL = 'mcfoxfasty@gmail.com';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'This account is not authorized for admin access.',
        });
        setLoading(false);
        return;
      }
      
      const redirectUrl = searchParams.get('redirect') || '/admin';
      router.push(redirectUrl);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Use your Google account to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
