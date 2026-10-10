import { usePathname } from 'expo-router';
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react';

const useHeader = () => {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const palindromeLinkRef = useRef<HTMLAnchorElement>(null);
  const submenuButtonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const closeMenu = (restoreFocus = true) => {
    if (restoreFocus && isMobile && navigationRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
    setMenuOpen(false);
    setSubmenuOpen(false);
  };

  const enterSubmenu = (event: PointerEvent<HTMLDivElement>) => {
    if (isCompact && event.pointerType !== `touch`) setSubmenuOpen(true);
  };
  const leaveSubmenu = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== `touch` && !submenuRef.current?.contains(document.activeElement)) setSubmenuOpen(false);
  };
  const blurSubmenu = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setSubmenuOpen(false);
  };

  useEffect(() => {
    const mobileMedia = window.matchMedia(`(max-width: 1100px)`);
    const compactMedia = window.matchMedia(`(min-width: 1101px) and (max-width: 1350px)`);
    const updateLayout = () => {
      const activeElement = document.activeElement;
      if (mobileMedia.matches && navigationRef.current?.contains(activeElement)) {
        menuButtonRef.current?.focus();
      } else if (!mobileMedia.matches && activeElement === menuButtonRef.current) {
        navigationRef.current?.querySelector<HTMLAnchorElement>(`a`)?.focus();
      } else if (compactMedia.matches && activeElement?.classList.contains(`navigation-category-link`)) {
        palindromeLinkRef.current?.focus();
      } else if (!compactMedia.matches && submenuRef.current?.contains(activeElement) && activeElement !== palindromeLinkRef.current) {
        palindromeLinkRef.current?.focus();
      }
      setIsMobile(mobileMedia.matches);
      setIsCompact(compactMedia.matches);
      setMenuOpen(false);
      setSubmenuOpen(false);
    };
    updateLayout();
    mobileMedia.addEventListener(`change`, updateLayout);
    compactMedia.addEventListener(`change`, updateLayout);
    return () => {
      mobileMedia.removeEventListener(`change`, updateLayout);
      compactMedia.removeEventListener(`change`, updateLayout);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSubmenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!submenuOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;
      submenuButtonRef.current?.focus();
      setSubmenuOpen(false);
    };
    const closeOutsideSubmenu = (event: Event) => {
      if (event.target instanceof Node && !submenuRef.current?.contains(event.target)) setSubmenuOpen(false);
    };
    document.addEventListener(`keydown`, closeWithEscape);
    document.addEventListener(`focusin`, closeOutsideSubmenu);
    document.addEventListener(`pointerdown`, closeOutsideSubmenu);
    return () => {
      document.removeEventListener(`keydown`, closeWithEscape);
      document.removeEventListener(`focusin`, closeOutsideSubmenu);
      document.removeEventListener(`pointerdown`, closeOutsideSubmenu);
    };
  }, [submenuOpen]);

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
    isCompact,
    submenuRef,
    blurSubmenu,
    submenuOpen,
    enterSubmenu,
    leaveSubmenu,
    navigationRef,
    menuButtonRef,
    palindromeLinkRef,
    submenuButtonRef,
    toggleMenu: () => setMenuOpen((open) => !open),
    toggleSubmenu: () => setSubmenuOpen((open) => !open),
  };
};

export default useHeader;
