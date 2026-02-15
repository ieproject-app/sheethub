'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const themeOptions = [
  { theme: 'light', icon: Sun },
  { theme: 'system', icon: Laptop },
  { theme: 'dark', icon: Moon },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // We need to use a state to avoid hydration mismatch, as theme is not available on the server
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    // Render a placeholder or nothing until the component is mounted
    return <div className="h-8 w-[108px] rounded-full bg-muted/50 animate-pulse" />;
  }
  
  const currentThemeIndex = themeOptions.findIndex((t) => t.theme === theme);

  return (
    <div className="relative flex items-center bg-muted rounded-full p-1 text-sm">
      <div
        className={cn(
          'absolute h-6 w-9 bg-background shadow-sm rounded-full transition-transform duration-300 ease-in-out'
        )}
        style={{ transform: `translateX(${currentThemeIndex * 100}%)` }}
      />
      {themeOptions.map((option) => (
        <button
          key={option.theme}
          onClick={() => setTheme(option.theme)}
          className={cn(
            'relative z-10 w-9 h-6 flex items-center justify-center rounded-full transition-colors',
            theme === option.theme
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Switch to ${option.theme} mode`}
        >
          <option.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
