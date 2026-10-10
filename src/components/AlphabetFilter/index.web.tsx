import './styles.scss';
import Icon from '../Icon';
import { alphabetLetters } from './data';
import type { AlphabetFilterProps } from './types';

const AlphabetFilter = ({ id, controls, onClear, onToggle, resultCount, selectedLetters }: AlphabetFilterProps) => (
  <div
    id={id}
    role={`group`}
    className={`alphabet-filter`}
    aria-label={`Starting Letter Filters`}
  >
    <div id={`${id}-buttons`} className={`alphabet-filter-buttons`}>
      <button
        type={`button`}
        onClick={onClear}
        id={`${id}-all`}
        aria-controls={controls}
        aria-label={`Show All Letters`}
        aria-pressed={!selectedLetters.length}
        className={`alphabet-filter-button alphabet-filter-all${!selectedLetters.length ? ` is-selected` : ``}`}
      >
        <Icon name={`repeat`} size={14} />
        <span id={`${id}-all-label`} className={`alphabet-filter-label`}>All Letters</span>
      </button>
      {alphabetLetters.map((letter) => (
        <button
          key={letter}
          type={`button`}
          id={`${id}-${letter}`}
          aria-controls={controls}
          onClick={() => onToggle(letter)}
          aria-label={`Starts With ${letter}`}
          aria-pressed={selectedLetters.includes(letter)}
          className={`alphabet-filter-button${selectedLetters.includes(letter) ? ` is-selected` : ``}`}
        >
          {letter}
        </button>
      ))}
      {resultCount !== undefined && (
        <p
          role={`status`}
          aria-live={`polite`}
          id={`${id}-result-count`}
          className={`alphabet-filter-result-count`}
        >
          <span id={`${id}-result-number`} className={`alphabet-filter-result-number`}>{resultCount.toLocaleString()}</span>
          {` ${resultCount === 1 ? `palindrome` : `palindromes`} found`}
        </p>
      )}
    </div>
  </div>
);

export default AlphabetFilter;
