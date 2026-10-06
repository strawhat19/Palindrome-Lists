import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, type RefObject } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.motion.scss';

const interactiveSelector = `a, button, summary`;

const useLandingMotion = (rootRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(SplitText, ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(`(prefers-reduced-motion: no-preference)`, (motionContext) => {
        let cardsFrame = 0;
        let refreshFrame = 0;
        const seenCards = new Set<string>();
        const hovered = new Set<HTMLElement>();
        const collection = root.querySelector<HTMLElement>(`#collection`);
        const reveals = new Map<HTMLElement, gsap.core.Tween>();
        const flips = new Map<HTMLElement, gsap.core.Tween>();
        const finePointer = window.matchMedia(`(hover: hover) and (pointer: fine)`);

        const isInViewport = (element: HTMLElement) => {
          const bounds = element.getBoundingClientRect();
          return bounds.bottom > 0 && bounds.top < window.innerHeight;
        };

        const revealTrigger = (element: HTMLElement): ScrollTrigger.Vars | undefined => {
          // Visible content enters immediately; a start clamped to zero can wait for the first scroll.
          if (isInViewport(element)) return;

          return {
            once: true,
            trigger: element,
            start: `top bottom`,
            onRefresh: (trigger) => {
              const animation = trigger.animation;
              if (animation && animation.progress() < 1 && isInViewport(element)) animation.play();
            },
          };
        };

        const requestRefresh = () => {
          if (refreshFrame) return;
          refreshFrame = window.requestAnimationFrame(() => {
            refreshFrame = 0;
            ScrollTrigger.refresh();
          });
        };

        root.querySelectorAll<HTMLElement>(`[data-split]`).forEach((heading, index) => {
          const hero = heading.dataset.split === `hero`;
          const headingId = heading.id || `landing-heading-${index}`;
          SplitText.create(heading, {
            tag: `span`,
            aria: `auto`,
            mask: `lines`,
            autoSplit: true,
            linesClass: `motion-line`,
            wordsClass: `motion-word`,
            charsClass: `motion-char`,
            type: hero ? `lines, words, chars` : `lines, words`,
            onSplit: (split) => {
              const parts = [
                [`char`, split.chars],
                [`line`, split.lines],
                [`mask`, split.masks],
                [`word`, split.words],
              ] as const;
              parts.forEach(([kind, elements]) => {
                elements.forEach((element, partIndex) => {
                  element.id = `${headingId}-motion-${kind}-${partIndex}`;
                });
              });
              requestRefresh();

              return gsap.from(hero ? split.chars : split.words, {
                opacity: 0,
                yPercent: 105,
                delay: hero ? .12 : 0,
                duration: hero ? .9 : .8,
                ease: `power3.out`,
                rotationX: hero ? -16 : 0,
                stagger: { amount: hero ? .32 : .2 },
                clearProps: `transform,opacity`,
                scrollTrigger: revealTrigger(heading),
              });
            },
          });
        });

        const reveal = (element: HTMLElement, delay = 0) => {
          const spinningHero = element.id === `hero-logo-orbit`;
          const tween = gsap.from(element, {
            delay,
            opacity: 0,
            duration: .8,
            ease: `power3.out`,
            ...(spinningHero ? {} : { y: element.dataset.reveal === `hero` ? 16 : 24 }),
            clearProps: spinningHero ? `opacity` : `transform,opacity`,
            scrollTrigger: revealTrigger(element),
          });
          reveals.set(element, tween);
        };

        const groupIndices = new Map<string, number>();
        root.querySelectorAll<HTMLElement>(`[data-reveal]:not([data-reveal='card'])`).forEach((element) => {
          const group = element.dataset.reveal ?? `section`;
          const index = groupIndices.get(group) ?? 0;
          groupIndices.set(group, index + 1);
          reveal(element, (index % 3) * .07);
        });

        const headerLogo = root.querySelector<HTMLElement>(`#header-logo-orbit`);
        if (headerLogo) {
          const rotation = gsap.fromTo(headerLogo, { rotation: 0 }, {
            ease: `none`,
            rotation: () => ScrollTrigger.maxScroll(window) * .25,
            scrollTrigger: {
              start: 0,
              end: `max`,
              scrub: .7,
              invalidateOnRefresh: true,
            },
          });
          rotation.progress(rotation.scrollTrigger?.progress ?? 0);
        }

        const footerLogo = root.querySelector<HTMLElement>(`#footer-logo-orbit`);
        if (footerLogo) {
          gsap.to(footerLogo, {
            rotation: 360,
            repeat: -1,
            duration: 12,
            ease: `none`,
          });
        }

        const syncCards = () => {
          reveals.forEach((tween, element) => {
            if (element.dataset.reveal === `card` && !collection?.contains(element)) {
              tween.revert();
              reveals.delete(element);
            }
          });
          flips.forEach((tween, rotor) => {
            if (!root.contains(rotor)) {
              tween.revert();
              flips.delete(rotor);
            }
          });
          hovered.forEach((control) => {
            if (!root.contains(control)) hovered.delete(control);
          });
          collection?.querySelectorAll<HTMLElement>(`[data-reveal='card']`).forEach((card, index) => {
            if (seenCards.has(card.id)) return;
            seenCards.add(card.id);
            reveal(card, (index % 2) * .08);
          });
          requestRefresh();
        };
        syncCards();

        const cardObserver = new MutationObserver(() => {
          if (cardsFrame) return;
          cardsFrame = window.requestAnimationFrame(() => {
            cardsFrame = 0;
            motionContext.add(syncCards);
          });
        });
        if (collection) {
          cardObserver.observe(collection, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: [`hidden`],
          });
        }
        const sizeObserver = typeof ResizeObserver === `undefined`
          ? null
          : new ResizeObserver(requestRefresh);
        sizeObserver?.observe(root);

        const getControl = (target: EventTarget | null) => {
          const control = target instanceof Element
            ? target.closest<HTMLElement>(interactiveSelector)
            : null;
          return control && root.contains(control) && !control.matches(`:disabled`) ? control : null;
        };

        const flip = (control: HTMLElement, active: boolean) => {
          const rotor = control.querySelector<HTMLElement>(`[data-flip-content] > [data-flip-rotor]`);
          if (!rotor) return;
          motionContext.add(() => {
            let tween = flips.get(rotor);
            if (!tween) {
              tween = gsap.to(rotor, {
                paused: true,
                duration: .48,
                rotationX: -180,
                ease: `power3.inOut`,
              });
              flips.set(rotor, tween);
            }
            if (active) tween.play();
            else tween.reverse();
          });
        };

        const pointer = (event: PointerEvent, active: boolean) => {
          if (event.pointerType === `touch` || !finePointer.matches) return;
          const control = getControl(event.target);
          if (!control || (event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) return;
          if (active) hovered.add(control);
          else hovered.delete(control);
          flip(control, active || control.contains(document.activeElement));
        };
        const onPointerOver = (event: PointerEvent) => pointer(event, true);
        const onPointerOut = (event: PointerEvent) => pointer(event, false);
        const onFocusIn = (event: FocusEvent) => {
          let element = event.target instanceof Element ? event.target : null;
          while (element && root.contains(element)) {
            if (element instanceof HTMLElement) reveals.get(element)?.progress(1);
            element = element.parentElement;
          }
          const control = getControl(event.target);
          if (control) flip(control, true);
        };
        const onFocusOut = (event: FocusEvent) => {
          const control = getControl(event.target);
          if (!control || (event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) return;
          flip(control, hovered.has(control));
        };

        root.addEventListener(`focusin`, onFocusIn);
        root.addEventListener(`focusout`, onFocusOut);
        root.addEventListener(`pointerover`, onPointerOver);
        root.addEventListener(`pointerout`, onPointerOut);

        return () => {
          cardObserver.disconnect();
          sizeObserver?.disconnect();
          window.cancelAnimationFrame(cardsFrame);
          window.cancelAnimationFrame(refreshFrame);
          root.removeEventListener(`focusin`, onFocusIn);
          root.removeEventListener(`focusout`, onFocusOut);
          root.removeEventListener(`pointerover`, onPointerOver);
          root.removeEventListener(`pointerout`, onPointerOut);
          reveals.clear();
          flips.clear();
          hovered.clear();
        };
      }, root);
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, [rootRef]);
};

export default useLandingMotion;
