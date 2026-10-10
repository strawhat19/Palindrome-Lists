export type PalindromeSearchProps = {
  id: string;
  query: string;
  label?: string;
  placeholder?: string;
  onSubmit: () => void;
  onChange: (value: string) => void;
};
