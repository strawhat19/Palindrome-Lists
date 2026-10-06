import { useColorScheme } from 'react-native';
import { readStoredTheme, writeStoredTheme } from '../common/themeStorage';
import { themePalettes, type ThemeMode, type ThemePalette } from '../../styles/theme/theme';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';

export type ThemeContextValue = {
  theme: ThemeMode;
  palette: ThemePalette;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemTheme = useColorScheme() === `dark` ? `dark` : `light`;
  const [theme, setTheme] = useState<ThemeMode>(`light`);
  const initialized = useRef(false);
  const selectedTheme = useRef<ThemeMode | null>(null);
  const palette = themePalettes[theme];

  useEffect(() => {
    if (!initialized.current) {
      selectedTheme.current = readStoredTheme();
      initialized.current = true;
    }

    setTheme(selectedTheme.current ?? systemTheme);
  }, [systemTheme]);

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

    selectedTheme.current = nextTheme;
    setTheme(nextTheme);
    writeStoredTheme(nextTheme);
  }, [theme]);

  const value = useMemo(() => ({ theme, palette, toggleTheme }), [theme, palette, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
