'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  href: string;
  children: React.ReactNode;
}

export function DownloadButton({ href, children }: DownloadButtonProps) {
  if (!href) {
    return null;
  }
  
  const downloadGateUrl = `/download?url=${encodeURIComponent(href)}`;

  return (
    <div className="my-6">
        <a 
          href={downloadGateUrl} 
          rel="noopener nofollow"
          className={cn(buttonVariants({ size: "lg" }))}
        >
            <Download className="mr-2 h-5 w-5" />
            {children}
        </a>
    </div>
  );
}
