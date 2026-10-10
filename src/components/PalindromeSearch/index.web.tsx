import './styles.scss';
import Icon from '../Icon';
import type { PalindromeSearchProps } from './types';

const PalindromeSearch = ({ id, query, onChange, onSubmit, label = `Search Palindromes`, placeholder = `Find a word, name, or phrase…` }: PalindromeSearchProps) => (
  <form
    id={id}
    role={`search`}
    aria-label={label}
    className={`palindrome-search`}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <span id={`${id}-icon`} className={`palindrome-search-icon`}><Icon name={`search`} size={17} /></span>
    <label id={`${id}-label`} htmlFor={`${id}-input`} className={`visually-hidden`}>{label}</label>
    <input
      name={`q`}
      type={`search`}
      value={query}
      autoComplete={`off`}
      id={`${id}-input`}
      placeholder={placeholder}
      className={`palindrome-search-input`}
      onChange={(event) => onChange(event.target.value)}
    />
    <button type={`submit`} id={`${id}-button`} className={`palindrome-search-button`}>
      <Icon name={`search`} size={14} />
      <span id={`${id}-button-label`} className={`palindrome-search-button-label`}>Search</span>
    </button>
  </form>
);

export default PalindromeSearch;
