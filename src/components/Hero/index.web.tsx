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
        <p id='hero-eyebrow' className='hero-eyebrow' data-reveal='hero'>WORDS WORTH REPEATING</p>
        <HeroHeadline />
        <p id='hero-copy' className='hero-copy' data-reveal='hero'>
          A simple collection of words, names, and phrases that read the same in reverse.
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
              <span>Search</span><Icon name='right' size={16} />
            </FlipContent>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
