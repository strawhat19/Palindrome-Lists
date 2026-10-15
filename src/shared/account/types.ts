export type AccountRole = `Owner` | `Admin` | `Developer` | `Subscriber`;
export type AccountUser = {
  id: string;
  number: number;
  firebase_uid: string;
  name: string;
  email: string;
  role: AccountRole;
  active: boolean;
  avatarUrl?: string;
  profilePrivacy: `private` | `public`;
};
export type ProfileUpdate = Pick<AccountUser, `name` | `avatarUrl` | `profilePrivacy`>;
export type Subscription<T> = (receive: (state: ResourceState<T>) => void) => () => void;
export type ResourceState<T> =
  | { status: `unconfigured`; message: string }
  | { status: `loading` }
  | { status: `ready`; data: T }
  | { status: `error`; message: string };
export type SubmissionDraft = { text: string; category: `word` | `name` | `phrase`; source: string };
export type SubmissionRecord = SubmissionDraft & {
  id: string;
  number: number;
  authorId: string;
  status: `pending` | `approved` | `rejected`;
};
export type AccountService = {
  subscribeUser: Subscription<AccountUser | null>;
  subscribeFavorites: Subscription<string[]>;
  subscribeSubmissions: Subscription<SubmissionRecord[]>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (fields: ProfileUpdate) => Promise<void>;
  toggleFavorite: (palindromeId: string) => Promise<void>;
  submitPalindrome: (draft: SubmissionDraft) => Promise<void>;
};
