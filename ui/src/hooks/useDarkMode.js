import { useEffect, useState } from 'react';

const KEY = 'wild-oasis-dark-mode';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(KEY, String(isDark));
  }, [isDark]);

  return { isDark, toggleDark: () => setIsDark((d) => !d) };
};
