import { StyleSheet } from 'react-native';
import type { ThemePalette } from '../../styles/theme/theme';
const createStyles = (palette: ThemePalette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.page },
  body: { padding: 22, gap: 22 },
  header: { flexDirection: `row`, alignItems: `center`, justifyContent: `space-between`, padding: 18, backgroundColor: palette.card },
  title: { fontSize: 34, fontWeight: `700`, color: palette.ink },
  subtitle: { fontSize: 23, fontWeight: `600`, color: palette.ink },
  text: { color: palette.ink, fontSize: 15, lineHeight: 24 },
  muted: { color: palette.muted, fontSize: 14, lineHeight: 22 },
  card: { backgroundColor: palette.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: palette.line, gap: 18 },
  nav: { flexDirection: `row`, flexWrap: `wrap`, gap: 10 },
  button: { minHeight: 44, padding: 12, borderRadius: 8, backgroundColor: palette.soft, flexDirection: `row`, alignItems: `center`, gap: 8 },
  buttonText: { color: palette.leaf, fontSize: 14 },
  field: { borderWidth: 1, borderColor: palette.line, borderRadius: 8, padding: 12, minHeight: 44, color: palette.muted },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: palette.soft, alignItems: `center`, justifyContent: `center` },
  eyebrow: { color: palette.action, fontSize: 12, lineHeight: 20 },
});
export default createStyles;
