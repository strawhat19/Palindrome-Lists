import type { Palindrome } from './types';
import { wordExamples } from './wordExamples';
import { nameExamples } from './nameExamples';
import { phraseExamples } from './phraseExamples';

export const normalizePalindrome = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, ``);

const featuredPalindromes: readonly Palindrome[] = [
  {
    letters: 5,
    votes: 0,
    comments: 0,
    id: `level`,
    text: `level`,
    type: `word`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    letters: 14,
    votes: 0,
    comments: 0,
    type: `phrase`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    id: `never-odd-or-even`,
    text: `Never odd or even.`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    letters: 7,
    votes: 0,
    comments: 0,
    type: `word`,
    id: `racecar`,
    text: `racecar`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    votes: 0,
    letters: 19,
    comments: 0,
    type: `phrase`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
    id: `was-it-a-car-or-a-cat-i-saw`,
    text: `Was it a car or a cat I saw?`,
  },
  {
    letters: 5,
    votes: 0,
    comments: 0,
    id: `civic`,
    text: `civic`,
    type: `word`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    letters: 5,
    votes: 0,
    comments: 0,
    id: `radar`,
    text: `radar`,
    type: `word`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    votes: 0,
    letters: 4,
    comments: 0,
    id: `anna`,
    text: `Anna`,
    type: `name`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
  {
    votes: 0,
    letters: 3,
    comments: 0,
    id: `ada`,
    text: `Ada`,
    type: `name`,
    language: `English`,
    added: `2026-10-06`,
    addedBy: `Palindrome Lists`,
    author: `Not recorded`,
    firstRecorded: `Not recorded`,
    source: `Editorial example`,
  },
];

type CollectionExample = {
  text: string;
  source: string;
  language?: string;
  type: Palindrome[`type`];
};

const existingTexts = new Set(featuredPalindromes.map((entry) => normalizePalindrome(entry.text)));
const collectionExamples: readonly CollectionExample[] = [
  ...nameExamples.map((entry) => ({ ...entry, type: `name` as const })),
  ...wordExamples.map((entry) => ({ ...entry, type: `word` as const })),
  ...phraseExamples.map((entry) => ({ ...entry, type: `phrase` as const })),
];

export const palindromes: readonly Palindrome[] = [
  ...featuredPalindromes,
  ...collectionExamples.filter(({ text }) => {
    const normalized = normalizePalindrome(text);
    if (existingTexts.has(normalized)) return false;
    existingTexts.add(normalized);
    return true;
  }).map(({ text, type, source, language }) => ({
    text,
    type,
    source,
    votes: 0,
    comments: 0,
    added: `2026-10-09`,
    language: language ?? `English`,
    author: `Not recorded`,
    addedBy: `Palindrome Lists`,
    firstRecorded: `Not recorded`,
    letters: normalizePalindrome(text).length,
    id: text.toLowerCase().replace(/[^a-z0-9]+/g, `-`).replace(/^-|-$/g, ``),
  })),
];
