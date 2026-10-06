import type { PageKey } from '../content/types';

export type MetadataPage = `home` | PageKey | `not-found`;

export type PageSeo = {
  path: string;
  title: string;
  label: string;
  noIndex?: boolean;
  description: string;
};

export const siteMetadata = {
  name: `Palindrome Lists`,
  url: `https://palindromelists.com`,
  title: `Palindrome Lists — Words Worth Repeating`,
  description: `Discover palindrome words, names, and phrases. Browse examples and learn how to check text that reads the same forward and backward.`,
} as const;

export const pageMetadata: Record<MetadataPage, PageSeo> = {
  home: {
    path: `/`,
    label: `Home`,
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  about: {
    path: `/about`,
    label: `About`,
    title: `About Palindrome Lists — Our Collection & Editorial Approach`,
    description: `Learn why Palindrome Lists exists, how we check palindrome examples, and how we handle sources, attribution, and corrections.`,
  },
  words: {
    path: `/words`,
    label: `Words`,
    title: `Palindrome Words — Examples & Patterns | Palindrome Lists`,
    description: `Explore palindrome words including level, radar, civic, and racecar, with short explanations and a guide to checking their letters.`,
  },
  names: {
    path: `/names`,
    label: `Names`,
    title: `Palindrome Names — Examples & Spelling Guide | Palindrome Lists`,
    description: `Discover names that read the same backward, including Anna, Ada, Ava, and Otto. Learn why exact spelling matters when checking a name.`,
  },
  phrases: {
    path: `/phrases`,
    label: `Phrases`,
    title: `Palindrome Phrases — Examples & How They Work | Palindrome Lists`,
    description: `Read palindrome phrases such as Never odd or even and Step on no pets, with explanations of spacing, punctuation, and letter symmetry.`,
  },
  api: {
    path: `/api`,
    label: `API`,
    title: `Palindrome Developer Guide & API Status | Palindrome Lists`,
    description: `Learn to check English palindrome text with a JavaScript example, understand normalization limits, and see the status of the planned public API.`,
  },
  contact: {
    path: `/contact`,
    label: `Contact`,
    title: `Contact Palindrome Lists — Suggestions & Corrections`,
    description: `Find the project contact route for Palindrome Lists and learn what to include when suggesting an example or reporting a correction.`,
  },
  pricing: {
    path: `/pricing`,
    label: `Pricing`,
    title: `Pricing — Free, Pal, Lister & Pro | Palindrome Lists`,
    description: `Compare Free browsing with the proposed Pal, Lister, and Pro plans. See preview prices and planned features for palindrome lists, collections, and API access.`,
  },
  terms: {
    path: `/terms`,
    label: `Terms`,
    title: `Terms of Use | Palindrome Lists`,
    description: `Read the terms for browsing Palindrome Lists, using educational examples, respecting attribution, and understanding current feature availability.`,
  },
  privacy: {
    path: `/privacy`,
    label: `Privacy Policy`,
    title: `Privacy Policy | Palindrome Lists`,
    description: `Learn how Palindrome Lists uses local theme preferences and offline storage, handles external links, and describes its current advertising status.`,
  },
  signin: {
    path: `/signin`,
    label: `Sign in`,
    noIndex: true,
    title: `Sign In — Account Feature Status | Palindrome Lists`,
    description: `Account features are still in development. Browse palindrome words, names, and phrases freely without signing in.`,
  },
  'not-found': {
    path: `/`,
    noIndex: true,
    label: `Page not found`,
    title: `Page Not Found | Palindrome Lists`,
    description: `This page could not be found. Return to Palindrome Lists to explore palindrome words, names, and phrases.`,
  },
};
