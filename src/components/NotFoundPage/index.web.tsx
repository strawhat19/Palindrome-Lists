import { Link } from 'expo-router';
import Icon from '../Icon';
import Footer from '../Footer/index.web';
import Header from '../Header/index.web';
import PageMetadata from '../PageMetadata';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import { landingLinks } from '../../shared/routes';
import useContentPage from '../ContentPage/useContentPage.web';
import '../LandingPage/styles.scss';
import '../ContentPage/styles.scss';

const NotFoundPage = () => {
  const { theme, rootRef, heroRef, scrolled, themeStyle } = useContentPage(`not-found`);

  return (
    <div id='not-found-page' ref={rootRef} data-theme={theme} style={themeStyle} className='palindrome-landing content-page'>
      <PageMetadata page='not-found' />
      <Header scrolled={scrolled} />
      <main id='not-found-main' className='content-main'>
        <section id='not-found-hero' ref={heroRef} className='landing-container content-hero' aria-labelledby='content-title-not-found'>
          <p id='not-found-eyebrow' className='content-eyebrow'>404 · A wrong turn</p>
          <h1 id='content-title-not-found' className='content-title' tabIndex={-1}>Let’s turn that around.</h1>
          <p id='not-found-description' className='content-description'>This page couldn’t be found. There are still plenty of good words to explore.</p>
          <Link href={landingLinks.home} asChild>
            <WebAnchor id='not-found-home' className='content-text-link'>
              <FlipContent id='not-found-home-label'><Icon name='right' size={16} /><span>Back to Palindrome Lists</span></FlipContent>
            </WebAnchor>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
