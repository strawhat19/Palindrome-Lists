import { themeStorageKey } from '../common/themeStorage';
import { themePalettes, type ThemeMode } from '../../styles/theme/theme';

export const applyDocumentTheme = (theme: ThemeMode) => {
  if (typeof document === `undefined`) return;

  const root = document.documentElement;
  const palette = themePalettes[theme];

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.setProperty(`--ink`, palette.ink);
  root.style.setProperty(`--page`, palette.page);
  document.querySelector(`meta[name='theme-color']`)?.setAttribute(`content`, palette.page);
};

export const themeBootstrapScript = `(() => {
  let theme = 'light';
  try {
    const storedTheme = window.localStorage?.getItem(${JSON.stringify(themeStorageKey)});
    if (storedTheme === 'light' || storedTheme === 'dark') theme = storedTheme;
  } catch {}
  const root = document.documentElement;
  const palette = ${JSON.stringify(themePalettes)}[theme];
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.style.setProperty('--ink', palette.ink);
  root.style.setProperty('--page', palette.page);
  document.querySelector("meta[name='theme-color']")?.setAttribute('content', palette.page);
})();`;
