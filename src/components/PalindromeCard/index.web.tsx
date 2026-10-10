import { useState } from 'react';
import Icon from '../Icon';
import FlipContent from '../FlipContent/index.web';
import usePalindromeCard from './usePalindromeCard.web';
import PalindromeShare from '../PalindromeShare/index.web';
import type { Palindrome } from '../../shared/landing/types';
import { useLanding } from '../../shared/landing/LandingContext';
import './styles.scss';

type PalindromeCardProps = {
  entry: Palindrome;
  tabbable?: boolean;
  instanceId?: string;
};

const PalindromeCard = ({ entry, tabbable = true, instanceId }: PalindromeCardProps) => {
  const cardId = instanceId ?? entry.id;
  const [expanded, setExpanded] = useState(false);
  const { setNotice } = useLanding();
  const { copied, copying, dialogMode, closeDialog, copyPalindrome, sharePalindrome } = usePalindromeCard(entry);
  const addedDate = new Date(`${entry.added}T12:00:00`).toLocaleDateString(`en-US`, {
    day: `numeric`,
    year: `numeric`,
    month: `short`,
  });

  const requestAction = (action: string) => setNotice({
    title: `Sign In Is Coming Soon`,
    message: `You’ll be able to ${action} once accounts are available. Activity controls are previews and do not publish or save activity yet.`,
  });

  return (
    <article
      tabIndex={-1}
      id={`palindrome-card-${cardId}`}
      className='palindrome-card'
      data-reveal='card'
      data-type={entry.type}
      aria-labelledby={`palindrome-title-${cardId}`}
    >
      <div id={`palindrome-content-${cardId}`} className='card-content'>
        <div id={`card-heading-${cardId}`} className='card-heading'>
          <span id={`palindrome-type-${cardId}`} className='record-type'>
            {entry.type === `word` ? `Word` : entry.type === `name` ? `Name` : `Phrase`}
          </span>
          <div
            role='group'
            className='record-actions'
            id={`palindrome-actions-${cardId}`}
            aria-label={`Actions for ${entry.text}`}
          >
            <button
              tabIndex={tabbable ? undefined : -1}
              type='button'
              disabled={copying}
              onClick={copyPalindrome}
              id={`copy-${cardId}`}
              title={copied ? `Copied` : `Copy palindrome`}
              className={`icon-button copy-button${copied ? ` is-copied` : ``}`}
              aria-label={`Copy ${entry.text}`}
            >
              <FlipContent id={`copy-content-${cardId}`}><Icon name={copied ? `check` : `copy`} size={17} /></FlipContent>
            </button>
            <button
              tabIndex={tabbable ? undefined : -1}
              type='button'
              title='Save palindrome'
              className='icon-button save-button'
              id={`save-${cardId}`}
              aria-label={`Save ${entry.text}`}
              onClick={() => requestAction(`save palindromes to your collection`)}
            >
              <FlipContent id={`save-content-${cardId}`}><Icon name='save' size={17} /></FlipContent>
            </button>
            <button
              tabIndex={tabbable ? undefined : -1}
              type='button'
              title='Share palindrome'
              className='icon-button share-button'
              onClick={sharePalindrome}
              id={`share-${cardId}`}
              aria-label={`Share ${entry.text}`}
            >
              <FlipContent id={`share-content-${cardId}`}><Icon name='share' size={17} /></FlipContent>
            </button>
          </div>
        </div>
        <span
          role='status'
          aria-live='polite'
          className='visually-hidden'
          id={`copy-status-${cardId}`}
        >
          {copied ? `Palindrome copied to clipboard` : ``}
        </span>
        <h3
          id={`palindrome-title-${cardId}`}
          className={`card-title${entry.type === `phrase` ? ` card-title-phrase` : ``}`}
        >
          {entry.text}
        </h3>
        <p id={`card-language-${cardId}`} className='card-language'>
          <span>{entry.letters} letters</span>
          <span className='metadata-dot' aria-hidden='true' />
          <span>{entry.language}</span>
        </p>
        <dl id={`visible-metadata-${cardId}`} className='card-visible-metadata'>
          <div id={`metadata-source-${cardId}`} className='visible-metadata-pair'>
            <dt>Source</dt><dd>{entry.source}</dd>
          </div>
          <div id={`metadata-author-${cardId}`} className='visible-metadata-pair'>
            <dt>Author</dt><dd>{entry.author}</dd>
          </div>
          <div id={`metadata-added-${cardId}`} className='visible-metadata-pair'>
            <dt>Added</dt><dd><time dateTime={entry.added}>{addedDate}</time></dd>
          </div>
        </dl>
      </div>
      <div id={`card-footer-${cardId}`} className='card-footer'>
        <button
          tabIndex={tabbable ? undefined : -1}
          type='button'
          aria-expanded={expanded}
          className='details-button'
          id={`details-button-${cardId}`}
          aria-controls={`metadata-panel-${cardId}`}
          onClick={() => setExpanded(!expanded)}
        >
          <FlipContent id={`details-content-${cardId}`}>
            <Icon name='chevron' size={13} /><span>Details</span>
          </FlipContent>
        </button>
        <div id={`card-footer-actions-${cardId}`} className='card-footer-actions'>
          <button
            tabIndex={tabbable ? undefined : -1}
            type='button'
            title='Comment on palindrome'
            className='icon-button comment-button'
            id={`comment-${cardId}`}
            aria-label={`Comment on ${entry.text}, ${entry.comments} comments, preview only`}
            onClick={() => requestAction(`join the conversation on a palindrome`)}
          >
            <FlipContent id={`comment-content-${cardId}`}>
              <Icon name='comment' size={17} /><span className='comment-count'>{entry.comments}</span>
            </FlipContent>
          </button>
          <button
            tabIndex={tabbable ? undefined : -1}
            type='button'
            title='Heart palindrome'
            className='icon-button heart-button'
            id={`heart-${cardId}`}
            aria-label={`Heart ${entry.text}`}
            onClick={() => requestAction(`heart your favorite palindromes`)}
          >
            <FlipContent id={`heart-content-${cardId}`}><Icon name='heart' size={17} /></FlipContent>
          </button>
          <div
            role='group'
            className='vote-controls'
            id={`vote-controls-${cardId}`}
            aria-label={`Votes for ${entry.text}, preview only`}
          >
            <button
              tabIndex={tabbable ? undefined : -1}
              type='button'
              className='icon-button'
              id={`downvote-${cardId}`}
              aria-label={`Downvote ${entry.text}`}
              onClick={() => requestAction(`vote on palindromes`)}
            >
              <FlipContent id={`downvote-content-${cardId}`}><Icon name='down' size={18} /></FlipContent>
            </button>
            <span
              className='vote-score'
              id={`vote-score-${cardId}`}
              aria-label={`${entry.votes} net votes, preview only`}
            >
              {entry.votes}
            </span>
            <button
              tabIndex={tabbable ? undefined : -1}
              type='button'
              className='icon-button upvote-button'
              id={`upvote-${cardId}`}
              aria-label={`Upvote ${entry.text}`}
              onClick={() => requestAction(`vote on palindromes`)}
            >
              <FlipContent id={`upvote-content-${cardId}`}><Icon name='up' size={18} /></FlipContent>
            </button>
          </div>
        </div>
      </div>
      <div
        hidden={!expanded}
        className='metadata-panel'
        id={`metadata-panel-${cardId}`}
      >
        <dl id={`palindrome-metadata-${cardId}`} className='card-metadata'>
          <div id={`metadata-recorded-${cardId}`} className='metadata-pair'>
            <dt>First recorded</dt><dd>{entry.firstRecorded ?? `Not recorded`}</dd>
          </div>
          <div id={`metadata-contributor-${cardId}`} className='metadata-pair'>
            <dt>Added by</dt><dd>{entry.addedBy}</dd>
          </div>
        </dl>
        <p id={`demo-note-${cardId}`} className='demo-note'>
          Added dates describe the collection, not invention. Activity controls are previews.
          Letter counts ignore spaces and punctuation.
        </p>
      </div>
      {dialogMode && <PalindromeShare entry={entry} mode={dialogMode} onClose={closeDialog} />}
    </article>
  );
};

export default PalindromeCard;
