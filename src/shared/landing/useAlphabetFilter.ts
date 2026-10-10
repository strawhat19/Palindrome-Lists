import { useMemo, useState } from 'react';
import { normalizePalindrome } from './data';

const useAlphabetFilter = <Entry extends { text: string }>(entries?: readonly Entry[]) => {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const filteredEntries = useMemo(() => {
    if (!selectedLetters.length) return entries ?? [];
    return entries?.filter((entry) => selectedLetters.includes(normalizePalindrome(entry.text)?.[0]?.toUpperCase() ?? ``)) ?? [];
  }, [entries, selectedLetters]);

  const toggleLetter = (letter: string) => setSelectedLetters((current) => current.includes(letter)
    ? current.filter((selected) => selected !== letter)
    : [...current, letter]);

  return {
    toggleLetter,
    selectedLetters,
    filteredEntries,
    clearLetters: () => setSelectedLetters([]),
  };
};

export default useAlphabetFilter;
