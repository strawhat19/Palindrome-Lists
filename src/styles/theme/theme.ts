const lightPalette = {
  ink: `#232629`,
  page: `#FFFBFD`,
  card: `#FFFFFF`,
  soft: `#EFF7D8`,
  leaf: `#435722`,
  line: `#EADFE5`,
  lime: `#B6D94C`,
  pink: `#D64E8B`,
  muted: `#756A72`,
  accent: `#D64E8B`,
  action: `#B6316D`,
  searchInk: `#354713`,
  headerGlass: `rgba(255, 251, 253, .87)`,
} as const;

export type ThemeMode = `light` | `dark`;

export type ThemePalette = {
  [Key in keyof typeof lightPalette]: string;
};

export const themePalettes: Record<ThemeMode, ThemePalette> = {
  light: lightPalette,
  dark: {
    ink: `#F6EDF2`,
    page: `#181619`,
    card: `#242025`,
    soft: `#303521`,
    leaf: `#D4E89A`,
    line: `#443640`,
    lime: `#B6D94C`,
    pink: `#D64E8B`,
    muted: `#BFB1BC`,
    accent: `#F07AAF`,
    action: `#FF91BB`,
    searchInk: `#354713`,
    headerGlass: `rgba(24, 22, 25, .87)`,
  },
};

export const palette = themePalettes.light;
