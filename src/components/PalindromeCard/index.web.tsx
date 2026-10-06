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
};

const PalindromeCard = ({ entry }: PalindromeCardProps) => {
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
      id={`palindrome-card-${entry.id}`}
      className='palindrome-card'
      data-reveal='card'
      data-type={entry.type}
      aria-labelledby={`palindrome-title-${entry.id}`}
    >
      <div id={`palindrome-content-${entry.id}`} className='card-content'>
        <div id={`card-heading-${entry.id}`} className='card-heading'>
          <span id={`palindrome-type-${entry.id}`} className='record-type'>
            {entry.type === `word` ? `Word` : entry.type === `name` ? `Name` : `Phrase`}
          </span>
          <div
            role='group'
            className='record-actions'
            id={`palindrome-actions-${entry.id}`}
            aria-label={`Actions for ${entry.text}`}
          >
            <button
              type='button'
              title='Comment on palindrome'
              className='icon-button comment-button'
              id={`comment-${entry.id}`}
              aria-label={`Comment on ${entry.text}, ${entry.comments} comments, preview only`}
              onClick={() => requestAction(`join the conversation on a palindrome`)}
            >
              <FlipContent id={`comment-content-${entry.id}`}>
                <Icon name='comment' size={17} /><span className='comment-count'>{entry.comments}</span>
              </FlipContent>
            </button>
            <button
              type='button'
              title='Heart palindrome'
              className='icon-button heart-button'
              id={`heart-${entry.id}`}
              aria-label={`Heart ${entry.text}`}
              onClick={() => requestAction(`heart your favorite palindromes`)}
            >
              <FlipContent id={`heart-content-${entry.id}`}><Icon name='heart' size={17} /></FlipContent>
            </button>
            <button
              type='button'
              disabled={copying}
              onClick={copyPalindrome}
              id={`copy-${entry.id}`}
              title={copied ? `Copied` : `Copy palindrome`}
              className={`icon-button copy-button${copied ? ` is-copied` : ``}`}
              aria-label={`Copy ${entry.text}`}
            >
              <FlipContent id={`copy-content-${entry.id}`}><Icon name={copied ? `check` : `copy`} size={17} /></FlipContent>
            </button>
            <button
              type='button'
              title='Save palindrome'
              className='icon-button save-button'
              id={`save-${entry.id}`}
              aria-label={`Save ${entry.text}`}
              onClick={() => requestAction(`save palindromes to your collection`)}
            >
              <FlipContent id={`save-content-${entry.id}`}><Icon name='save' size={17} /></FlipContent>
            </button>
            <button
              type='button'
              title='Share palindrome'
              className='icon-button share-button'
              onClick={sharePalindrome}
              id={`share-${entry.id}`}
              aria-label={`Share ${entry.text}`}
            >
              <FlipContent id={`share-content-${entry.id}`}><Icon name='share' size={17} /></FlipContent>
            </button>
          </div>
        </div>
        <span
          role='status'
          aria-live='polite'
          className='visually-hidden'
          id={`copy-status-${entry.id}`}
        >
          {copied ? `Palindrome copied to clipboard` : ``}
        </span>
        <h3
          id={`palindrome-title-${entry.id}`}
          className={`card-title${entry.type === `phrase` ? ` card-title-phrase` : ``}`}
        >
          {entry.text}
        </h3>
        <p id={`card-language-${entry.id}`} className='card-language'>
          <span>{entry.letters} letters</span>
          <span className='metadata-dot' aria-hidden='true' />
          <span>{entry.language}</span>
        </p>
        <dl id={`visible-metadata-${entry.id}`} className='card-visible-metadata'>
          <div id={`metadata-source-${entry.id}`} className='visible-metadata-pair'>
            <dt>Source</dt><dd>{entry.source}</dd>
          </div>
          <div id={`metadata-author-${entry.id}`} className='visible-metadata-pair'>
            <dt>Author</dt><dd>{entry.author}</dd>
          </div>
          <div id={`metadata-added-${entry.id}`} className='visible-metadata-pair'>
            <dt>Added</dt><dd><time dateTime={entry.added}>{addedDate}</time></dd>
          </div>
        </dl>
      </div>
      <div id={`card-footer-${entry.id}`} className='card-footer'>
        <button
          type='button'
          aria-expanded={expanded}
          className='details-button'
          id={`details-button-${entry.id}`}
          aria-controls={`metadata-panel-${entry.id}`}
          onClick={() => setExpanded(!expanded)}
        >
          <FlipContent id={`details-content-${entry.id}`}>
            <span>Details</span><Icon name='chevron' size={13} />
          </FlipContent>
        </button>
        <div
          role='group'
          className='vote-controls'
          id={`vote-controls-${entry.id}`}
          aria-label={`Votes for ${entry.text}, preview only`}
        >
          <button
            type='button'
            className='icon-button'
            id={`downvote-${entry.id}`}
            aria-label={`Downvote ${entry.text}`}
            onClick={() => requestAction(`vote on palindromes`)}
          >
            <FlipContent id={`downvote-content-${entry.id}`}><Icon name='down' size={18} /></FlipContent>
          </button>
          <span
            className='vote-score'
            id={`vote-score-${entry.id}`}
            aria-label={`${entry.votes} net votes, preview only`}
          >
            {entry.votes}
          </span>
          <button
            type='button'
            className='icon-button upvote-button'
            id={`upvote-${entry.id}`}
            aria-label={`Upvote ${entry.text}`}
            onClick={() => requestAction(`vote on palindromes`)}
          >
            <FlipContent id={`upvote-content-${entry.id}`}><Icon name='up' size={18} /></FlipContent>
          </button>
        </div>
      </div>
      <div
        hidden={!expanded}
        className='metadata-panel'
        id={`metadata-panel-${entry.id}`}
      >
        <dl id={`palindrome-metadata-${entry.id}`} className='card-metadata'>
          <div id={`metadata-recorded-${entry.id}`} className='metadata-pair'>
            <dt>First recorded</dt><dd>{entry.firstRecorded ?? `Not recorded`}</dd>
          </div>
          <div id={`metadata-contributor-${entry.id}`} className='metadata-pair'>
            <dt>Added by</dt><dd>{entry.addedBy}</dd>
          </div>
        </dl>
        <p id={`demo-note-${entry.id}`} className='demo-note'>
          Added dates describe the collection, not invention. Activity controls are previews.
          Letter counts ignore spaces and punctuation.
        </p>
      </div>
      {dialogMode && <PalindromeShare entry={entry} mode={dialogMode} onClose={closeDialog} />}
    </article>
  );
};

export default PalindromeCard;
