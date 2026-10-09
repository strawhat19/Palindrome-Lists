import type { Href } from 'expo-router';
import type { IconName } from '../Icon';

export type PinkCtaProps = {
  id: string;
  href: Href;
  copy: string;
  title: string;
  label: string;
  eyebrow: string;
  icon?: IconName;
};
