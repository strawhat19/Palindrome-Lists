import { useRef, useState, useEffect } from 'react';
import type { Palindrome } from '../../shared/landing/types';
import type { MouseEvent, WheelEvent, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

const autoplayRampDuration = 240;
const autoplayPixelsPerSecond = 80;

type Drag = {
  x: number;
  left: number;
  time: number;
  lastX: number;
  moved: boolean;
  velocity: number;
  pointerId: number;
};

type Slide = {
  left: number;
  width: number;
  visible?: boolean;
  position?: number;
  element: HTMLElement;
};

type Navigation = {
  start: number;
  target: number;
  started: number;
};

const usePalindromeCarousel = (entries: Palindrome[]) => {
  const dirty = useRef(true);
  const position = useRef(0);
  const nativeLeft = useRef(0);
  const resumeAt = useRef(0);
  const momentum = useRef(0);
  const hovered = useRef(false);
  const focused = useRef(false);
  const dialogOpen = useRef(false);
  const cycleWidth = useRef(0);
  const reducedMotion = useRef(false);
  const viewportWidth = useRef(0);
  const drag = useRef<Drag | null>(null);
  const slides = useRef<Slide[]>([]);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const navigation = useRef<Navigation | null>(null);
  const cycleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const pauseInteraction = () => {
    momentum.current = 0;
    navigation.current = null;
    resumeAt.current = performance.now() + 2500;
  };

  const normalizePosition = () => {
    const width = cycleWidth.current;
    if (!width) return;

    const start = width - viewportWidth.current / 2;
    const offset = position.current - start;
    if (offset >= 0 && offset < width) return;

    const next = start + ((offset % width) + width) % width;
    const shift = next - position.current;
    position.current = next;
    if (drag.current) drag.current.left += shift;
    if (navigation.current) {
      navigation.current.start += shift;
      navigation.current.target += shift;
    }
  };

  const commitNativePosition = () => {
    const viewport = viewportRef.current;
    if (!viewport || Math.abs(nativeLeft.current - position.current) < .01) return;

    // Reconcile native scroll only at interaction boundaries; autoplay moves the track.
    viewport.scrollLeft = position.current;
    nativeLeft.current = viewport.scrollLeft;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${nativeLeft.current - position.current}px, 0, 0)`;
    }
  };

  const renderPosition = () => {
    const track = trackRef.current;
    if (!track) return;

    const width = viewportWidth.current;
    const center = position.current + width / 2;
    track.style.transform = `translate3d(${nativeLeft.current - position.current}px, 0, 0)`;
    slides.current.forEach((slide) => {
      const distance = slide.left + slide.width / 2 - center;
      const visible = Math.abs(distance) < width / 2 + slide.width;
      const style = slide.element.style;
      if (!visible) {
        if (slide.visible !== false) {
          style.visibility = `hidden`;
          style.willChange = `auto`;
          slide.visible = false;
          slide.position = undefined;
        }
        return;
      }

      if (!slide.visible) {
        style.visibility = `visible`;
        style.willChange = reducedMotion.current ? `auto` : `transform, opacity`;
        slide.visible = true;
      }
      const reach = Math.max(width * .52, slide.width * 1.35);
      const nextPosition = Math.max(-1, Math.min(1, distance / reach));
      if (slide.position === nextPosition && !dirty.current) return;
      slide.position = nextPosition;

      if (reducedMotion.current) {
        style.opacity = `1`;
        style.zIndex = `1`;
        style.transform = `none`;
        if (style.willChange !== `auto`) style.willChange = `auto`;
        return;
      }

      const progress = Math.abs(nextPosition);
      const featured = 1 - progress * progress * (3 - 2 * progress);
      const lift = (12 - featured * 24).toFixed(2);
      const depth = (-90 + featured * 90).toFixed(2);
      const scale = (.8 + featured * .2).toFixed(4);
      const rotation = (-nextPosition * 24).toFixed(2);
      style.opacity = `${(.66 + featured * .34).toFixed(4)}`;
      const stack = featured > .75 ? `2` : `1`;
      if (style.zIndex !== stack) style.zIndex = stack;
      if (style.willChange !== `transform, opacity`) style.willChange = `transform, opacity`;
      style.transform = `perspective(1100px) translate3d(0, ${lift}px, ${depth}px) rotateY(${rotation}deg) scale(${scale})`;
    });
    dirty.current = false;
  };

  const onScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const left = viewport.scrollLeft;
    const distance = left - nativeLeft.current;
    if (Math.abs(distance) < .01) return;

    nativeLeft.current = left;
    position.current += distance;
    pauseInteraction();
    const previousPosition = position.current;
    normalizePosition();
    const shift = position.current - previousPosition;
    if (shift) {
      // Keep native swipes in the middle copy without adding scroll work to autoplay.
      viewport.scrollLeft = left + shift;
      nativeLeft.current = viewport.scrollLeft;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${nativeLeft.current - position.current}px, 0, 0)`;
      }
    }
    dirty.current = true;
  };

  useEffect(() => {
    const cycle = cycleRef.current;
    const carousel = carouselRef.current;
    const viewport = viewportRef.current;
    if (!cycle || !carousel || !viewport) return;

    let frame = 0;
    let speed = 0;
    let visible = true;
    let previousTime = 0;
    let renderedPosition = Number.NaN;
    const motion = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const finePointer = window.matchMedia(`(hover: hover) and (pointer: fine)`);

    cycleWidth.current = 0;
    const measure = () => {
      const width = cycle.getBoundingClientRect().width;
      const nextViewportWidth = viewport.clientWidth;
      const previousWidth = cycleWidth.current;
      if (!width || (Math.abs(width - previousWidth) < .1 && nextViewportWidth === viewportWidth.current)) return;

      const previousCenter = position.current + viewportWidth.current / 2;
      const progress = previousWidth ? ((previousCenter % previousWidth) + previousWidth) % previousWidth / previousWidth : 0;
      slides.current = Array.from(viewport.querySelectorAll<HTMLElement>(`[data-carousel-slide]`)).map((element) => ({
        element,
        left: element.offsetLeft,
        width: element.offsetWidth,
      }));
      cycleWidth.current = width;
      viewportWidth.current = nextViewportWidth;
      const featuredSlide = slides.current[entries.length + Math.min(1, entries.length - 1)];
      const center = previousWidth || !featuredSlide
        ? width * (1 + progress)
        : featuredSlide.left + featuredSlide.width / 2;
      position.current = center - nextViewportWidth / 2;
      normalizePosition();
      commitNativePosition();
      dirty.current = true;
      renderPosition();
    };

    const updateMotion = () => {
      reducedMotion.current = motion.matches;
      momentum.current = 0;
      navigation.current = null;
      dirty.current = true;
    };
    const onPointerEnter = (event: PointerEvent) => {
      hovered.current = event.pointerType !== `touch` && finePointer.matches;
    };
    const onPointerLeave = () => { hovered.current = false; };
    const updateFocus = (target: EventTarget | null) => {
      focused.current = target instanceof Node && carousel.contains(target);
      dialogOpen.current = target instanceof Element && Boolean(target.closest(`dialog[open]`));
    };
    const onFocusIn = (event: FocusEvent) => updateFocus(event.target);
    const onFocusOut = (event: FocusEvent) => updateFocus(event.relatedTarget);
    updateMotion();
    updateFocus(document.activeElement);
    measure();

    const sizeObserver = typeof ResizeObserver === `undefined` ? null : new ResizeObserver(measure);
    const visibilityObserver = typeof IntersectionObserver === `undefined`
      ? null
      : new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); });
    sizeObserver?.observe(cycle);
    sizeObserver?.observe(viewport);
    visibilityObserver?.observe(carousel);
    window.addEventListener(`resize`, measure);
    motion.addEventListener(`change`, updateMotion);
    carousel.addEventListener(`pointerenter`, onPointerEnter);
    carousel.addEventListener(`pointerleave`, onPointerLeave);
    document.addEventListener(`focusin`, onFocusIn);
    document.addEventListener(`focusout`, onFocusOut);

    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      const interacting = drag.current || time < resumeAt.current || hovered.current || focused.current || dialogOpen.current;
      const canAnimate = visible && !document.hidden;
      const currentNavigation = navigation.current;

      if (canAnimate && currentNavigation) {
        const progress = Math.min((time - currentNavigation.started) / 450, 1);
        const eased = 1 - (1 - progress) ** 3;
        position.current = currentNavigation.start + (currentNavigation.target - currentNavigation.start) * eased;
        if (progress === 1) navigation.current = null;
        speed = 0;
      } else if (canAnimate && !reducedMotion.current && !drag.current && Math.abs(momentum.current) > .015) {
        const decay = Math.exp(-elapsed / 180);
        position.current += momentum.current * 180 * (1 - decay);
        momentum.current *= decay;
        speed = 0;
      } else if (canAnimate && !reducedMotion.current && !interacting) {
        const decay = Math.exp(-elapsed / autoplayRampDuration);
        position.current += (autoplayPixelsPerSecond * elapsed +
          (speed - autoplayPixelsPerSecond) * autoplayRampDuration * (1 - decay)) / 1000;
        speed = autoplayPixelsPerSecond + (speed - autoplayPixelsPerSecond) * decay;
        momentum.current = 0;
      } else {
        speed = 0;
        if (!canAnimate) momentum.current = 0;
      }

      normalizePosition();
      if (dirty.current || renderedPosition !== position.current) {
        renderPosition();
        renderedPosition = position.current;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      sizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener(`resize`, measure);
      motion.removeEventListener(`change`, updateMotion);
      carousel.removeEventListener(`pointerenter`, onPointerEnter);
      carousel.removeEventListener(`pointerleave`, onPointerLeave);
      document.removeEventListener(`focusin`, onFocusIn);
      document.removeEventListener(`focusout`, onFocusOut);
      cycleWidth.current = 0;
      viewportWidth.current = 0;
      momentum.current = 0;
      navigation.current = null;
      drag.current = null;
      slides.current = [];
    };
  }, [entries]);

  const move = (direction: number) => {
    pauseInteraction();
    const center = position.current + viewportWidth.current / 2;
    const centers = slides.current.map((slide) => slide.left + slide.width / 2);
    const target = direction > 0
      ? centers.find((left) => left > center + 2)
      : centers.reverse().find((left) => left < center - 2);
    if (target === undefined) return;

    const left = target - viewportWidth.current / 2;
    if (reducedMotion.current) {
      position.current = left;
      dirty.current = true;
    } else {
      navigation.current = { start: position.current, target: left, started: performance.now() };
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || ![`ArrowLeft`, `ArrowRight`].includes(event.key)) return;
    event.preventDefault();
    move(event.key === `ArrowRight` ? 1 : -1);
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    pauseInteraction();
    if (event.deltaX) commitNativePosition();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pauseInteraction();
    normalizePosition();
    commitNativePosition();
    suppressClick.current = false;
    if (event.pointerType !== `mouse` || event.button !== 0 || !event.isPrimary) return;
    if (event.target instanceof Element && event.target.closest(`a, button, input, select, textarea, summary`)) return;

    drag.current = {
      moved: false,
      velocity: 0,
      x: event.clientX,
      left: position.current,
      lastX: event.clientX,
      time: performance.now(),
      pointerId: event.pointerId,
    };
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const currentDrag = drag.current;
    if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

    const distance = event.clientX - currentDrag.x;
    if (!currentDrag.moved && Math.abs(distance) < 5) return;
    if (!currentDrag.moved) {
      currentDrag.moved = true;
      setDragging(true);
    }
    const time = performance.now();
    const elapsed = Math.max(time - currentDrag.time, 8);
    const velocity = (currentDrag.lastX - event.clientX) / elapsed;
    currentDrag.velocity = Math.max(-1.8, Math.min(1.8, currentDrag.velocity * .6 + velocity * .4));
    currentDrag.time = time;
    currentDrag.lastX = event.clientX;
    suppressClick.current = true;
    position.current = currentDrag.left - distance;
    dirty.current = true;
    event.preventDefault();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.type === `lostpointercapture` && drag.current?.pointerId !== event.pointerId) return;
    pauseInteraction();
    if (drag.current?.pointerId !== event.pointerId) return;

    if (drag.current.moved && !reducedMotion.current && event.type === `pointerup` && performance.now() - drag.current.time < 100) {
      momentum.current = drag.current.velocity;
    }
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    move,
    onWheel,
    dragging,
    cycleRef,
    trackRef,
    onScroll,
    onKeyDown,
    carouselRef,
    viewportRef,
    onPointerUp,
    onPointerDown,
    onPointerMove,
    onClickCapture,
  };
};

export default usePalindromeCarousel;
