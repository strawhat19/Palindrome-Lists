import { Link } from 'expo-router';
import Icon from '../Icon';
import HalfTurnLogo from '../HalfTurnLogo';
import FlipContent from '../FlipContent/index.web';
import WebAnchor from '../WebAnchor/index.web';
import { landingLinks, footerNavigation } from '../../shared/routes';
import './styles.scss';

type FooterProps = { onHome?: () => void };

const Footer = ({ onHome }: FooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer id='site-footer' className='site-footer'>
      <div id='footer-inner' className='landing-container footer-inner'>
        <div id='footer-top' className='footer-top'>
          <Link href={landingLinks.home} asChild>
            <WebAnchor id='footer-brand' className='footer-brand' onClick={onHome}>
              <span id='footer-logo-orbit' className='footer-logo-orbit'>
                <HalfTurnLogo id='footer-half-turn-logo' size={28} />
              </span>
              <FlipContent id='footer-brand-content'>Palindrome Lists</FlipContent>
            </WebAnchor>
          </Link>
          <nav id='footer-navigation' className='footer-navigation' aria-label='Footer Navigation'>
            {footerNavigation.map((item) => (
              <Link key={item.key} href={landingLinks[item.key]} asChild>
                <WebAnchor id={`footer-${item.key}`} className='footer-navigation-link'>
                  <FlipContent id={`footer-${item.key}-content`}>{item.label}</FlipContent>
                </WebAnchor>
              </Link>
            ))}
          </nav>
        </div>
        <div id='footer-bottom' className='footer-bottom'>
          <p id='copyright' className='copyright'>© {year} Palindrome Lists. All rights reserved.</p>
          <a
            id='piratechs-link'
            rel='noopener noreferrer'
            target='_blank'
            className='piratechs-link'
            href='https://piratechs.com/'
            aria-label='Made by Piratechs, Opens in a New Tab'
          >
            <FlipContent id='piratechs-link-content'>
              <span>Made by Piratechs</span><Icon name='external' size={12} />
            </FlipContent>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
