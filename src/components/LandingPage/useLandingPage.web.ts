import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { sectionAliases } from '../../shared/routes';
import { palindromes } from '../../shared/landing/data';
import { useLanding } from '../../shared/landing/LandingContext';
import { collectionPages, type CollectionPageKey } from '../../shared/landing/collectionPages';

const reducedMotion = () => window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  target?.scrollIntoView({
    block: `start`,
    behavior: reducedMotion() ? `auto` : `smooth`,
  });
  target?.focus({ preventScroll: true });
};

const useLandingPage = (collectionPage?: CollectionPageKey) => {
  const collectionCategory = collectionPage ? collectionPages[collectionPage].category : undefined;
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { setSort, setQuery, setShowAll, setCategory } = useLanding();
  const params = useLocalSearchParams<{
    type?: string | string[];
    section?: string | string[];
    palindrome?: string | string[];
  }>();
  const type = Array.isArray(params.type) ? params.type[0] : params.type;
  const section = Array.isArray(params.section) ? params.section[0] : params.section;
  const palindromeId = Array.isArray(params.palindrome) ? params.palindrome[0] : params.palindrome;

  useEffect(() => {
    const updateScrollState = () => {
      const hero = document.getElementById(`hero`);
      setScrolled(window.scrollY > 16);
      setShowScrollTop(Boolean(hero && hero.getBoundingClientRect().bottom <= 0));
    };
    window.addEventListener(`scroll`, updateScrollState, { passive: true });
    window.addEventListener(`resize`, updateScrollState);
    updateScrollState();

    return () => {
      window.removeEventListener(`scroll`, updateScrollState);
      window.removeEventListener(`resize`, updateScrollState);
    };
  }, []);

  useEffect(() => {
    let target = sectionAliases[section ?? ``];

    if ((!collectionPage || collectionPage === `palindromes`) && (type === `word` || type === `name` || type === `phrase`)) {
      setCategory(type);
      target = `collection`;
    }

    if (!target) return;
    const targetId = target;
    const frame = window.requestAnimationFrame(() => scrollToSection(targetId));
    return () => window.cancelAnimationFrame(frame);
  }, [type, section, setCategory, collectionPage]);

  useEffect(() => {
    const entry = palindromes.find((item) => item.id === palindromeId);
    if (!entry) return;
    if (collectionCategory && collectionCategory !== `all` && entry.type !== collectionCategory) return;

    setCategory(collectionCategory ?? `all`);
    setQuery(entry.text);
    const frame = window.requestAnimationFrame(() => scrollToSection(`palindrome-card-${entry.id}`));
    return () => window.cancelAnimationFrame(frame);
  }, [palindromeId, setQuery, setCategory, collectionCategory]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion() ? `auto` : `smooth`,
    });
    document.getElementById(`hero-title`)?.focus({ preventScroll: true });
  };

  const goHome = () => {
    setQuery(``);
    setShowAll(false);
    setSort(`featured`);
    setCategory(`all`);
    scrollToTop();
  };

  return { goHome, scrolled, scrollToTop, showScrollTop, scrollToSection };
};

export default useLandingPage;
