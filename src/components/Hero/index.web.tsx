import Icon from '../Icon';
import HeroHeadline from '../HeroHeadline';
import HalfTurnLogo from '../HalfTurnLogo';
import FlipContent from '../FlipContent/index.web';
import { useLanding } from '../../shared/landing/LandingContext';
import './styles.scss';

type HeroProps = {
  onSearch: () => void;
};

const Hero = ({ onSearch }: HeroProps) => {
  const { query, setQuery } = useLanding();

  return (
    <section id='hero' className='hero' aria-labelledby='hero-title'>
      <div
        aria-hidden='true'
        id='hero-breathing-gradient'
        className='hero-breathing-gradient'
      />
      <div id='hero-inner' className='landing-container hero-inner'>
        <div id='hero-logo-reveal' className='hero-logo-reveal' data-reveal='hero'>
          <div id='hero-logo-orbit' className='hero-logo-orbit'>
            <HalfTurnLogo id='hero-half-turn-logo' size={72} />
          </div>
        </div>
        <div id='palindrome-example' className='hero-eyebrow palindrome-example' data-reveal='hero' aria-label='Level reads the same forward and backward'>
          <span id='palindrome-example-forward' className='example-word'>LEVEL</span>
          <Icon name='repeat' size={12} color='var(--leaf)' />
          <span id='palindrome-example-backward' className='example-word'>LEVEL</span>
        </div>
        <HeroHeadline />
        <p id='hero-copy' className='hero-copy' data-reveal='hero'>
          A simple collection of Palindromes: words, names, and phrases that read the same in reverse.
        </p>
        <form
          id='hero-search'
          role='search'
          data-reveal='hero'
          className='hero-search'
          aria-label='Search the Collection'
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <Icon name='search' size={19} />
          <label htmlFor='search-input' className='visually-hidden'>Search Words, Names, and Phrases</label>
          <input
            id='search-input'
            name='q'
            type='search'
            value={query}
            className='search-input'
            autoComplete='off'
            aria-controls='palindrome-grid'
            placeholder='Find a word, name, or phrase…'
            onChange={(event) => setQuery(event.target.value)}
          />
          <button id='search-button' type='submit' className='search-button'>
            <FlipContent id='search-button-content'>
              <Icon name='search' size={16} /><span>Search</span>
            </FlipContent>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
