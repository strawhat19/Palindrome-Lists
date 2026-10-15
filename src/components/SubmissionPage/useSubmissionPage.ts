import { useState } from 'react';
import { checkDraft } from '../../shared/account/draft';
const useSubmissionPage = () => {
  const [text, setText] = useState(``);
  const [result, setResult] = useState<ReturnType<typeof checkDraft> | null>(null);
  return {
    text, result,
    setText: (value: string) => { setText(value); setResult(null); },
    check: () => setResult(checkDraft(text)),
    clear: () => { setText(``); setResult(null); },
  };
};
export default useSubmissionPage;
