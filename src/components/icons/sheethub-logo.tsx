import React, { useId } from 'react';

type SheetHubLogoProps = React.SVGProps<SVGSVGElement>;

/**
 * SheetHubLogo - Modern Minimalist Formula Equal & fx mark.
 */
export const SheetHubLogo = ({
  className,
  ...props
}: SheetHubLogoProps) => {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id={`sh-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Base Rounded Container */}
      <rect x="4" y="4" width="56" height="56" rx="14" fill={`url(#sh-grad-${id})`} />

      {/* Subtle Inner Inset Border */}
      <rect x="4" y="4" width="56" height="56" rx="14" fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeOpacity="0.35" />

      {/* Left: Formula Equal sign '=' */}
      <rect x="15" y="24" width="13" height="4" rx="2" fill="#ffffff" />
      <rect x="15" y="36" width="13" height="4" rx="2" fill="#ffffff" />

      {/* Right: Modern 'fx' Function Symbol */}
      {/* 'f' stem and crossbar */}
      <path d="M38 18c-3.5 0-5 2-5 5v23" fill="none" stroke="#dcfce7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 30h11" fill="none" stroke="#dcfce7" strokeWidth="4" strokeLinecap="round" />

      {/* 'x' crossing stroke */}
      <path d="M43 35l8 11" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
      <path d="M51 35l-8 11" fill="none" stroke="#a7f3d0" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};

SheetHubLogo.displayName = "SheetHubLogo";
