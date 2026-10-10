import { Platform } from 'react-native';
import { applyDocumentTheme } from './themeInitialization';
import { readStoredTheme, writeStoredTheme } from '../common/themeStorage';
import { themePalettes, type ThemeMode, type ThemePalette } from '../../styles/theme/theme';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeContextValue = {
  theme: ThemeMode;
  isThemeReady: boolean;
  palette: ThemePalette;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<ThemeMode>(`light`);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const palette = themePalettes[theme];

  useEffect(() => {
    const storedTheme = readStoredTheme() ?? `light`;

    applyDocumentTheme(storedTheme);
    setTheme(storedTheme);
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;

    applyDocumentTheme(theme);
    if (typeof document === `undefined`) return;

    const root = document.documentElement;
    if (root.dataset.themeReady === `true`) return;

    // Settle initial colors with transitions disabled before revealing the app.
    root.getBoundingClientRect();
    root.dataset.themeReady = `true`;
  }, [theme, isThemeReady]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === `dark` ? `light` : `dark`;

    setTheme(nextTheme);
    writeStoredTheme(nextTheme);
  }, [theme]);

  const value = useMemo(() => ({ theme, palette, isThemeReady, toggleTheme }), [theme, palette, isThemeReady, toggleTheme]);

  return <ThemeContext.Provider value={value}>{isThemeReady || Platform.OS === `web` ? children : null}</ThemeContext.Provider>;
};
