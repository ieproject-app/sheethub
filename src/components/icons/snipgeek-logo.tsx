
import React, { useId } from 'react';

interface SnipGeekLogoProps extends React.SVGProps<SVGSVGElement> {
  showBackground?: boolean;
}

/**
 * SnipGeekLogo - Adaptive and Modernized for Header
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
        {/* Colorful Gradients */}
        <linearGradient id={`blue-bright-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#0ea5e9"/>
        </linearGradient>
        <linearGradient id={`blue-deep-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#0c2461"/>
        </linearGradient>
      </defs>

      {/* Modern Geometry Branding */}
      <g>
        <polygon points="5,5 46,5 46,37 37,46 5,46" fill={`url(#blue-bright-${id})`}/>
        <polygon points="63,54 95,54 95,95 54,95 54,63" fill={`url(#blue-bright-${id})`}/>
        <rect x="54" y="5" width="41" height="41" rx="4" fill={`url(#blue-deep-${id})`}/>
        <rect x="5" y="54" width="41" height="41" rx="4" fill={`url(#blue-deep-${id})`}/>
        <circle cx="50" cy="50" r="3" fill="#bae6fd" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
};

SnipGeekLogo.displayName = "SnipGeekLogo";
