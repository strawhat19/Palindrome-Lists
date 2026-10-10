import { Link, type Href } from 'expo-router';
import Icon from '../Icon';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import PageMetadata from '../PageMetadata';
import useContentPage from './useContentPage.web';
import FlipContent from '../FlipContent/index.web';
import AlphabetFilter from '../AlphabetFilter/index.web';
import WebAnchor from '../WebAnchor/index.web';
import PricingSection from '../PricingSection';
import ScrollToTop from '../ScrollToTop/index.web';
import { contentPages } from '../../shared/content/pages';
import type { PageKey } from '../../shared/content/types';
import { normalizePalindrome } from '../../shared/landing/data';
import useAlphabetFilter from '../../shared/landing/useAlphabetFilter';
import { landingLinks, mainNavigation, footerNavigation } from '../../shared/routes';
import '../LandingPage/styles.scss';
import './styles.scss';

type ContentPageProps = {
  page: PageKey;
};

const relatedPages = [
  { key: `words`, label: `Words` },
  { key: `names`, label: `Names` },
  { key: `phrases`, label: `Phrases` },
  { key: `about`, label: `About the collection` },
] as const;

const ContentPageView = ({ page }: ContentPageProps) => {
  const content = contentPages[page];
  const isPalindromePage = page === `words` || page === `names` || page === `phrases`;
  const { selectedLetters, toggleLetter, clearLetters, filteredEntries: filteredExamples } = useAlphabetFilter(content.examples);
  const pageLabel = [...mainNavigation, ...footerNavigation].find((item) => item.key === page)?.label ?? content.eyebrow;
  const { theme, rootRef, heroRef, scrolled, themeStyle, showScrollTop, scrollToTop } = useContentPage(page);

  return (
    <div
      ref={rootRef}
      data-theme={theme}
      style={themeStyle}
      id={`content-page-${page}`}
      className='palindrome-landing content-page'
    >
      <PageMetadata page={page} />
      <a id={`content-skip-${page}`} className='skip-link' href={`#content-main-${page}`}>
        <FlipContent id={`content-skip-label-${page}`}><Icon name='down' size={16} /><span>Skip to Content</span></FlipContent>
      </a>
      <Header scrolled={scrolled} />
      <main id={`content-main-${page}`} className='content-main' tabIndex={-1}>
        <section
          ref={heroRef}
          id={`content-hero-${page}`}
          className='landing-container content-hero'
          aria-labelledby={`content-title-${page}`}
        >
          <nav id={`content-breadcrumb-${page}`} className='content-breadcrumb' aria-label='Breadcrumb'>
            <ol id={`content-breadcrumb-list-${page}`} className='content-breadcrumb-list'>
              <li id={`content-breadcrumb-home-${page}`} className='content-breadcrumb-item'>
                <Link href={landingLinks.home} asChild>
                  <WebAnchor id={`content-home-link-${page}`} className='content-home-link'>
                    <FlipContent id={`content-home-label-${page}`}><Icon name='repeat' size={14} /><span>Home</span></FlipContent>
                  </WebAnchor>
                </Link>
              </li>
              <li id={`content-breadcrumb-current-${page}`} className='content-breadcrumb-item' aria-current='page'>
                {pageLabel}
              </li>
            </ol>
          </nav>
          <p id={`content-eyebrow-${page}`} className='content-eyebrow' data-reveal='hero'>{content.eyebrow}</p>
          <h1 id={`content-title-${page}`} className='content-title' tabIndex={-1} data-split='hero'>{content.title}</h1>
          <p id={`content-description-${page}`} className='content-description' data-reveal='hero'>{content.description}</p>
          {content.sections.length > 2 && (
            <nav id={`content-contents-${page}`} className='content-contents' aria-label='On This Page'>
              {content.sections.map((section) => (
                <a
                  key={section.id}
                  className='content-contents-link'
                  id={`content-contents-link-${page}-${section.id}`}
                  href={`#content-section-${page}-${section.id}`}
                >
                  <FlipContent id={`content-contents-label-${page}-${section.id}`}><Icon name='book' size={14} /><span>{section.title}</span></FlipContent>
                </a>
              ))}
            </nav>
          )}
        </section>
        {page === `pricing` && <PricingSection variant='page' />}
        {Boolean(content.examples?.length) && (
          <section
            className='landing-container content-examples'
            id={`content-examples-${page}`}
            aria-labelledby={`content-examples-title-${page}`}
          >
            <div id={`content-examples-heading-${page}`} className='content-examples-heading'>
              <h2 id={`content-examples-title-${page}`} className='content-section-title' data-split='heading'>A few to start with.</h2>
              <p id={`content-examples-copy-${page}`} className='content-examples-copy'>Read each one forwards. Then backwards.</p>
            </div>
            {isPalindromePage && (
              <AlphabetFilter
                onClear={clearLetters}
                onToggle={toggleLetter}
                id={`content-alphabet-filter-${page}`}
                selectedLetters={selectedLetters}
                resultCount={filteredExamples.length}
                controls={`content-examples-grid-${page}`}
              />
            )}
            <div id={`content-examples-grid-${page}`} className='content-examples-grid'>
              {content.examples?.map((example) => (
                <article
                  key={example.id}
                  hidden={!filteredExamples.includes(example)}
                  data-reveal='example'
                  className='content-example'
                  id={`content-example-${page}-${example.id}`}
                  aria-labelledby={`content-example-title-${page}-${example.id}`}
                >
                  <div id={`content-example-heading-${page}-${example.id}`} className='content-example-heading'>
                    <h3 id={`content-example-title-${page}-${example.id}`} className='content-example-title'>{example.text}</h3>
                    <Icon name='repeat' size={17} />
                  </div>
                  <p id={`content-example-count-${page}-${example.id}`} className='content-example-count'>
                    {normalizePalindrome(example.text).length} letters · same both ways
                  </p>
                  <p id={`content-example-note-${page}-${example.id}`} className='content-example-note'>{example.note}</p>
                </article>
              ))}
            </div>
            {!filteredExamples.length && (
              <div id={`content-examples-empty-${page}`} className='collection-empty'>
                No examples match the selected letters. Choose All Letters to see every example.
              </div>
            )}
          </section>
        )}
        <div id={`content-reading-${page}`} className='landing-container content-reading'>
          {content.sections.map((section) => (
            <section
              key={section.id}
              className='content-section'
              id={`content-section-${page}-${section.id}`}
              aria-labelledby={`content-section-title-${page}-${section.id}`}
            >
              <h2 id={`content-section-title-${page}-${section.id}`} className='content-section-title' data-split='heading'>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className='content-paragraph'
                  id={`content-paragraph-${page}-${section.id}-${index}`}
                >
                  {paragraph}
                </p>
              ))}
              {Boolean(section.bullets?.length) && (
                <ul id={`content-list-${page}-${section.id}`} className='content-list'>
                  {section.bullets?.map((bullet, index) => (
                    <li key={index} id={`content-list-item-${page}-${section.id}-${index}`} className='content-list-item'>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.code && (
                <pre id={`content-code-${page}-${section.id}`} className='content-code'>
                  <code id={`content-code-value-${page}-${section.id}`} className='content-code-value'>{section.code}</code>
                </pre>
              )}
              {Boolean(section.links?.length) && (
                <div id={`content-links-${page}-${section.id}`} className='content-links'>
                  {section.links?.map((item, index) => item.external ? (
                    <a
                      key={`${item.href}-${index}`}
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='content-text-link'
                      aria-label={`${item.label}, Opens in a New Tab`}
                      id={`content-link-${page}-${section.id}-${index}`}
                    >
                      <FlipContent id={`content-link-label-${page}-${section.id}-${index}`}>
                        <Icon name='external' size={13} /><span>{item.label}</span>
                      </FlipContent>
                    </a>
                  ) : (
                    <Link key={`${item.href}-${index}`} href={item.href as Href} asChild>
                      <WebAnchor className='content-text-link' id={`content-link-${page}-${section.id}-${index}`}>
                        <FlipContent id={`content-link-label-${page}-${section.id}-${index}`}>
                          <Icon name='right' size={14} /><span>{item.label}</span>
                        </FlipContent>
                      </WebAnchor>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
        <aside id={`content-related-${page}`} className='landing-container content-related' aria-labelledby={`content-related-title-${page}`}>
          <div id={`content-related-copy-${page}`} className='content-related-copy'>
            <p id={`content-related-eyebrow-${page}`} className='content-eyebrow'>Keep exploring</p>
            <h2 id={`content-related-title-${page}`} className='content-related-title'>There’s more both ways.</h2>
          </div>
          <nav id={`content-related-navigation-${page}`} className='content-related-navigation' aria-label='Explore Palindrome Lists'>
            {relatedPages.filter((item) => item.key !== page).map((item, index) => (
              <Link key={item.key} href={landingLinks[item.key]} asChild>
                <WebAnchor id={`content-related-link-${page}-${item.key}`} className='content-related-link'>
                  <FlipContent id={`content-related-label-${page}-${item.key}`}>
                    <Icon
                      size={14}
                      color={`var(--${index % 2 ? `leaf` : `action`})`}
                      name={mainNavigation.find((route) => route.key === item.key)?.icon ?? `book`}
                    />
                    <span>{item.label}</span>
                  </FlipContent>
                </WebAnchor>
              </Link>
            ))}
          </nav>
        </aside>
      </main>
      <Footer />
      <ScrollToTop visible={showScrollTop} onPress={scrollToTop} />
    </div>
  );
};

const ContentPage = ({ page }: ContentPageProps) => <ContentPageView key={page} page={page} />;

export default ContentPage;
