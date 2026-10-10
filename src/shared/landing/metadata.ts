import type { PageKey } from '../content/types';

export type MetadataPage = `home` | `signup` | PageKey | `palindromes` | `not-found`;

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
  palindromes: {
    path: `/palindromes`,
    label: `Palindromes`,
    title: `All Palindromes — Words, Names & Phrases | Palindrome Lists`,
    description: `Browse the complete Palindrome Lists collection of words, names, and phrases. Search examples and filter by palindrome type.`,
  },
  words: {
    path: `/words`,
    label: `Words`,
    title: `Palindrome Words — Search the Collection | Palindrome Lists`,
    description: `Browse the full palindrome word collection, including level, radar, civic, and racecar. Search words and filter by starting letter.`,
  },
  names: {
    path: `/names`,
    label: `Names`,
    title: `Palindrome Names — Search the Collection | Palindrome Lists`,
    description: `Browse the full palindrome name collection, including Anna, Ada, Ava, and Otto. Search names and filter by starting letter.`,
  },
  phrases: {
    path: `/phrases`,
    label: `Phrases`,
    title: `Palindrome Phrases — Search the Collection | Palindrome Lists`,
    description: `Browse the full palindrome phrase collection, including Never odd or even and Step on no pets. Search phrases and filter by starting letter.`,
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
    title: `Contact Palindrome Lists — Suggestions, Corrections & Projects`,
    description: `Preview the Palindrome Lists inquiry form for suggestions, corrections, and project questions. Fields are validated locally; messages are not sent or stored.`,
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
    title: `Sign In | Palindrome Lists`,
    description: `Preview the Palindrome Lists sign-in form. Account services are not connected yet.`,
  },
  signup: {
    path: `/signup`,
    label: `Sign up`,
    noIndex: true,
    title: `Sign Up | Palindrome Lists`,
    description: `Preview the Palindrome Lists sign-up form. Account services are not connected yet.`,
  },
  'not-found': {
    path: `/`,
    noIndex: true,
    label: `Page not found`,
    title: `Page Not Found | Palindrome Lists`,
    description: `This page could not be found. Return to Palindrome Lists to explore palindrome words, names, and phrases.`,
  },
};
