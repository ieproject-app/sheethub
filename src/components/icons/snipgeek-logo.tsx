import React from 'react';

/**
 * SnipGeekLogo - Komponen logo SVG dengan struktur Solid.
 * Menggunakan fill="white" untuk teks agar terbaca jelas sebagai favicon
 * dan fill="currentColor" untuk background agar fleksibel mengikuti tema.
 */
export const SnipGeekLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Background kotak dengan sudut membulat */}
    <rect
      width="100"
      height="100"
      rx="22"
      ry="22"
      fill="currentColor"
    />
    
    {/* Teks Solid Putih - Memastikan keterbacaan tinggi di favicon & header */}
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fill="white"
      style={{
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        fontWeight: 900,
        fontSize: '52px',
      }}
    >
      SG
    </text>
  </svg>
);

SnipGeekLogo.displayName = "SnipGeekLogo";
