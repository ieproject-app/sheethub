'use client';

import React, { useEffect, useState } from 'react';

/**
 * GooeyFooterBackground Component
 * Creates a subtle "boiling" liquid transition at the top edge of the footer.
 * Optimized to prevent layout jitter and provide a more integrated look.
 */
export function GooeyFooterBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate fewer particles for a more subtle, premium feel
    const particleCount = 25; 
    const p = [];
    for (let i = 0; i < particleCount; i++) {
      p.push({
        id: i,
        size: 1.5 + Math.random() * 3.5, // 1.5rem to 5rem
        uplift: 4 + Math.random() * 6, // Reduced uplift for subtler effect
        posX: Math.random() * 100,
        dur: 4 + Math.random() * 5, // Slower movement for "thicker" liquid feel
        delay: -(Math.random() * 10),
      });
    }
    setParticles(p);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-16 -translate-y-[95%] pointer-events-none overflow-visible z-0" style={{ contain: 'paint' }}>
      <style>{`
        @keyframes gooey-float-up {
          0% {
            top: 100%;
            transform: translate(-50%, -50%) scale(1);
          }
          70% {
            opacity: 1;
          }
          100% {
            top: calc(var(--uplift) * -1);
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
        }
        .gooey-liquid-container {
          filter: url('#footer-liquid-effect-v2');
          transform: translateZ(0); /* Trigger GPU acceleration */
        }
      `}</style>

      {/* The gooey container needs a small "base" ledge to pull particles from */}
      <div className="gooey-liquid-container relative w-full h-full">
        {/* A small invisible ledge at the bottom to help the gooey filter "join" with the footer edge */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-primary" />
        
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-primary will-change-transform"
            style={{
              left: `${p.posX}%`,
              width: `${p.size}rem`,
              height: `${p.size}rem`,
              '--uplift': `${p.uplift}rem`,
              animation: `gooey-float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            } as any}
          />
        ))}
      </div>

      {/* SVG Filter Definition */}
      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id="footer-liquid-effect-v2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" 
              result="gooey" 
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
