import { View, Text, Animated } from 'react-native';
import styles from './styles.native';
import type { HeroHeadlineProps } from './types';
import useHeroHeadline from './useHeroHeadline.native';
import { heroHeading, heroPhrases } from './phrases';
import { useTheme } from '../../shared/themeContext/useTheme';

const HeroHeadline = ({ visible = true, reducedMotion }: HeroHeadlineProps) => {
  const { palette } = useTheme();
  const { index, progress } = useHeroHeadline(visible, reducedMotion);
  const phrase = heroPhrases[index] ?? heroPhrases[0];
  const opacity = progress.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] });
  const rotation = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [`70deg`, `0deg`, `-70deg`],
  });

  return (
    <View
      accessible
      nativeID={`hero-title`}
      accessibilityRole={`header`}
      accessibilityLabel={heroHeading}
      style={styles.heading}
    >
      <Animated.View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility={`no-hide-descendants`}
        nativeID={`hero-headline-phrase-${index}`}
        style={{ opacity, transform: [{ perspective: 900 }, { rotateX: rotation }] }}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={.8}
          nativeID={`hero-headline-lead-${index}`}
          style={[styles.line, { color: palette.ink }]}
        >
          {phrase.lead.slice(0, -1)}
          <Text nativeID={`hero-headline-lead-period-${index}`} style={{ color: palette.lime }}>.</Text>
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={.8}
          nativeID={`hero-headline-accent-${index}`}
          style={[styles.line, { color: palette.accent }]}
        >
          {phrase.accent.slice(0, -1)}
          <Text nativeID={`hero-headline-accent-period-${index}`} style={{ color: palette.lime }}>.</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

export default HeroHeadline;
