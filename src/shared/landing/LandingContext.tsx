import { palindromes, normalizePalindrome } from './data';
import type { Sort, Notice, Category, Palindrome } from './types';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useMemo, useState, useEffect, useContext, createContext } from 'react';

export type LandingContextValue = {
  sort: Sort;
  query: string;
  showAll: boolean;
  category: Category;
  notice: Notice | null;
  filteredCount: number;
  filteredEntries: Palindrome[];
  visibleEntries: Palindrome[];
  carouselEntries: Palindrome[];
  setSort: Dispatch<SetStateAction<Sort>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setShowAll: Dispatch<SetStateAction<boolean>>;
  setCategory: Dispatch<SetStateAction<Category>>;
  setNotice: Dispatch<SetStateAction<Notice | null>>;
};

const LandingContext = createContext<LandingContextValue | null>(null);
const previewTypes = [`word`, `name`, `phrase`] as const;
const carouselSampleSize = 6;

export const LandingProvider = ({ children, initialCategory = `all` }: { children: ReactNode; initialCategory?: Category }) => {
  const [query, setQuery] = useState(``);
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState<Sort>(`featured`);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [category, setCategory] = useState<Category>(initialCategory);

  useEffect(() => {
    setShowAll(false);
  }, [sort, query, category]);

  const filteredEntries = useMemo(() => {
    const search = normalizePalindrome(query.trim());
    const entries = palindromes
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) =>
        (category === `all` || entry.type === category) &&
        normalizePalindrome(entry.text).includes(search),
      );

    if (sort === `popular`) {
      entries.sort((left, right) =>
        right.entry.votes - left.entry.votes || left.index - right.index,
      );
    }

    if (sort === `newest`) {
      entries.sort((left, right) =>
        Date.parse(right.entry.added) - Date.parse(left.entry.added) ||
        left.index - right.index,
      );
    }

    return entries.map(({ entry }) => entry);
  }, [sort, query, category]);

  const carouselEntries = useMemo(() => {
    const groups = previewTypes.map((type) => filteredEntries.filter((entry) => entry.type === type).slice(0, carouselSampleSize));
    const rounds = Math.max(...groups.map((entries) => entries.length));

    // Cycle shorter groups so every round and the loop seam keep Word → Name → Phrase.
    return Array.from({ length: rounds }, (_, index) => groups.flatMap((entries) => {
      const entry = entries[index % entries.length];
      return entry ? [entry] : [];
    })).flat();
  }, [filteredEntries]);

  const value = useMemo<LandingContextValue>(() => ({
    sort,
    query,
    notice,
    showAll,
    setSort,
    category,
    setQuery,
    setNotice,
    setShowAll,
    setCategory,
    carouselEntries,
    filteredEntries,
    filteredCount: filteredEntries.length,
    visibleEntries: showAll || query.trim() || category !== `all`
      ? filteredEntries
      : previewTypes.flatMap((type) => {
        const entry = filteredEntries.find((item) => item.type === type);
        return entry ? [entry] : [];
      }),
  }), [sort, query, notice, showAll, category, carouselEntries, filteredEntries]);

  return (
    <LandingContext.Provider value={value}>
      {children}
    </LandingContext.Provider>
  );
};

export const useLanding = () => {
  const context = useContext(LandingContext);

  if (!context) {
    throw new Error(`useLanding Requires LandingProvider`);
  }

  return context;
};
