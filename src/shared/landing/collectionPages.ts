import type { Category } from './types';
import type { IconName } from '../../components/Icon';

export type CollectionPageKey = `palindromes` | `words` | `names` | `phrases`;
export const collectionPageOrder = [`palindromes`, `words`, `names`, `phrases`] as const;

type CollectionPage = {
  copy: string;
  label: string;
  title: string;
  icon: IconName;
  eyebrow: string;
  category: Category;
  placeholder: string;
};

export const collectionPages: Record<CollectionPageKey, CollectionPage> = {
  palindromes: {
    label: `All`,
    icon: `repeat`,
    category: `all`,
    title: `Palindromes`,
    eyebrow: `The Full Collection`,
    placeholder: `Find a word, name, or phrase…`,
    copy: `Explore every word, name, and phrase. Find something that reads the same both ways.`,
  },
  words: {
    icon: `book`,
    label: `Words`,
    category: `word`,
    title: `Palindrome Words`,
    eyebrow: `The Word Collection`,
    placeholder: `Find a palindrome word…`,
    copy: `Explore the full collection of palindrome words. Find spellings that read the same both ways.`,
  },
  names: {
    icon: `user`,
    label: `Names`,
    category: `name`,
    title: `Palindrome Names`,
    eyebrow: `The Name Collection`,
    placeholder: `Find a palindrome name…`,
    copy: `Explore the full collection of palindrome names. Discover names that read the same both ways.`,
  },
  phrases: {
    icon: `quote`,
    label: `Phrases`,
    category: `phrase`,
    title: `Palindrome Phrases`,
    eyebrow: `The Phrase Collection`,
    placeholder: `Find a palindrome phrase…`,
    copy: `Explore the full collection of palindrome phrases. Read the same letters both ways, ignoring spaces and punctuation.`,
  },
};
