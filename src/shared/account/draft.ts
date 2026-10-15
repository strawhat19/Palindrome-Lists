export const checkDraft = (text: string) => {
  if (text.length > 500) return { valid: false, message: `Keep Your Draft Under 500 Characters` };
  if (!text.trim()) return { valid: false, message: `Enter A Word, Name, Or Phrase` };
  if (/[^a-zA-Z\s.,!?;:'"()—–-]/.test(text)) return { valid: false, message: `This Checker Supports English A–Z Letters And Common Punctuation Only` };
  const normalized = text.toLowerCase().replace(/[^a-z]/g, ``);
  if (normalized.length < 2) return { valid: false, message: `Use At Least Two Letters` };
  const valid = normalized === Array.from(normalized).reverse().join(``);
  return { valid, message: valid ? `Palindrome Pattern Matches — This Is Not Editorial Approval` : `The Letters Do Not Match In Reverse` };
};
