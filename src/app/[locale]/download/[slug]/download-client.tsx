'use client';

import { useEffect, useState } from 'react';
import type { DownloadInfo } from '@/lib/data-downloads';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dictionary } from '@/lib/get-dictionary';

const COUNTDOWN_SECONDS = 5;

interface DownloadClientProps {
  downloadInfo: DownloadInfo;
  dictionary: Dictionary['downloadGate'];
  siteName: string;
}

export function DownloadClient({ downloadInfo, dictionary, siteName }: DownloadClientProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (countdown > 1) {
            setCountdown(prev => prev - 1);
        } else {
            setIsRedirecting(true);
            window.location.href = downloadInfo.externalUrl;
        }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, downloadInfo.externalUrl]);

  const handleDownloadClick = () => {
    setIsRedirecting(true);
    window.location.href = downloadInfo.externalUrl;
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background px-4">
        <main className="max-w-lg w-full mx-auto">
            <Card className="text-center shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">
                        {dictionary.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-6">
                    <FileDown className="h-16 w-16 text-primary" strokeWidth={1.5}/>
                    
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {downloadInfo.fileName}
                        </h2>
                        {downloadInfo.fileSize && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {dictionary.fileSizeLabel} {downloadInfo.fileSize}
                            </p>
                        )}
                    </div>

                    <div className="w-full rounded-lg border bg-muted/50 p-4 text-left">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-foreground">{dictionary.disclaimerTitle}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {dictionary.description.replace('{siteName}', siteName)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full max-w-sm flex flex-col items-center gap-2">
                        <Button 
                            onClick={handleDownloadClick} 
                            disabled={isRedirecting}
                            size="lg"
                            className="w-full"
                        >
                            {isRedirecting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                dictionary.continueButton
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            {dictionary.redirecting.replace('{countdown}', countdown.toString())}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
