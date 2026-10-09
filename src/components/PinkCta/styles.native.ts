import { StyleSheet } from 'react-native';
import type { ThemePalette } from '../../styles/theme/theme';

const createStyles = (palette: ThemePalette) => StyleSheet.create({
  section: { width: `100%`, marginTop: 56, overflow: `hidden`, backgroundColor: palette.pink },
  decoration: { ...StyleSheet.absoluteFillObject },
  circle: { width: 270, height: 270, borderWidth: 1, borderRadius: 135, position: `absolute`, borderColor: `rgba(255, 255, 255, 0.12)` },
  circleLeft: { top: -150, left: -100 },
  circleRight: { right: -100, bottom: -125, width: 340, height: 340, borderRadius: 170 },
  word: { right: 20, bottom: -30, fontSize: 120, fontWeight: `600`, position: `absolute`, color: `rgba(255, 255, 255, 0.06)`, letterSpacing: -6 },
  inner: { gap: 25, width: `100%`, maxWidth: 1164, alignSelf: `center`, alignItems: `flex-start`, paddingVertical: 48, paddingHorizontal: 22 },
  wideInner: { gap: 38, alignItems: `center`, flexDirection: `row`, justifyContent: `space-between` },
  smallInner: { paddingVertical: 35 },
  content: { gap: 12, maxWidth: 620, flexShrink: 1 },
  eyebrowRow: { gap: 8, alignItems: `center`, flexDirection: `row` },
  eyebrow: { fontSize: 10, lineHeight: 17, fontWeight: `600`, color: `#FFFFFF`, letterSpacing: 1.8 },
  title: { fontSize: 31, lineHeight: 39, fontWeight: `600`, color: `#FFFFFF`, letterSpacing: -1 },
  smallTitle: { fontSize: 26, lineHeight: 33, letterSpacing: -0.7 },
  copy: { fontSize: 13, lineHeight: 23, color: `#FFFFFF` },
  button: { gap: 9, minHeight: 52, borderRadius: 10, paddingHorizontal: 19, alignItems: `center`, flexDirection: `row`, justifyContent: `center`, backgroundColor: palette.lime },
  buttonText: { fontSize: 13, fontWeight: `600`, color: `#000000` },
  pressed: { opacity: 0.65 },
});

export default createStyles;
