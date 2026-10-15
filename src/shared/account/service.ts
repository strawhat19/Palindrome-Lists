import type { AccountService, Subscription } from './types';

export const connectionMessage = `Firebase is not connected. No account data is being read, saved, or synced.`;
const unavailable = async (): Promise<void> => { throw new Error(connectionMessage); };
const disconnected = <T>(): Subscription<T> => (receive) => {
  receive({ status: `unconfigured`, message: connectionMessage });
  return () => {};
};

// Deliberately no SDK, network request, credentials, local authentication, or fallback data.
export const accountService: AccountService = {
  signIn: unavailable,
  signUp: unavailable,
  signOut: unavailable,
  resetPassword: unavailable,
  updateProfile: unavailable,
  toggleFavorite: unavailable,
  signInWithGoogle: unavailable,
  submitPalindrome: unavailable,
  subscribeUser: disconnected(),
  subscribeFavorites: disconnected(),
  subscribeSubmissions: disconnected(),
};
