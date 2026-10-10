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

const navigationItems = mainNavigation.filter((item) => item.key !== `signin`);
const palindromeCategories = navigationItems.filter((item) => item.key === `words` || item.key === `names` || item.key === `phrases`);

const Header = ({ scrolled, onHome }: HeaderProps) => {
  const sticky = true;
  const { theme, palette, toggleTheme } = useTheme();
  const {
    isMobile,
    menuOpen,
    pathname,
    closeMenu,
    headerRef,
    isCompact,
    submenuRef,
    toggleMenu,
    blurSubmenu,
    submenuOpen,
    enterSubmenu,
    leaveSubmenu,
    navigationRef,
    menuButtonRef,
    toggleSubmenu,
    palindromeLinkRef,
    submenuButtonRef,
  } = useHeader();
  const themeLabel = theme === `dark` ? `Switch to Light Mode` : `Switch to Dark Mode`;

  const renderNavigationLink = (item: (typeof navigationItems)[number], index: number, submenu = false) => {
    const linkId = `navigation-${submenu ? `palindromes-` : ``}${item.key}`;
    const category = palindromeCategories.some((entry) => entry.key === item.key);
    return (
      <Link key={linkId} href={landingLinks[item.key]} asChild>
        <WebAnchor
          id={linkId}
          onClick={() => closeMenu()}
          style={{ '--navigation-index': index } as CSSProperties}
          ref={item.key === `palindromes` ? palindromeLinkRef : undefined}
          aria-current={pathname === landingLinks[item.key].pathname ? `page` : undefined}
          className={`navigation-link${submenu ? ` navigation-submenu-link` : category ? ` navigation-category-link` : ``}`}
        >
          <FlipContent id={`${linkId}-content`}>
            <span id={`${linkId}-icon`} className='navigation-item-icon'><Icon size={17} name={item.icon} color={`var(--${item.iconColor})`} /></span>
            <span id={`${linkId}-label`} className='navigation-item-label'>{item.label}</span>
          </FlipContent>
          <span id={`${linkId}-arrow`} className='navigation-item-arrow'><Icon size={15} name='right' color={`var(--${item.iconColor})`} /></span>
        </WebAnchor>
      </Link>
    );
  };

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
              <Icon fill={`currentColor`} name={theme === `dark` ? `sun` : `moon`} size={19} />
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
                <Icon size={17} name='login' color={theme === `dark` ? palette.searchInk : palette.lime} /><span>Sign in</span>
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
              {navigationItems.map((item, index) => item.key === `palindromes` ? (
                <div
                  key={item.key}
                  ref={submenuRef}
                  onBlur={blurSubmenu}
                  onPointerEnter={enterSubmenu}
                  onPointerLeave={leaveSubmenu}
                  id='navigation-palindromes-group'
                  className='navigation-palindromes'
                >
                  {renderNavigationLink(item, index)}
                  <button
                    type='button'
                    ref={submenuButtonRef}
                    onClick={toggleSubmenu}
                    aria-expanded={submenuOpen}
                    id='navigation-palindromes-toggle'
                    className='navigation-submenu-toggle'
                    aria-label='Toggle Palindrome Categories'
                    aria-controls='navigation-palindromes-submenu'
                  >
                    <Icon size={14} name='chevron' />
                  </button>
                  <div
                    inert={!isCompact || !submenuOpen}
                    id='navigation-palindromes-submenu'
                    aria-hidden={!isCompact || !submenuOpen}
                    className={`navigation-submenu${submenuOpen ? ` is-open` : ``}`}
                  >
                    {palindromeCategories.map((category, categoryIndex) => renderNavigationLink(category, categoryIndex, true))}
                  </div>
                </div>
              ) : renderNavigationLink(item, index))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
