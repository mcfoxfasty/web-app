import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-150px)] items-center justify-center">
        <Alert className="max-w-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Authentication Disabled</AlertTitle>
            <AlertDescription>
                User authentication and login have been disabled for this application.
                You can directly access the <Link href="/admin" className="font-bold text-primary hover:underline">Admin Dashboard</Link>.
            </AlertDescription>
        </Alert>
    </div>
  );
}
