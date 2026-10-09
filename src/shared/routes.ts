import type { IconName } from '../components/Icon';
import type { PageKey } from './content/types';

export const landingLinks = {
  home: { pathname: `/` },
  api: { pathname: `/api` },
  about: { pathname: `/about` },
  words: { pathname: `/words` },
  names: { pathname: `/names` },
  terms: { pathname: `/terms` },
  signin: { pathname: `/signin` },
  signup: { pathname: `/signup` },
  privacy: { pathname: `/privacy` },
  phrases: { pathname: `/phrases` },
  pricing: { pathname: `/pricing` },
  contact: { pathname: `/contact` },
  palindromes: { pathname: `/palindromes` },
} as const;

type NavigationItem = {
  key: PageKey | `palindromes`;
  label: string;
  icon: IconName;
  iconColor: `action` | `leaf`;
};

export const mainNavigation = [
  { key: `about`, label: `About`, icon: `info`, iconColor: `action` },
  { key: `palindromes`, label: `Palindromes`, icon: `repeat`, iconColor: `leaf` },
  { key: `words`, label: `Words`, icon: `book`, iconColor: `action` },
  { key: `names`, label: `Names`, icon: `user`, iconColor: `leaf` },
  { key: `phrases`, label: `Phrases`, icon: `quote`, iconColor: `action` },
  { key: `api`, label: `API`, icon: `code`, iconColor: `leaf` },
  { key: `pricing`, label: `Pricing`, icon: `tag`, iconColor: `action` },
  { key: `contact`, label: `Contact`, icon: `mail`, iconColor: `leaf` },
  { key: `signin`, label: `Sign in`, icon: `login`, iconColor: `action` },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  { key: `about`, label: `About`, icon: `info`, iconColor: `action` },
  { key: `pricing`, label: `Pricing`, icon: `tag`, iconColor: `leaf` },
  { key: `terms`, label: `Terms`, icon: `file`, iconColor: `action` },
  { key: `privacy`, label: `Privacy Policy`, icon: `shield`, iconColor: `leaf` },
  { key: `contact`, label: `Contact`, icon: `mail`, iconColor: `action` },
] as const satisfies readonly NavigationItem[];

export const routeAliases: Record<string, PageKey | `signup`> = {
  log: `signin`,
  new: `signup`,
  sign: `signin`,
  info: `about`,
  plans: `pricing`,
  login: `signin`,
  company: `about`,
  aboutus: `about`,
  aboutme: `about`,
  'log-in': `signin`,
  contactus: `contact`,
  contactme: `contact`,
  'sign-in': `signin`,
  'sign-up': `signup`,
  register: `signup`,
  'about-us': `about`,
  'about-me': `about`,
  getintouch: `contact`,
  subscribe: `signup`,
  'contact-us': `contact`,
  'contact-me': `contact`,
  'get-in-touch': `contact`,
  'privacy-policy': `privacy`,
  'terms-of-service': `terms`,
};

// Preserve existing bookmarked landing-section query URLs.
export const sectionAliases: Record<string, string> = {
  about: `about`,
  api: `api`,
  pricing: `pricing-landing`,
  contact: `contact`,
  'about-us': `about`,
  'contact-us': `contact`,
};

export const getAliasParams = () => Object.keys(routeAliases).map((alias) => ({ alias }));
