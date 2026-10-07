import { Link } from 'expo-router';
import type { CSSProperties } from 'react';
import Icon from '../Icon';
import useHeader from './useHeader.web';
import HalfTurnLogo from '../HalfTurnLogo';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import { landingLinks, mainNavigation } from '../../shared/routes';
import { useTheme } from '../../shared/themeContext/useTheme';
import './styles.scss';

type HeaderProps = {
  scrolled: boolean;
  onHome?: () => void;
};

const Header = ({ scrolled, onHome }: HeaderProps) => {
  const sticky = true;
  const { theme, toggleTheme } = useTheme();
  const { isMobile, menuOpen, pathname, closeMenu, headerRef, navigationRef, menuButtonRef, toggleMenu } = useHeader();
  const themeLabel = theme === `dark` ? `Switch to Light Mode` : `Switch to Dark Mode`;

  return (
    <header
      id='site-header'
      ref={headerRef}
      className={`site-header${sticky ? ` is-sticky` : ``}${scrolled ? ` is-scrolled` : ``}`}
    >
      <div id='header-inner' className='landing-container header-inner'>
        <Link href={landingLinks.home} asChild>
          <WebAnchor
            id='header-brand'
            className='site-brand'
            aria-label='Palindrome Lists Home'
            onClick={() => {
              closeMenu();
              onHome?.();
            }}
          >
            <span id='header-logo-orbit' className='header-logo-orbit'>
              <HalfTurnLogo id='header-half-turn-logo' size={39} />
            </span>
            <FlipContent id='header-brand-name' className='brand-name'>
              Palindrome Lists
            </FlipContent>
          </WebAnchor>
        </Link>
        <div id='header-actions' className='header-actions'>
          <button
            id='header-theme-toggle'
            type='button'
            title={themeLabel}
            aria-label={themeLabel}
            className='header-theme-toggle'
            onClick={toggleTheme}
          >
            <FlipContent id='header-theme-content'>
              <Icon fill='#FFFFFF' name={theme === `dark` ? `sun` : `moon`} size={19} />
            </FlipContent>
          </button>
          <Link href={landingLinks.signin} asChild>
            <WebAnchor
              id='navigation-signin'
              className='sign-in-link'
              onClick={() => closeMenu()}
              aria-current={pathname === landingLinks.signin.pathname ? `page` : undefined}
            >
              <FlipContent id='navigation-signin-content'>
                <span>Sign in</span><Icon name='right' size={14} />
              </FlipContent>
            </WebAnchor>
          </Link>
          <button
            id='navigation-menu-button'
            type='button'
            ref={menuButtonRef}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls='site-navigation-panel'
            className={`navigation-menu-button${menuOpen ? ` is-open` : ``}`}
            aria-label={menuOpen ? `Close Navigation` : `Open Navigation`}
          >
            <span id='navigation-menu-icon' className='navigation-menu-icon' aria-hidden='true'>
              <span id='navigation-menu-line-1' className='navigation-menu-line' />
              <span id='navigation-menu-line-2' className='navigation-menu-line' />
              <span id='navigation-menu-line-3' className='navigation-menu-line' />
            </span>
          </button>
        </div>
        <div
          id='site-navigation-panel'
          inert={isMobile && !menuOpen}
          aria-hidden={isMobile && !menuOpen ? true : undefined}
          className={`navigation-panel${menuOpen ? ` is-open` : ``}`}
        >
          <nav
            id='site-navigation'
            ref={navigationRef}
            className='site-navigation'
            aria-label='Main Navigation'
          >
            <p id='navigation-caption' className='navigation-caption'>A little discovery. Both ways.</p>
            <div id='navigation-links' className='navigation-links'>
              {mainNavigation.filter((item) => item.key !== `signin`).map((item, index) => (
                <Link key={item.key} href={landingLinks[item.key]} asChild>
                  <WebAnchor
                    id={`navigation-${item.key}`}
                    onClick={() => closeMenu()}
                    className='navigation-link'
                    aria-current={pathname === landingLinks[item.key].pathname ? `page` : undefined}
                    style={{ '--navigation-index': index } as CSSProperties}
                  >
                    <FlipContent id={`navigation-${item.key}-content`}>
                      <span className='navigation-item-icon'><Icon name={item.icon} size={17} /></span>
                      <span>{item.label}</span>
                    </FlipContent>
                    <span className='navigation-item-arrow'><Icon name='right' size={15} /></span>
                  </WebAnchor>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
