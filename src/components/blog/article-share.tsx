"use client";

import { usePathname } from "next/navigation";
import {
  Facebook,
  Linkedin,
  Send,
  MessageCircle,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { XLogo } from "@/components/icons/x-logo";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ArticleShareProps {
  title: string;
}

const productionUrl = "https://sheethub.web.id";

export function ArticleShare({ title }: ArticleShareProps) {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(`${productionUrl}${pathname}`);
  }, [pathname]);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentUrl) return null;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareButtons = [
    {
      id: "twitter",
      label: "X",
      icon: XLogo,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      id: "telegram",
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 flex-wrap">
      {/* Social Share Icon Pills */}
      {shareButtons.map((btn) => (
        <a
          key={btn.id}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border transition-all"
          aria-label={`Share on ${btn.label}`}
          title={`Share on ${btn.label}`}
        >
          <btn.icon className="w-3.5 h-3.5" />
        </a>
      ))}

      {/* Copy Link Button with Text Indicator */}
      <button
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all",
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border/70 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border"
        )}
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5 opacity-70" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
