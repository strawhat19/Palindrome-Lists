import { useState } from 'react';
import { useDeviceLibrary } from '../../shared/account/DeviceLibrary';
import { checkDraft } from '../../shared/account/draft';
const useSubmissionPage = () => {
  const local = useDeviceLibrary();
  const text = local.data.draft;
  const setText = (draft: string) => local.update((data) => ({ ...data, draft }));
  const [result, setResult] = useState<ReturnType<typeof checkDraft> | null>(null);
  return {
    text, result, ready: local.ready, status: local.status,
    setText: (value: string) => { setText(value); setResult(null); },
    check: () => setResult(checkDraft(text)),
    clear: () => { setText(``); setResult(null); },
  };
};
export default useSubmissionPage;
