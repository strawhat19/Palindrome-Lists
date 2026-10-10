import { useRef } from 'react';
import { Link } from 'expo-router';
import type { CSSProperties } from 'react';
import Icon from '../Icon';
import PinkCta from '../PinkCta/index.web';
import Hero from '../Hero/index.web';
import PageMetadata from '../PageMetadata';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import useLandingPage from './useLandingPage.web';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import AlphabetFilter from '../AlphabetFilter/index.web';
import PalindromeSearch from '../PalindromeSearch/index.web';
import useLandingMotion from './useLandingMotion.web';
import ScrollToTop from '../ScrollToTop/index.web';
import { landingLinks } from '../../shared/routes';
import type { Sort } from '../../shared/landing/types';
import PalindromeCard from '../PalindromeCard/index.web';
import LandingSections from '../LandingSections/index.web';
import PalindromeCarousel from '../PalindromeCarousel/index.web';
import { useTheme } from '../../shared/themeContext/useTheme';
import { useLanding } from '../../shared/landing/LandingContext';
import useAlphabetFilter from '../../shared/landing/useAlphabetFilter';
import { collectionPages, collectionPageOrder, type CollectionPageKey } from '../../shared/landing/collectionPages';
import './styles.scss';

type LandingPageProps = {
  collectionOnly?: boolean;
  collectionPage?: CollectionPageKey;
};

const LandingPage = ({ collectionOnly = false, collectionPage = `palindromes` }: LandingPageProps) => {
  const collection = collectionPages[collectionPage];
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
  const { selectedLetters, toggleLetter, clearLetters, filteredEntries: letterEntries } = useAlphabetFilter(filteredEntries);
  const { goHome, scrolled, scrollToTop, showScrollTop, scrollToSection } = useLandingPage(collectionOnly ? collectionPage : undefined);
  const isFiltered = Boolean(query.trim() || category !== `all`);
  const visibleEntries = collectionOnly ? letterEntries : previewEntries;
  const resultCount = collectionOnly ? letterEntries.length : filteredCount;
  const isCarousel = !collectionOnly && !showAll && !isFiltered;

  return (
    <div id={collectionOnly ? `${collectionPage}-page` : `palindrome-landing`} ref={landingRef} data-theme={theme} className={`palindrome-landing${collectionOnly ? ` palindromes-page` : ``}`} style={landingTheme}>
      <PageMetadata page={collectionOnly ? collectionPage : `home`} />
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
            <p id='hero-eyebrow' className='palindromes-eyebrow'><Icon name={collection.icon} size={15} /><span>{collection.eyebrow}</span></p>
            <h1 id='hero-title' tabIndex={-1} className='palindromes-title'>{collection.title}</h1>
            <p id='hero-copy' className='palindromes-copy'>{collection.copy}</p>
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
              <h2 id='collection-title' className='collection-title' data-split='heading'>{collectionOnly ? collection.category === `all` ? `All palindromes` : `All palindrome ${collection.label.toLowerCase()}` : `Find your next favorite.`}</h2>
              <p id='collection-label' className='sample-label' data-reveal='section'>{collectionOnly ? collection.category === `all` ? `Words, names, and phrases` : collection.eyebrow : `Curated examples`}</p>
            </div>
            <div id='collection-controls' className='collection-controls'>
              <div id='collection-filters' className='collection-filters' role='group' aria-label='Collection Type'>
                {collectionPageOrder.map((key) => {
                  const item = collectionPages[key];
                  const filterId = `filter-${key === `palindromes` ? `all` : key}`;
                  const filterContent = (
                    <FlipContent id={`${filterId}-content`}>
                      <Icon name={item.icon} size={14} /><span id={`${filterId}-label`} className='filter-label'>{item.label}</span>
                    </FlipContent>
                  );
                  return collectionOnly ? (
                    <Link key={key} href={landingLinks[key]} asChild>
                      <WebAnchor
                        id={filterId}
                        className='filter-button'
                        aria-current={collectionPage === key ? `page` : undefined}
                      >
                        {filterContent}
                      </WebAnchor>
                    </Link>
                  ) : (
                    <button
                      key={key}
                      id={filterId}
                      type='button'
                      className='filter-button'
                      aria-pressed={category === item.category}
                      onClick={() => setCategory(item.category)}
                    >
                      {filterContent}
                    </button>
                  );
                })}
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
          {collectionOnly && (
            <>
              <AlphabetFilter
                onClear={clearLetters}
                onToggle={toggleLetter}
                resultCount={resultCount}
                controls='palindrome-grid'
                selectedLetters={selectedLetters}
                id={`${collectionPage}-alphabet-filter`}
              />
              <PalindromeSearch
                query={query}
                onChange={setQuery}
                label={`Search ${collection.title}`}
                id={`${collectionPage}-collection-search`}
                placeholder={collection.placeholder}
                onSubmit={() => scrollToSection(`collection`)}
              />
            </>
          )}
          {!collectionOnly && (
            <p
              role='status'
              aria-live='polite'
              id='collection-result-count'
              className={isFiltered ? `collection-result-count` : `visually-hidden`}
            >
              {resultCount} {resultCount === 1 ? `palindrome` : `palindromes`} found
            </p>
          )}
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
                  clearLetters();
                  setCategory(collectionOnly ? collection.category : `all`);
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
