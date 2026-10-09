import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Icon from '../Icon';
import PinkCta from '../PinkCta/index.web';
import Hero from '../Hero/index.web';
import PageMetadata from '../PageMetadata';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import useLandingPage from './useLandingPage.web';
import FlipContent from '../FlipContent/index.web';
import useLandingMotion from './useLandingMotion.web';
import ScrollToTop from '../ScrollToTop/index.web';
import { landingLinks } from '../../shared/routes';
import type { Sort } from '../../shared/landing/types';
import PalindromeCard from '../PalindromeCard/index.web';
import LandingSections from '../LandingSections/index.web';
import PalindromeCarousel from '../PalindromeCarousel/index.web';
import { useTheme } from '../../shared/themeContext/useTheme';
import { useLanding } from '../../shared/landing/LandingContext';
import './styles.scss';

type LandingPageProps = {
  collectionOnly?: boolean;
};

const LandingPage = ({ collectionOnly = false }: LandingPageProps) => {
  const landingRef = useRef<HTMLDivElement>(null);
  const { theme, palette } = useTheme();
  useLandingMotion(landingRef);
  const landingTheme = {
    colorScheme: theme,
    '--ink': palette.ink,
    '--page': palette.page,
    '--card': palette.card,
    '--soft': palette.soft,
    '--leaf': palette.leaf,
    '--line': palette.line,
    '--lime': palette.lime,
    '--pink': palette.pink,
    '--muted': palette.muted,
    '--accent': palette.accent,
    '--action': palette.action,
    '--search-ink': palette.searchInk,
    '--header-glass': palette.headerGlass,
  } as CSSProperties;
  const {
    sort,
    query,
    notice,
    showAll,
    category,
    setSort,
    setQuery,
    setNotice,
    setShowAll,
    setCategory,
    filteredCount,
    filteredEntries,
    carouselEntries,
    visibleEntries: previewEntries,
  } = useLanding();
  const { goHome, scrolled, scrollToTop, showScrollTop, scrollToSection } = useLandingPage();
  const isFiltered = Boolean(query.trim() || category !== `all`);
  const visibleEntries = collectionOnly ? filteredEntries : previewEntries;
  const isCarousel = !collectionOnly && !showAll && !isFiltered;

  return (
    <div id={collectionOnly ? `palindromes-page` : `palindrome-landing`} ref={landingRef} data-theme={theme} className={`palindrome-landing${collectionOnly ? ` palindromes-page` : ``}`} style={landingTheme}>
      <PageMetadata page={collectionOnly ? `palindromes` : `home`} />
      <a id='skip-to-collection' className='skip-link' href='#collection'>
        <FlipContent id='skip-to-collection-content'><Icon name='down' size={16} /><span>Skip to Collection</span></FlipContent>
      </a>
      <Header
        onHome={goHome}
        scrolled={scrolled}
      />
      <main id='landing-main' className='landing-main'>
        {collectionOnly ? (
          <section id='hero' className='landing-container palindromes-hero' aria-labelledby='hero-title'>
            <p id='hero-eyebrow' className='palindromes-eyebrow'><Icon name='repeat' size={15} /><span>The Full Collection</span></p>
            <h1 id='hero-title' tabIndex={-1} className='palindromes-title'>Palindromes</h1>
            <p id='hero-copy' className='palindromes-copy'>Explore every word, name, and phrase. Find something that reads the same both ways.</p>
            <form id='hero-search' role='search' className='hero-search palindromes-search' aria-label='Search the Collection' onSubmit={(event) => { event.preventDefault(); scrollToSection(`collection`); }}>
              <Icon name='search' size={19} />
              <label htmlFor='search-input' className='visually-hidden'>Search Words, Names, and Phrases</label>
              <input id='search-input' name='q' type='search' value={query} className='search-input' autoComplete='off' aria-controls='palindrome-grid' placeholder='Find a word, name, or phrase…' onChange={(event) => setQuery(event.target.value)} />
              <button id='search-button' type='submit' className='search-button'><FlipContent id='search-button-content'><Icon name='search' size={16} /><span>Search</span></FlipContent></button>
            </form>
          </section>
        ) : <Hero onSearch={() => scrollToSection(`collection`)} />}
        <section
          id='collection'
          tabIndex={-1}
          className={`landing-container collection${isCarousel ? ` is-carousel` : ``}`}
          aria-labelledby='collection-title'
        >
          <div id='collection-heading' className='collection-heading'>
            <div id='collection-heading-copy' className='collection-heading-copy'>
              <h2 id='collection-title' className='collection-title' data-split='heading'>{collectionOnly ? `All palindromes` : `Find your next favorite.`}</h2>
              <p id='collection-label' className='sample-label' data-reveal='section'>{collectionOnly ? `Words, names, and phrases` : `Curated examples`}</p>
            </div>
            <div id='collection-controls' className='collection-controls'>
              <div id='collection-filters' className='collection-filters' role='group' aria-label='Collection Type'>
                <button
                  id='filter-all'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `all`}
                  onClick={() => setCategory(`all`)}
                >
                  <FlipContent id='filter-all-content'><Icon name='repeat' size={14} /><span>All</span></FlipContent>
                </button>
                <button
                  id='filter-words'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `word`}
                  onClick={() => setCategory(`word`)}
                >
                  <FlipContent id='filter-words-content'><Icon name='book' size={14} /><span>Words</span></FlipContent>
                </button>
                <button
                  id='filter-names'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `name`}
                  onClick={() => setCategory(`name`)}
                >
                  <FlipContent id='filter-names-content'><Icon name='user' size={14} /><span>Names</span></FlipContent>
                </button>
                <button
                  id='filter-phrases'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `phrase`}
                  onClick={() => setCategory(`phrase`)}
                >
                  <FlipContent id='filter-phrases-content'><Icon name='quote' size={14} /><span>Phrases</span></FlipContent>
                </button>
              </div>
              <div id='sort-control' className='sort-control'>
                <span id='sort-control-icon' className='sort-control-icon'><Icon name='repeat' size={14} /></span>
                <label htmlFor='sort-select' className='visually-hidden'>Sort Entries</label>
                <select
                  id='sort-select'
                  name='sort'
                  value={sort}
                  className='sort-select'
                  onChange={(event) => setSort(event.target.value as Sort)}
                >
                  <option value='featured'>Featured</option>
                  <option value='popular'>Popular</option>
                  <option value='newest'>Newest</option>
                </select>
                <Icon name='chevron' size={12} />
              </div>
            </div>
          </div>
          <p
            id='collection-result-count'
            role='status'
            aria-live='polite'
            className={collectionOnly || isFiltered ? `collection-result-count` : `visually-hidden`}
          >
            {filteredCount} {filteredCount === 1 ? `palindrome` : `palindromes`} found
          </p>
          {visibleEntries?.length ? (
            isCarousel ? (
              <PalindromeCarousel entries={carouselEntries} />
            ) : (
              <div id='palindrome-grid' className='palindrome-grid'>
                {visibleEntries.map((entry) => <PalindromeCard key={entry.id} entry={entry} />)}
              </div>
            )
          ) : (
            <div id='collection-empty' className='collection-empty'>
              <Icon name='search' size={27} />
              <h3 id='empty-title' className='empty-title'>No palindromes found.</h3>
              <p id='empty-copy' className='empty-copy'>Try another word or explore the whole collection.</p>
              <button
                id='clear-search'
                type='button'
                className='text-action'
                onClick={() => {
                  setQuery(``);
                  setCategory(`all`);
                }}
              >
                <FlipContent id='clear-search-content'>
                  <Icon name='close' size={15} /><span>Clear filters</span>
                </FlipContent>
              </button>
            </div>
          )}
          {!collectionOnly && (filteredCount > visibleEntries?.length || (showAll && !isFiltered)) && (
            <div id='collection-bottom' className='collection-bottom'>
              <button
                id='browse-collection'
                type='button'
                className='browse-link'
                onClick={() => {
                  setShowAll(!showAll);
                  if (showAll) scrollToSection(`collection`);
                }}
              >
                <FlipContent id='browse-collection-content'>
                  <Icon name={showAll ? `up` : `right`} size={15} />
                  <span>{showAll ? `Show fewer palindromes` : `Browse all palindromes`}</span>
                </FlipContent>
              </button>
            </div>
          )}
        </section>
        {collectionOnly ? (
          <PinkCta
            icon='mail'
            id='palindromes-cta'
            label='Get in touch'
            eyebrow='Share A Discovery'
            href={landingLinks.contact}
            title='Found a palindrome worth sharing?'
            copy='Have a new word, name, or phrase in mind? Help the collection grow with a suggestion or correction.'
          />
        ) : <LandingSections />}
      </main>
      <Footer onHome={goHome} />
      <div id='landing-notice-region' className='landing-notice-region' aria-live='polite' aria-atomic='true'>
        {notice && (
          <aside id='landing-notice' className='landing-notice' aria-labelledby='landing-notice-title'>
            <div id='landing-notice-content' className='landing-notice-content'>
              <h2 id='landing-notice-title' className='landing-notice-title'>{notice.title}</h2>
              <p id='landing-notice-message' className='landing-notice-message'>{notice.message}</p>
            </div>
            <button
              id='dismiss-landing-notice'
              type='button'
              className='notice-dismiss'
              aria-label='Dismiss Notice'
              onClick={() => setNotice(null)}
            >
              <FlipContent id='dismiss-notice-content'><Icon name='close' size={18} /></FlipContent>
            </button>
          </aside>
        )}
      </div>
      <ScrollToTop visible={showScrollTop} onPress={scrollToTop} />
    </div>
  );
};

export default LandingPage;
