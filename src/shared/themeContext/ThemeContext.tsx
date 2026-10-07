import { readStoredTheme, writeStoredTheme } from '../common/themeStorage';
import { themePalettes, type ThemeMode, type ThemePalette } from '../../styles/theme/theme';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeContextValue = {
  theme: ThemeMode;
  palette: ThemePalette;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeMode>(`light`);
  const palette = themePalettes[theme];

  useEffect(() => {
    setTheme(readStoredTheme() ?? `light`);
  }, []);

  useEffect(() => {
    if (typeof document === `undefined`) return;

    const root = document.documentElement;

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.style.setProperty(`--ink`, palette.ink);
    root.style.setProperty(`--page`, palette.page);
    document.querySelector(`meta[name='theme-color']`)?.setAttribute(`content`, palette.page);
  }, [theme, palette]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === `dark` ? `light` : `dark`;

    setTheme(nextTheme);
    writeStoredTheme(nextTheme);
  }, [theme]);

  const value = useMemo(() => ({ theme, palette, toggleTheme }), [theme, palette, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
