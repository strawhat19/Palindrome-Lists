import Icon from '../Icon';
import PalindromeCard from '../PalindromeCard/index.web';
import type { Palindrome } from '../../shared/landing/types';
import usePalindromeCarousel from './usePalindromeCarousel.web';
import './styles.scss';

type PalindromeCarouselProps = {
  entries: Palindrome[];
};

const PalindromeCarousel = ({ entries }: PalindromeCarouselProps) => {
  const {
    move,
    onWheel,
    dragging,
    cycleRef,
    trackRef,
    onScroll,
    onKeyDown,
    onPointerUp,
    carouselRef,
    viewportRef,
    onPointerDown,
    onPointerMove,
    onClickCapture,
  } = usePalindromeCarousel(entries);

  return (
    <div
      role='region'
      ref={carouselRef}
      id='palindrome-carousel'
      aria-label='Featured Palindromes'
      aria-roledescription='carousel'
      className={`palindrome-carousel${dragging ? ` is-dragging` : ``}`}
    >
      <div
        tabIndex={0}
        ref={viewportRef}
        onWheel={onWheel}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerUp={onPointerUp}
        id='palindrome-carousel-viewport'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onClickCapture={onClickCapture}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onPointerUp}
        className='palindrome-carousel-viewport'
        aria-label='Palindrome Cards. Use the Left and Right Arrow Keys to Browse'
      >
        <div ref={trackRef} id='palindrome-carousel-track' className='palindrome-carousel-track'>
          {[0, 1, 2].map((groupIndex) => (
            <div
              key={groupIndex}
              data-carousel-group={groupIndex}
              aria-hidden={groupIndex !== 1}
              ref={groupIndex === 0 ? cycleRef : undefined}
              className='palindrome-carousel-group'
              id={`palindrome-carousel-group-${groupIndex}`}
            >
              {entries.map((entry, index) => (
                <div
                  role='group'
                  key={`${entry.id}-${index}`}
                  data-type={entry.type}
                  data-carousel-slide={index}
                  aria-roledescription='slide'
                  className='palindrome-carousel-slide'
                  aria-label={`${index + 1} of ${entries.length}`}
                  id={`palindrome-carousel-slide-${entry.id}-${groupIndex}-${index}`}
                >
                  <PalindromeCard
                    entry={entry}
                    tabbable={groupIndex === 1}
                    instanceId={`${entry.id}-carousel-${groupIndex}-${index}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div id='palindrome-carousel-controls' className='palindrome-carousel-controls'>
        <button
          type='button'
          onClick={() => move(-1)}
          id='palindrome-carousel-previous'
          className='palindrome-carousel-button'
          aria-controls='palindrome-carousel-viewport'
        >
          <span id='palindrome-carousel-previous-icon' className='palindrome-carousel-previous-icon'>
            <Icon name='right' size={15} />
          </span>
          <span id='palindrome-carousel-previous-label'>Previous</span>
        </button>
        <button
          type='button'
          onClick={() => move(1)}
          id='palindrome-carousel-next'
          className='palindrome-carousel-button'
          aria-controls='palindrome-carousel-viewport'
        >
          <Icon name='right' size={15} />
          <span id='palindrome-carousel-next-label'>Next</span>
        </button>
      </div>
    </div>
  );
};

export default PalindromeCarousel;
