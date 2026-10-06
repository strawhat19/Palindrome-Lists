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
  privacy: { pathname: `/privacy` },
  phrases: { pathname: `/phrases` },
  pricing: { pathname: `/pricing` },
  contact: { pathname: `/contact` },
} as const;

type NavigationItem = {
  key: PageKey;
  label: string;
  icon: IconName;
};

export const mainNavigation = [
  { key: `about`, label: `About`, icon: `info` },
  { key: `api`, label: `API`, icon: `code` },
  { key: `words`, label: `Words`, icon: `book` },
  { key: `names`, label: `Names`, icon: `book` },
  { key: `phrases`, label: `Phrases`, icon: `book` },
  { key: `pricing`, label: `Pricing`, icon: `repeat` },
  { key: `contact`, label: `Contact`, icon: `mail` },
  { key: `signin`, label: `Sign in`, icon: `right` },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  { key: `about`, label: `About`, icon: `info` },
  { key: `pricing`, label: `Pricing`, icon: `repeat` },
  { key: `terms`, label: `Terms`, icon: `book` },
  { key: `privacy`, label: `Privacy Policy`, icon: `save` },
  { key: `contact`, label: `Contact`, icon: `mail` },
] as const satisfies readonly NavigationItem[];

export const routeAliases: Record<string, PageKey> = {
  log: `signin`,
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
  'about-us': `about`,
  'about-me': `about`,
  getintouch: `contact`,
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
