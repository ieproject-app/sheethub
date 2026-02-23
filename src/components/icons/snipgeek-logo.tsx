import React from 'react';

/**
 * SnipGeekLogo - Komponen logo grafis SnipGeek baru.
 * Desain: Kacamata "Geek" dengan aksen baling-baling yang menembus batas lingkaran.
 * @param showBackground - Jika true, merender latar belakang bulat padat (cocok untuk ikon mengambang).
 */
export const SnipGeekLogo = ({ 
  className, 
  showBackground = false, 
  ...props 
}: React.SVGProps<SVGSVGElement> & { showBackground?: boolean }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background opsional - Lingkaran Solid untuk efek Floating Badge */}
      {showBackground && (
        <circle
          cx="250"
          cy="270"
          r="245"
          fill="white"
          className="dark:fill-slate-950"
        />
      )}
      
      {/* Grup Grafis Utama */}
      <g 
        fill="none" 
        stroke={showBackground ? "#1a1a2e" : "currentColor"} 
        strokeWidth="14" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={showBackground ? "dark:stroke-white" : ""}
      >
        {/* Batas Lingkaran Luar */}
        <circle cx="250" cy="270" r="200" strokeWidth="12" />

        {/* Lensa Kacamata */}
        <circle cx="158" cy="318" r="62" strokeWidth="12" />
        <circle cx="342" cy="318" r="62" strokeWidth="12" />

        {/* Jembatan Hidung */}
        <path d="M 220 308 C 232 294 268 294 280 308" strokeWidth="12" />

        {/* Gagang (Lens top -> Pivot) */}
        <path d="M 158 256 C 162 224 200 190 228 174" strokeWidth="12" />
        <path d="M 342 256 C 338 224 300 190 272 174" strokeWidth="12" />

        {/* Pivot Tengah */}
        <circle cx="250" cy="168" r="9" strokeWidth="10" />

        {/* Baling-baling (Menembus keluar lingkaran) */}
        <path d="M 243 161 L 96 62" strokeWidth="14" />
        <path d="M 257 161 L 404 62" strokeWidth="14" />
      </g>
    </svg>
  );
};

SnipGeekLogo.displayName = "SnipGeekLogo";
