import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import useLandingMotion from '../LandingPage/useLandingMotion.web';
import { useTheme } from '../../shared/themeContext/useTheme';
import type { MetadataPage } from '../../shared/landing/metadata';

const useContentPage = (page: MetadataPage) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, palette } = useTheme();

  const themeStyle = {
    colorScheme: theme,
    '--ink': palette.ink,
    '--page': palette.page,
    '--card': palette.card,
    '--soft': palette.soft,
    '--leaf': palette.leaf,
    '--line': palette.line,
    '--lime': palette.lime,
    '--pink': palette.pink,
    '--muted': palette.muted,
    '--accent': palette.accent,
    '--action': palette.action,
    '--search-ink': palette.searchInk,
    '--header-glass': palette.headerGlass,
  } as CSSProperties;

  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: `instant` });
    const updateScroll = () => {
      setScrolled(window.scrollY > 16);
      setShowScrollTop((heroRef.current?.getBoundingClientRect().bottom ?? Infinity) < 80);
    };
    updateScroll();
    window.addEventListener(`scroll`, updateScroll, { passive: true });
    window.addEventListener(`resize`, updateScroll);
    return () => {
      window.removeEventListener(`scroll`, updateScroll);
      window.removeEventListener(`resize`, updateScroll);
    };
  }, [page]);
  useLandingMotion(rootRef);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? `instant` : `smooth` });
    document.getElementById(`content-title-${page}`)?.focus({ preventScroll: true });
  };

  return { theme, rootRef, heroRef, scrolled, themeStyle, showScrollTop, scrollToTop };
};

export default useContentPage;
