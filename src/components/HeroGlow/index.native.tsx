import { Animated } from 'react-native';
import styles from './styles.native';
import { useTheme } from '../../shared/themeContext/useTheme';
import Svg, { G, Defs, Mask, Rect, Stop, LinearGradient, RadialGradient } from 'react-native-svg';

type HeroGlowProps = {
  progress: Animated.Value;
  reducedMotion: boolean;
};

const HeroGlow = ({ progress, reducedMotion }: HeroGlowProps) => {
  const { theme, palette } = useTheme();
  const lowOpacity = theme === `dark` ? 0.38 : 0.6;
  const highOpacity = theme === `dark` ? 0.62 : 0.9;
  const opacity = reducedMotion ? lowOpacity : progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [lowOpacity, highOpacity, lowOpacity],
  });

  return (
    <Animated.View
      accessible={false}
      pointerEvents={`none`}
      nativeID={`hero-background-glow`}
      accessibilityElementsHidden
      importantForAccessibility={`no-hide-descendants`}
      style={[styles.glow, { opacity }]}
    >
      <Svg
        width={`100%`}
        height={`100%`}
        accessible={false}
        viewBox={`0 0 1000 700`}
        nativeID={`hero-background-gradient`}
        preserveAspectRatio={`none`}
      >
        <Defs>
          <LinearGradient id={`hero-glow-fade`} x1={`0%`} y1={`0%`} x2={`0%`} y2={`100%`}>
            <Stop offset={`0%`} stopOpacity={0} stopColor={`#fff`} />
            <Stop offset={`30%`} stopOpacity={0} stopColor={`#fff`} />
            <Stop offset={`55%`} stopOpacity={0.3} stopColor={`#fff`} />
            <Stop offset={`100%`} stopOpacity={1} stopColor={`#fff`} />
          </LinearGradient>
          <Mask
            x={0}
            y={0}
            width={1000}
            height={700}
            maskType={`alpha`}
            id={`hero-glow-mask`}
            maskUnits={`userSpaceOnUse`}
          >
            <Rect width={1000} height={700} fill={`url(#hero-glow-fade)`} />
          </Mask>
          <RadialGradient id={`hero-pink-glow`} cx={`35%`} cy={`100%`} r={`72%`}>
            <Stop offset={`0%`} stopOpacity={0.4} stopColor={palette.pink} />
            <Stop offset={`100%`} stopOpacity={0} stopColor={palette.pink} />
          </RadialGradient>
          <RadialGradient id={`hero-lime-glow`} cx={`70%`} cy={`108%`} r={`76%`}>
            <Stop offset={`0%`} stopOpacity={0.48} stopColor={palette.lime} />
            <Stop offset={`100%`} stopOpacity={0} stopColor={palette.lime} />
          </RadialGradient>
        </Defs>
        <G mask={`url(#hero-glow-mask)`}>
          <Rect width={`100%`} height={`100%`} fill={`url(#hero-pink-glow)`} />
          <Rect width={`100%`} height={`100%`} fill={`url(#hero-lime-glow)`} />
        </G>
      </Svg>
    </Animated.View>
  );
};

export default HeroGlow;
