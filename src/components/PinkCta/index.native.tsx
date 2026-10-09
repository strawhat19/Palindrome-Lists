import Icon from '../Icon';
import { useMemo } from 'react';
import { Link } from 'expo-router';
import createStyles from './styles.native';
import type { PinkCtaProps } from './types';
import { useTheme } from '../../shared/themeContext/useTheme';
import { Text, View, Pressable, useWindowDimensions } from 'react-native';

const PinkCta = ({ id, href, copy, title, label, eyebrow, icon = `book` }: PinkCtaProps) => {
  const { palette } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View nativeID={id} style={styles.section}>
      <View nativeID={`${id}-decoration`} pointerEvents={`none`} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`} style={styles.decoration}>
        <View nativeID={`${id}-circle-left`} style={[styles.circle, styles.circleLeft]} />
        <View nativeID={`${id}-circle-right`} style={[styles.circle, styles.circleRight]} />
        <Text nativeID={`${id}-word-level`} style={styles.word}>level</Text>
      </View>
      <View nativeID={`${id}-inner`} style={[styles.inner, width >= 1000 && styles.wideInner, width < 620 && styles.smallInner]}>
        <View nativeID={`${id}-content`} style={styles.content}>
          <View nativeID={`${id}-eyebrow-row`} style={styles.eyebrowRow}>
            <Icon name={`repeat`} size={15} color={`#000000`} />
            <Text nativeID={`${id}-eyebrow`} style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
          </View>
          <Text nativeID={`${id}-title`} accessibilityRole={`header`} style={[styles.title, width < 620 && styles.smallTitle]}>{title}</Text>
          <Text nativeID={`${id}-copy`} style={styles.copy}>{copy}</Text>
        </View>
        <Link href={href} asChild>
          <Pressable accessibilityRole={`link`} nativeID={`${id}-button`} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Icon name={icon} size={18} color={`#000000`} />
            <Text nativeID={`${id}-button-label`} style={styles.buttonText}>{label}</Text>
            <Icon name={`right`} size={17} color={`#000000`} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default PinkCta;
