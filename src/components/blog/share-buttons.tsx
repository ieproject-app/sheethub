'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, Share2 } from 'lucide-react';
import { XLogo } from '@/components/icons/x-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  title: string;
  dictionary: {
    share: string;
    shareOn: string;
  };
}

// TODO: Replace with your actual production domain
const productionUrl = 'https://snipgeek.com';

export function ShareButtons({ title, dictionary }: ShareButtonsProps) {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    setCurrentUrl(`${productionUrl}${pathname}`);
  }, [pathname]);

  if (!currentUrl) {
    return null; // Or a loading skeleton
  }

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          {dictionary.share}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
            <XLogo className="mr-2 h-4 w-4" />
            <span>{dictionary.shareOn} X</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="mr-2 h-4 w-4" />
            <span>{dictionary.shareOn} Facebook</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="mr-2 h-4 w-4" />
            <span>{dictionary.shareOn} LinkedIn</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
