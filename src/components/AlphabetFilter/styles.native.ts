import { StyleSheet } from 'react-native';
import type { ThemePalette } from '../../styles/theme/theme';

const createStyles = (palette: ThemePalette) => StyleSheet.create({
  filter: { marginTop: 18, marginBottom: 22 },
  buttons: { gap: 4, flexWrap: `wrap`, alignItems: `center`, flexDirection: `row` },
  button: { minWidth: 28, minHeight: 30, borderWidth: 1, borderRadius: 6, alignItems: `center`, justifyContent: `center`, borderColor: palette.line, backgroundColor: palette.card },
  allButton: { gap: 5, paddingHorizontal: 8, flexDirection: `row` },
  selectedButton: { borderColor: palette.lime, backgroundColor: palette.lime },
  label: { fontSize: 11, fontWeight: `600`, color: palette.ink },
  selectedLabel: { color: palette.searchInk },
  resultCount: { fontSize: 11, minHeight: 30, lineHeight: 30, marginLeft: `auto`, textAlign: `right`, color: palette.muted },
  resultNumber: { fontWeight: `600`, color: palette.pink },
  pressed: { opacity: 0.65 },
});

export default createStyles;
