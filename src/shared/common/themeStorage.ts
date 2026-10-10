import type { ThemeMode } from '../../styles/theme/theme';

export const themeStorageKey = `palindrome-lists.theme.v1`;

export const readStoredTheme = (): ThemeMode | null => {
  if (typeof window === `undefined`) return null;

  try {
    const storedTheme = window.localStorage?.getItem(themeStorageKey);

    return storedTheme === `light` || storedTheme === `dark` ? storedTheme : null;
  } catch {
    return null;
  }
};

export const writeStoredTheme = (theme: ThemeMode): boolean => {
  if (typeof window === `undefined`) return false;

  try {
    if (!window.localStorage) return false;

    window.localStorage.setItem(themeStorageKey, theme);

    return true;
  } catch {
    return false;
  }
};
