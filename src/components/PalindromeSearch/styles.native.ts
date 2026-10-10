import { StyleSheet } from 'react-native';
import type { ThemePalette } from '../../styles/theme/theme';

const createStyles = (palette: ThemePalette) => StyleSheet.create({
  search: { gap: 9, width: `100%`, minHeight: 40, borderWidth: 1, marginBottom: 24, borderRadius: 999, paddingVertical: 4, paddingRight: 4, paddingLeft: 13, alignItems: `center`, flexDirection: `row`, borderColor: palette.line, backgroundColor: palette.card },
  input: { flex: 1, minWidth: 0, fontSize: 12, paddingVertical: 5, color: palette.ink },
  button: { gap: 5, minHeight: 30, borderRadius: 999, paddingHorizontal: 12, alignItems: `center`, flexDirection: `row`, backgroundColor: palette.lime },
  buttonLabel: { fontSize: 11, fontWeight: `600`, color: palette.searchInk },
  pressed: { opacity: 0.65 },
});

export default createStyles;
