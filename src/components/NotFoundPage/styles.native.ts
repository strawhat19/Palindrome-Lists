import { StyleSheet } from 'react-native';
import type { ThemePalette } from '../../styles/theme/theme';

const createStyles = (palette: ThemePalette) => StyleSheet.create({
  page: { flex: 1, backgroundColor: palette.page },
  content: { gap: 22, padding: 26, maxWidth: 760, alignSelf: `center` },
  brand: { gap: 10, marginBottom: 36, alignItems: `center`, flexDirection: `row` },
  brandName: { fontSize: 17, color: palette.ink, fontWeight: `600` },
  eyebrow: { fontSize: 11, color: palette.action, letterSpacing: 1.5 },
  title: { fontSize: 36, lineHeight: 42, color: palette.ink, fontWeight: `600` },
  copy: { fontSize: 14, lineHeight: 26, color: palette.muted },
  link: { gap: 8, minHeight: 44, alignItems: `center`, flexDirection: `row` },
  linkText: { fontSize: 13, color: palette.action },
});

export default createStyles;
