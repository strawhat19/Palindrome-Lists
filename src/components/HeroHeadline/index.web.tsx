import { useRef } from 'react';
import type { HeroHeadlineProps } from './types';
import useHeroHeadline from './useHeroHeadline.web';
import { heroHeading, heroPhrases } from './phrases';
import './styles.scss';

const HeroHeadline = ({ visible = true, reducedMotion = false }: HeroHeadlineProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeroHeadline(headingRef, visible, reducedMotion);

  return (
    <h1
      tabIndex={-1}
      id='hero-title'
      ref={headingRef}
      className='hero-title'
    >
      <span id='hero-title-accessible' className='visually-hidden'>{heroHeading}</span>
      <span id='hero-headline-cycle' aria-hidden='true' className='hero-headline-cycle'>
        {heroPhrases.map((phrase, index) => (
          <span
            key={phrase.lead}
            data-headline-phrase
            id={`hero-headline-phrase-${index}`}
            className='hero-headline-phrase'
          >
            <span id={`hero-headline-lead-${index}`} className='hero-headline-lead'>{phrase.lead}</span>{` `}
            <span id={`hero-headline-accent-${index}`} className='hero-title-accent'>{phrase.accent}</span>
          </span>
        ))}
      </span>
    </h1>
  );
};

export default HeroHeadline;
