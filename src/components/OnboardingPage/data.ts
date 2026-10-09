import type { IconName } from '../Icon';
import type { CollectionInterest } from './types';

export const onboardingSteps = [`Your Details`, `Your Collection`, `Ready To Explore`] as const;

export const collectionInterests = [
  { id: `word`, icon: `book`, label: `Words`, example: `level`, description: `Small words. Lovely symmetry.` },
  { id: `name`, icon: `user`, label: `Names`, example: `anna`, description: `Names with a little reflection.` },
  { id: `phrase`, icon: `quote`, label: `Phrases`, example: `never odd or even`, description: `A whole thought, both ways.` },
] as const satisfies readonly {
  icon: IconName;
  label: string;
  example: string;
  description: string;
  id: CollectionInterest;
}[];

export const onboardingStories = [
  {
    word: `level`,
    label: `Palindrome Words`,
    title: `A little wordplay.`,
    accent: `A lovely discovery.`,
    eyebrow: `Words Worth Repeating`,
    copy: `Find the small surprises hiding in everyday words. A little curiosity looks good from either direction.`,
  },
  {
    word: `anna`,
    label: `Palindrome Names`,
    title: `Some names`,
    accent: `come full circle.`,
    eyebrow: `A Name To Remember`,
    copy: `From Anna to Otto, explore names that carry the same little magic forward and backward.`,
  },
  {
    label: `Palindrome Phrases`,
    word: `never odd or even`,
    title: `More than a word.`,
    accent: `A new way to look.`,
    eyebrow: `Same Thought, Both Ways`,
    copy: `Look past the spaces and punctuation. Discover the clever patterns inside a whole phrase.`,
  },
] as const;
