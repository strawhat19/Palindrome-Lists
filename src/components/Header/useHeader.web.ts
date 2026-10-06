import { usePathname } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

const useHeader = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = (restoreFocus = true) => {
    if (restoreFocus && isMobile && navigationRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
    setMenuOpen(false);
  };

  useEffect(() => {
    const media = window.matchMedia(`(max-width: 800px)`);
    const updateLayout = () => {
      if (media.matches && navigationRef.current?.contains(document.activeElement)) {
        menuButtonRef.current?.focus();
      } else if (!media.matches && document.activeElement === menuButtonRef.current) {
        navigationRef.current?.querySelector<HTMLAnchorElement>(`a`)?.focus();
      }
      setIsMobile(media.matches);
      setMenuOpen(false);
    };
    updateLayout();
    media.addEventListener(`change`, updateLayout);
    return () => media.removeEventListener(`change`, updateLayout);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;
      menuButtonRef.current?.focus();
      setMenuOpen(false);
    };
    const closeOutsideHeader = (event: Event) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        if (event.type === `pointerdown` && navigationRef.current?.contains(document.activeElement)) {
          menuButtonRef.current?.focus();
        }
        setMenuOpen(false);
      }
    };
    document.addEventListener(`keydown`, closeWithEscape);
    document.addEventListener(`focusin`, closeOutsideHeader);
    document.addEventListener(`pointerdown`, closeOutsideHeader);
    return () => {
      document.removeEventListener(`keydown`, closeWithEscape);
      document.removeEventListener(`focusin`, closeOutsideHeader);
      document.removeEventListener(`pointerdown`, closeOutsideHeader);
    };
  }, [menuOpen]);

  return {
    isMobile,
    menuOpen,
    pathname,
    closeMenu,
    headerRef,
    navigationRef,
    menuButtonRef,
    toggleMenu: () => setMenuOpen((open) => !open),
  };
};

export default useHeader;
