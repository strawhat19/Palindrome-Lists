import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, type RefObject } from 'react';
import { heroPhraseDuration } from './phrases';

const useHeroHeadline = (
  headingRef: RefObject<HTMLHeadingElement | null>,
  visible: boolean,
  reducedMotion: boolean,
) => {
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || reducedMotion || !visible) return;

    gsap.registerPlugin(SplitText);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(`(prefers-reduced-motion: no-preference)`, (motionContext) => {
        let timer = 0;
        let currentIndex = 0;
        let inView = true;
        let introComplete = false;
        let transition: gsap.core.Timeline | null = null;
        const phrases = Array.from(heading.querySelectorAll<HTMLElement>(`[data-headline-phrase]`));
        const firstPhrase = phrases[0];
        if (!firstPhrase) return;

        const canPlay = () => inView && !document.hidden;
        const clearTimer = () => {
          window.clearTimeout(timer);
          timer = 0;
        };
        const queuePhrase = () => {
          clearTimer();
          if (!canPlay() || !introComplete || transition) return;
          timer = window.setTimeout(() => {
            motionContext.add(() => {
              const nextIndex = (currentIndex + 1) % phrases.length;
              const incoming = phrases[nextIndex];
              const outgoing = phrases[currentIndex];
              if (!incoming || !outgoing || !canPlay()) return;

              transition = gsap.timeline({
                onComplete: () => {
                  currentIndex = nextIndex;
                  transition = null;
                  queuePhrase();
                },
              });
              transition.to(outgoing, {
                autoAlpha: 0,
                yPercent: -12,
                rotationX: -70,
                duration: .48,
                ease: `power3.in`,
              });
              transition.fromTo(incoming, {
                autoAlpha: 0,
                yPercent: 12,
                rotationX: 70,
              }, {
                autoAlpha: 1,
                yPercent: 0,
                rotationX: 0,
                duration: .65,
                ease: `power3.out`,
              }, .28);
            });
          }, heroPhraseDuration);
        };

        gsap.set(phrases, { autoAlpha: 0 });
        gsap.set(firstPhrase, { autoAlpha: 1 });
        const introSplit = SplitText.create(firstPhrase, {
          tag: `span`,
          aria: `none`,
          type: `words, chars`,
          charsClass: `hero-headline-char`,
          wordsClass: `hero-headline-word`,
        });
        introSplit.chars.forEach((char, index) => { char.id = `hero-title-reveal-char-${index}`; });
        introSplit.words.forEach((word, index) => { word.id = `hero-title-reveal-word-${index}`; });
        const intro = gsap.from(introSplit.chars, {
          opacity: 0,
          yPercent: 80,
          rotationX: -16,
          delay: .12,
          duration: .9,
          ease: `power3.out`,
          stagger: { amount: .32 },
          clearProps: `transform,opacity`,
          onComplete: () => {
            introSplit.revert();
            introComplete = true;
            queuePhrase();
          },
        });

        const syncPlayback = () => {
          clearTimer();
          if (!canPlay()) {
            if (!introComplete) intro.pause();
            transition?.pause();
            return;
          }
          if (!introComplete) intro.resume();
          else if (transition) transition.resume();
          else queuePhrase();
        };
        const observer = typeof IntersectionObserver === `undefined`
          ? null
          : new IntersectionObserver(([entry]) => {
            inView = entry?.isIntersecting ?? false;
            syncPlayback();
          }, { threshold: .05 });
        observer?.observe(heading.closest(`#hero`) ?? heading);
        document.addEventListener(`visibilitychange`, syncPlayback);
        syncPlayback();

        return () => {
          clearTimer();
          observer?.disconnect();
          document.removeEventListener(`visibilitychange`, syncPlayback);
          introSplit.revert();
        };
      }, heading);
    }, heading);

    return () => {
      media.revert();
      context.revert();
    };
  }, [headingRef, visible, reducedMotion]);
};

export default useHeroHeadline;
