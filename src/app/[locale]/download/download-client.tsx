'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, LoaderCircle, AlertTriangle } from 'lucide-react';
import type { Dictionary } from '@/lib/get-dictionary';
import Link from 'next/link';

export function DownloadClient({ dictionary }: { dictionary: Dictionary['downloadGate'] }) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('url');
  const [countdown, setCountdown] = useState(5);
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null); // Use null for initial "undetermined" state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect handles the validation logic.
    // It runs whenever the redirectUrl changes, but only after the client has mounted.
    if (!isClient) return;

    if (redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://'))) {
      setIsValidUrl(true);
    } else {
      setIsValidUrl(false);
    }
  }, [redirectUrl, isClient]);

  useEffect(() => {
    // This effect handles the countdown and redirect.
    if (isClient && isValidUrl === true && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isClient && isValidUrl === true && countdown === 0 && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [countdown, isValidUrl, redirectUrl, isClient]);

  // To avoid hydration errors and show a loading state until validation is complete.
  if (!isClient || isValidUrl === null) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>{dictionary.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  if (isValidUrl === false) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                        <AlertTriangle />
                        {dictionary.invalidUrl.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{dictionary.invalidUrl.description}</p>
                     <Button asChild variant="outline" className="mt-4">
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <main className="max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>{dictionary.title}</CardTitle>
                    <CardDescription>{dictionary.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-muted/50 rounded-lg text-sm truncate text-muted-foreground break-all">
                        {redirectUrl}
                    </div>
                    {countdown > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <p>{dictionary.redirectingIn.replace('{countdown}', countdown.toString())}</p>
                        </div>
                    ) : (
                        <p className="text-primary font-semibold">{dictionary.redirectingNow}</p>
                    )}
                    <Button asChild size="lg" className="w-full">
                        <a href={redirectUrl!}>
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {dictionary.continueButton}
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
