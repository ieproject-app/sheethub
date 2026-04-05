
import React, { useId } from 'react';

type SheetHubLogoProps = React.SVGProps<SVGSVGElement>;

/**
 * SheetHubLogo - Spreadsheet-inspired mark aligned with favicon/app icons.
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
        <linearGradient id={`sheet-bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id={`sheet-cell-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#86efac" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
      </defs>

      <rect x="3" y="3" width="58" height="58" rx="14" fill={`url(#sheet-bg-${id})`} />
      <rect x="12" y="12" width="40" height="40" rx="7" fill="#14532d" fillOpacity="0.34" />

      <line x1="12" y1="25" x2="52" y2="25" stroke="#86efac" strokeOpacity="0.5" strokeWidth="1.2" />
      <line x1="12" y1="39" x2="52" y2="39" stroke="#86efac" strokeOpacity="0.5" strokeWidth="1.2" />
      <line x1="25" y1="12" x2="25" y2="52" stroke="#86efac" strokeOpacity="0.5" strokeWidth="1.2" />
      <line x1="39" y1="12" x2="39" y2="52" stroke="#86efac" strokeOpacity="0.5" strokeWidth="1.2" />

      <rect x="26" y="26" width="13" height="13" rx="3" fill={`url(#sheet-cell-${id})`} />
      <rect x="26" y="26" width="13" height="13" rx="3" fill="none" stroke="#dcfce7" strokeWidth="1.1" />

      <path d="M45 17h6v6" fill="none" stroke="#dcfce7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

SheetHubLogo.displayName = "SheetHubLogo";
