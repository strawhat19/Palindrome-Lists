import type { Palindrome } from './types';
import { siteMetadata } from './metadata';
import type { IconName } from '../../components/Icon';

type ShareTarget = {
  id: string;
  icon: IconName;
  href: string;
  label: string;
};

export const getPalindromeShareData = (entry: Palindrome) => {
  const type = entry.type[0].toUpperCase() + entry.type.slice(1);

  return {
    title: `${entry.text} — ${siteMetadata.name}`,
    url: `${siteMetadata.url}/?palindrome=${encodeURIComponent(entry.id)}`,
    text: `“${entry.text.trim()}”\n${type} palindrome · ${entry.letters} letters\nWords worth repeating.`,
  };
};

export const formatPalindrome = (entry: Palindrome) => {
  const { text, url } = getPalindromeShareData(entry);
  return `${text}\n\n${url}`;
};

export const shareTargets = (entry: Palindrome): readonly ShareTarget[] => {
  const { title, text, url } = getPalindromeShareData(entry);
  const message = encodeURIComponent(formatPalindrome(entry));
  const caption = encodeURIComponent(text.replace(/\n/g, ` `));
  const emailBody = encodeURIComponent(formatPalindrome(entry).replace(/\n/g, `\r\n`));
  const socialPost = encodeURIComponent(`${text.replace(/\n/g, ` `)} ${url}`);

  return [
    {
      id: `x`,
      label: `X`,
      icon: `share`,
      href: `https://x.com/intent/tweet?text=${caption}&url=${encodeURIComponent(url)}`,
    },
    {
      id: `bluesky`,
      label: `Bluesky`,
      icon: `share`,
      href: `https://bsky.app/intent/compose?text=${socialPost}`,
    },
    {
      id: `whatsapp`,
      icon: `comment`,
      label: `WhatsApp`,
      href: `https://wa.me/?text=${message}`,
    },
    {
      id: `email`,
      icon: `mail`,
      label: `Email`,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${emailBody}`,
    },
  ];
};
