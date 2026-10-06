export type PalindromeType = `word` | `name` | `phrase`;
export type Category = `all` | PalindromeType;
export type Sort = `featured` | `popular` | `newest`;

export type Notice = {
  title: string;
  message: string;
};

export type Palindrome = {
  id: string;
  text: string;
  votes: number;
  added: string;
  source: string;
  author: string;
  letters: number;
  addedBy: string;
  language: string;
  comments: number;
  type: PalindromeType;
  firstRecorded: string;
};
