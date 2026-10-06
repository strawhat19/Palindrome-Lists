import { useEffect, useRef, useState } from 'react';
import type { Palindrome } from '../../shared/landing/types';
import { copyText } from '../../shared/common/clipboard';
import { formatPalindrome, getPalindromeShareData } from '../../shared/landing/sharing';

const usePalindromeCard = (entry: Palindrome) => {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [dialogMode, setDialogMode] = useState<`share` | `copy` | null>(null);
  const mounted = useRef(true);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyPalindrome = async () => {
    if (copying) return;

    setCopying(true);

    try {
      await copyText(formatPalindrome(entry));
      if (!mounted.current) return;

      if (copyTimer.current) clearTimeout(copyTimer.current);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      if (mounted.current) setDialogMode(`copy`);
    } finally {
      if (mounted.current) setCopying(false);
    }
  };

  const sharePalindrome = () => {
    if (typeof navigator === `undefined` || !navigator.share) {
      setDialogMode(`share`);
      return;
    }

    try {
      // Invoke the device share sheet directly from the user's click.
      void navigator.share(getPalindromeShareData(entry)).catch((error: unknown) => {
        const cancelled = typeof error === `object` && error !== null && `name` in error && error.name === `AbortError`;
        if (!cancelled && mounted.current) setDialogMode(`share`);
      });
    } catch {
      setDialogMode(`share`);
    }
  };

  return {
    copied,
    copying,
    dialogMode,
    copyPalindrome,
    sharePalindrome,
    closeDialog: () => setDialogMode(null),
  };
};

export default usePalindromeCard;
