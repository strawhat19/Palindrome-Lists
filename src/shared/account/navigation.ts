import type { IconName } from '../../components/Icon';

export const accountPages = {
  profile: { title: `Your profile`, label: `Profile`, icon: `user`, group: `Your space`, path: `/profile` },
  favorites: { title: `Saved discoveries`, label: `Favorites`, icon: `save`, group: `Your space`, path: `/favorites` },
  submissions: { title: `Your contributions`, label: `Submissions`, icon: `quote`, group: `Your space`, path: `/submissions` },
  dashboard: { title: `Collection dashboard`, label: `Dashboard`, icon: `book`, group: `Owner workspace`, path: `/dashboard` },
  admin: { title: `Review & moderation`, label: `Admin`, icon: `shield`, group: `Owner workspace`, path: `/admin` },
  analytics: { title: `Website analytics`, label: `Analytics`, icon: `code`, group: `Owner workspace`, path: `/analytics` },
} as const satisfies Record<string, { title: string; label: string; icon: IconName; group: string; path: string }>;
export type AccountPageKey = keyof typeof accountPages;
