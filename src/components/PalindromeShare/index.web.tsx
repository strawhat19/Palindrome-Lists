import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Icon from '../Icon';
import type { Palindrome } from '../../shared/landing/types';
import { copyText } from '../../shared/common/clipboard';
import { useTheme } from '../../shared/themeContext/useTheme';
import { formatPalindrome, getPalindromeShareData, shareTargets } from '../../shared/landing/sharing';
import './styles.scss';

type PalindromeShareProps = {
  entry: Palindrome;
  onClose: () => void;
  mode?: `share` | `copy`;
};

const PalindromeShare = ({ entry, onClose, mode = `share` }: PalindromeShareProps) => {
  const { theme, palette } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState(``);
  const [copying, setCopying] = useState(false);
  const mounted = useRef(true);
  const shareData = getPalindromeShareData(entry);
  const formattedText = formatPalindrome(entry);
  const dialogTheme = {
    colorScheme: theme,
    '--ink': palette.ink,
    '--page': palette.page,
    '--card': palette.card,
    '--soft': palette.soft,
    '--leaf': palette.leaf,
    '--line': palette.line,
    '--muted': palette.muted,
    '--accent': palette.accent,
    '--action': palette.action,
  } as CSSProperties;

  useEffect(() => {
    mounted.current = true;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = `hidden`;
    if (dialog && !dialog.open) dialog.showModal();
    if (mode === `copy`) {
      textRef.current?.focus();
      textRef.current?.select();
    }

    return () => {
      mounted.current = false;
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [mode]);

  const copyValue = async (value: string, target: `text` | `link`) => {
    if (copying) return;

    setCopying(true);

    try {
      await copyText(value);
      if (mounted.current) setFeedback(target === `link` ? `Link copied` : `Palindrome copied`);
    } catch {
      if (!mounted.current) return;

      const field = target === `link` ? linkRef.current : textRef.current;
      field?.focus();
      field?.select();
      setFeedback(`Clipboard unavailable. The text is selected; use your device’s Copy command.`);
    } finally {
      if (mounted.current) setCopying(false);
    }
  };

  if (typeof document === `undefined`) return null;

  return createPortal(
    <div
      data-theme={theme}
      style={dialogTheme}
      className='palindrome-landing palindrome-share-root'
      id={`palindrome-share-root-${entry.id}`}
    >
      <dialog
        ref={dialogRef}
        className='palindrome-share-dialog'
        id={`palindrome-share-dialog-${entry.id}`}
        aria-labelledby={`palindrome-share-title-${entry.id}`}
        aria-describedby={`palindrome-share-description-${entry.id}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <div id={`palindrome-share-panel-${entry.id}`} className='palindrome-share-panel'>
          <div id={`palindrome-share-heading-${entry.id}`} className='palindrome-share-heading'>
            <div id={`palindrome-share-heading-copy-${entry.id}`} className='palindrome-share-heading-copy'>
              <p id={`palindrome-share-eyebrow-${entry.id}`} className='palindrome-share-eyebrow'>Worth repeating</p>
              <h2 id={`palindrome-share-title-${entry.id}`} className='palindrome-share-title'>
                {mode === `copy` ? `Copy this palindrome.` : `Pass it both ways.`}
              </h2>
            </div>
            <button
              autoFocus
              type='button'
              onClick={onClose}
              aria-label='Close Share Dialog'
              className='palindrome-share-close'
              id={`palindrome-share-close-${entry.id}`}
            >
              <Icon name='close' size={20} />
            </button>
          </div>
          <p id={`palindrome-share-description-${entry.id}`} className='palindrome-share-description'>
            {mode === `copy`
              ? `Your browser couldn’t copy automatically. Select the text below to copy it, or try the button again.`
              : `Choose where to share it, or copy a neatly formatted version. You’ll review the message before sending.`}
          </p>
          {mode === `share` && (
            <div
              role='group'
              aria-label='Share Destinations'
              className='palindrome-share-destinations'
              id={`palindrome-share-destinations-${entry.id}`}
            >
              {shareTargets(entry).map((target) => (
                <a
                  key={target.id}
                  href={target.href}
                  target={target.href.startsWith(`mailto:`) ? undefined : `_blank`}
                  rel='noopener noreferrer'
                  className='palindrome-share-destination'
                  aria-label={`Compose with ${target.label}${target.href.startsWith(`mailto:`) ? ` in Your Email App` : `, Opens in a New Tab`}`}
                  id={`palindrome-share-destination-${entry.id}-${target.id}`}
                >
                  <Icon name={target.icon} size={17} />
                  <span className='palindrome-share-destination-label'>{target.label}</span>
                </a>
              ))}
            </div>
          )}
          <label
            htmlFor={`palindrome-share-text-${entry.id}`}
            className='palindrome-share-label'
            id={`palindrome-share-text-label-${entry.id}`}
          >
            Palindrome to copy
          </label>
          <textarea
            rows={4}
            readOnly
            ref={textRef}
            spellCheck={false}
            value={formattedText}
            className='palindrome-share-text'
            id={`palindrome-share-text-${entry.id}`}
            onFocus={(event) => event.currentTarget.select()}
          />
          <div id={`palindrome-share-copy-row-${entry.id}`} className='palindrome-share-copy-row'>
            <button
              type='button'
              disabled={copying}
              className='palindrome-share-copy'
              id={`palindrome-share-copy-text-${entry.id}`}
              onClick={() => void copyValue(formattedText, `text`)}
            >
              <Icon name='copy' size={16} /><span>Copy palindrome</span>
            </button>
          </div>
          <label
            className='palindrome-share-label'
            htmlFor={`palindrome-share-link-${entry.id}`}
            id={`palindrome-share-link-label-${entry.id}`}
          >
            Direct link
          </label>
          <div id={`palindrome-share-link-row-${entry.id}`} className='palindrome-share-link-row'>
            <input
              readOnly
              type='text'
              ref={linkRef}
              value={shareData.url}
              className='palindrome-share-link'
              id={`palindrome-share-link-${entry.id}`}
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              type='button'
              disabled={copying}
              className='palindrome-share-copy-link'
              id={`palindrome-share-copy-link-${entry.id}`}
              onClick={() => void copyValue(shareData.url, `link`)}
            >
              <Icon name='copy' size={16} /><span>Copy link</span>
            </button>
          </div>
          <p
            role='status'
            aria-live='polite'
            aria-atomic='true'
            className='palindrome-share-feedback'
            id={`palindrome-share-feedback-${entry.id}`}
          >
            {feedback}
          </p>
        </div>
      </dialog>
    </div>,
    document.body,
  );
};

export default PalindromeShare;
