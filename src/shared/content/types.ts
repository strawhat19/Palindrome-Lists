export type PageKey =
  | `api`
  | `about`
  | `words`
  | `names`
  | `terms`
  | `privacy`
  | `signin`
  | `phrases`
  | `pricing`
  | `contact`;

export type ContentLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type ContentSection = {
  id: string;
  title: string;
  code?: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly ContentLink[];
};

export type PalindromeExample = {
  id: string;
  text: string;
  note: string;
};

export type ContentPageData = {
  key: PageKey;
  title: string;
  eyebrow: string;
  description: string;
  sections: readonly ContentSection[];
  examples?: readonly PalindromeExample[];
};
