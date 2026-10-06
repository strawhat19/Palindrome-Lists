import { useEffect, useMemo, useRef, useState } from 'react';
import { Easing, Animated, ScrollView, AccessibilityInfo } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import createStyles from './styles.native';
import { useTheme } from '../../shared/themeContext/useTheme';

const useContentPage = () => {
  const scrollRef = useRef<ScrollView>(null);
  const heroEnd = useRef(Infinity);
  const rotation = useRef(new Animated.Value(0)).current;
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const topOpacity = useRef(new Animated.Value(0)).current;
  const [beyondHero, setBeyondHero] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const { theme, palette, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReducedMotion(enabled);
    }).catch(() => {});
    const listener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => {
      active = false;
      listener.remove();
    };
  }, []);

  useEffect(() => {
    rotation.setValue(0);
    if (reducedMotion) return;
    const animation = Animated.loop(Animated.timing(rotation, {
      toValue: 1,
      duration: 12000,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: true,
    }));
    animation.start();
    return () => animation.stop();
  }, [rotation, reducedMotion]);

  useEffect(() => {
    const animation = Animated.timing(topOpacity, {
      toValue: beyondHero ? 1 : 0,
      duration: reducedMotion ? 0 : 180,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [beyondHero, topOpacity, reducedMotion]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = Math.max(0, event.nativeEvent.contentOffset.y);
    scrollProgress.setValue(offset);
    setBeyondHero(offset > heroEnd.current);
  };
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  const headerColor = scrollProgress.interpolate({
    inputRange: [0, 40],
    outputRange: [palette.page, palette.headerGlass],
    extrapolate: `clamp`,
  });
  const headerRotation = scrollProgress.interpolate({
    inputRange: [0, 1800],
    outputRange: [`0deg`, `360deg`],
    extrapolate: `extend`,
  });
  const footerRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: [`0deg`, `360deg`],
  });

  return {
    theme,
    styles,
    palette,
    heroEnd,
    scrollRef,
    topOpacity,
    beyondHero,
    headerColor,
    toggleTheme,
    scrollToTop,
    handleScroll,
    reducedMotion,
    headerRotation,
    footerRotation,
  };
};

export default useContentPage;
