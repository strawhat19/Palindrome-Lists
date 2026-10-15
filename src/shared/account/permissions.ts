import type { AccountUser } from './types';
import type { AccountPageKey } from './navigation';

// Future view gating only. Firestore rules and server endpoints must verify independently.
export const canAccessAccountPage = (user: AccountUser | null, page: AccountPageKey): boolean => {
  if (!user?.active) return false;
  if ([`profile`, `favorites`, `submissions`].includes(page)) return true;
  return user.role === `Owner`;
};
