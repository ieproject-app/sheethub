import React, { useId } from 'react';

interface SnipGeekLogoProps extends React.SVGProps<SVGSVGElement> {
  showBackground?: boolean;
}

/**
 * SnipGeekLogo - Adaptive version
 * - Monochrome White: Used for Dark Backgrounds (Light Mode Header)
 * - Colorful Gradient: Used for Light Backgrounds (Dark Mode Header)
 */
export const SnipGeekLogo = ({ 
  className, 
  showBackground,
  ...props 
}: SnipGeekLogoProps) => {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Colorful Gradients for Light Background (Dark Mode) */}
        <linearGradient id={`blue-bright-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#0ea5e9"/>
        </linearGradient>
        <linearGradient id={`blue-deep-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#0c2461"/>
        </linearGradient>
      </defs>

      {/* Optional Background Pill */}
      {showBackground && (
        <rect x="0" y="0" width="100" height="100" rx="20" fill="currentColor" opacity="0.10"/>
      )}

      {/* VERSION 1: DARK MODE (Colorful Gradient) - Visible when .dark class is active */}
      <g className="hidden dark:block">
        <polygon points="5,5 46,5 46,37 37,46 5,46" fill={`url(#blue-bright-${id})`}/>
        <polygon points="63,54 95,54 95,95 54,95 54,63" fill={`url(#blue-bright-${id})`}/>
        <rect x="54" y="5" width="41" height="41" rx="4" fill={`url(#blue-deep-${id})`}/>
        <rect x="5" y="54" width="41" height="41" rx="4" fill={`url(#blue-deep-${id})`}/>
        <circle cx="50" cy="50" r="2" fill="#bae6fd" opacity="0.9"/>
      </g>

      {/* VERSION 2: LIGHT MODE (Monochrome White) - Visible by default (Light Mode Header is dark) */}
      <g className="block dark:hidden">
        <polygon points="5,5 46,5 46,37 37,46 5,46" fill="white"/>
        <polygon points="63,54 95,54 95,95 54,95 54,63" fill="white"/>
        <rect x="54" y="5" width="41" height="41" rx="4" fill="white" opacity="0.3"/>
        <rect x="5" y="54" width="41" height="41" rx="4" fill="white" opacity="0.3"/>
        <circle cx="50" cy="50" r="2" fill="white" opacity="0.6"/>
      </g>
    </svg>
  );
};

SnipGeekLogo.displayName = "SnipGeekLogo";
