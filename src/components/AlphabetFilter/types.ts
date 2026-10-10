export type AlphabetFilterProps = {
  id: string;
  controls?: string;
  onClear: () => void;
  resultCount?: number;
  onToggle: (letter: string) => void;
  selectedLetters: readonly string[];
};
