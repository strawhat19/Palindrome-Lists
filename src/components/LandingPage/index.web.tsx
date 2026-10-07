import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Icon from '../Icon';
import Hero from '../Hero/index.web';
import PageMetadata from '../PageMetadata';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import useLandingPage from './useLandingPage.web';
import FlipContent from '../FlipContent/index.web';
import useLandingMotion from './useLandingMotion.web';
import ScrollToTop from '../ScrollToTop/index.web';
import type { Sort } from '../../shared/landing/types';
import PalindromeCard from '../PalindromeCard/index.web';
import LandingSections from '../LandingSections/index.web';
import PalindromeCarousel from '../PalindromeCarousel/index.web';
import { useTheme } from '../../shared/themeContext/useTheme';
import { useLanding } from '../../shared/landing/LandingContext';
import './styles.scss';

const LandingPage = () => {
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
    visibleEntries,
    carouselEntries,
  } = useLanding();
  const { goHome, scrolled, scrollToTop, showScrollTop, scrollToSection } = useLandingPage();
  const isFiltered = Boolean(query.trim() || category !== `all`);

  return (
    <div id='palindrome-landing' ref={landingRef} data-theme={theme} className='palindrome-landing' style={landingTheme}>
      <PageMetadata page='home' />
      <a id='skip-to-collection' className='skip-link' href='#collection'>
        <FlipContent id='skip-to-collection-content'>Skip to Collection</FlipContent>
      </a>
      <Header
        onHome={goHome}
        scrolled={scrolled}
      />
      <main id='landing-main' className='landing-main'>
        <Hero onSearch={() => scrollToSection(`collection`)} />
        <section
          id='collection'
          tabIndex={-1}
          className={`landing-container collection${!showAll && !isFiltered ? ` is-carousel` : ``}`}
          aria-labelledby='collection-title'
        >
          <div id='collection-heading' className='collection-heading'>
            <div id='collection-heading-copy' className='collection-heading-copy'>
              <h2 id='collection-title' className='collection-title' data-split='heading'>Find your next favorite.</h2>
              <p id='collection-label' className='sample-label' data-reveal='section'>Curated examples</p>
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
                  <FlipContent id='filter-all-content'>All</FlipContent>
                </button>
                <button
                  id='filter-words'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `word`}
                  onClick={() => setCategory(`word`)}
                >
                  <FlipContent id='filter-words-content'>Words</FlipContent>
                </button>
                <button
                  id='filter-names'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `name`}
                  onClick={() => setCategory(`name`)}
                >
                  <FlipContent id='filter-names-content'>Names</FlipContent>
                </button>
                <button
                  id='filter-phrases'
                  type='button'
                  className='filter-button'
                  aria-pressed={category === `phrase`}
                  onClick={() => setCategory(`phrase`)}
                >
                  <FlipContent id='filter-phrases-content'>Phrases</FlipContent>
                </button>
              </div>
              <div id='sort-control' className='sort-control'>
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
            className={isFiltered ? `collection-result-count` : `visually-hidden`}
          >
            {filteredCount} {filteredCount === 1 ? `palindrome` : `palindromes`} found
          </p>
          {visibleEntries?.length ? (
            !showAll && !isFiltered ? (
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
          {(filteredCount > visibleEntries?.length || (showAll && !isFiltered)) && (
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
                  <span>{showAll ? `Show fewer palindromes` : `Browse all palindromes`}</span>
                  <Icon name={showAll ? `up` : `right`} size={15} />
                </FlipContent>
              </button>
            </div>
          )}
        </section>
        <LandingSections />
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
