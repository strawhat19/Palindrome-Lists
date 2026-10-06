import { useEffect, useRef, useState } from 'react';
import { heroPhrases, heroPhraseDuration } from './phrases';
import { Animated, AppState, Easing, AccessibilityInfo } from 'react-native';

const useHeroHeadline = (visible: boolean, reducedMotion?: boolean) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const [systemReducedMotion, setSystemReducedMotion] = useState(true);
  const motionDisabled = reducedMotion ?? systemReducedMotion;

  useEffect(() => {
    if (reducedMotion !== undefined) return;
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setSystemReducedMotion(enabled);
    }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setSystemReducedMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let currentIndex = 0;
    let active = AppState.currentState === `active`;
    let disposed = false;
    let animation: Animated.CompositeAnimation | undefined;
    const clearTimer = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };
    const queuePhrase = () => {
      clearTimer();
      if (!visible || motionDisabled || !active || disposed) return;
      timer = setTimeout(() => {
        animation = Animated.timing(progress, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        });
        animation.start(({ finished }) => {
          if (!finished || disposed) return;
          currentIndex = (currentIndex + 1) % heroPhrases.length;
          setIndex(currentIndex);
          progress.setValue(-1);
          animation = Animated.timing(progress, {
            toValue: 0,
            duration: 580,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          });
          animation.start(({ finished: complete }) => {
            if (complete && !disposed) queuePhrase();
          });
        });
      }, heroPhraseDuration);
    };

    setIndex(0);
    progress.setValue(0);
    queuePhrase();
    const subscription = AppState.addEventListener(`change`, (state) => {
      active = state === `active`;
      clearTimer();
      animation?.stop();
      progress.setValue(0);
      if (active) queuePhrase();
    });

    return () => {
      disposed = true;
      clearTimer();
      subscription.remove();
      animation?.stop();
      progress.setValue(0);
    };
  }, [visible, motionDisabled, progress]);

  return { index, progress };
};

export default useHeroHeadline;
