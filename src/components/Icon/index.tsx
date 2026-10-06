import { Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const iconPaths = {
  up: `m6 11 6-6 6 6M12 5v14`,
  down: `m6 13 6 6 6-6M12 5v14`,
  right: `M4 12h16m-6-6 6 6-6 6`,
  close: `m6 6 12 12M6 18 18 6`,
  check: `m5 12 4 4L19 6`,
  menu: `M4 6h16M4 12h16M4 18h16`,
  sun: `M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4`,
  moon: `M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z`,
  chevron: `m6 9 6 6 6-6`,
  save: `M6 3h12v18l-6-4-6 4z`,
  copy: `M8 8h13v13H8zM16 8V3H3v13h5`,
  share: `M12 16V3m-4 4 4-4 4 4M7 10H4v11h16V10h-3`,
  code: `m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16`,
  search: `m16 16 5 5`,
  info: `M12 11v6m0-10v.01`,
  mail: `M3 5h18v14H3zM3 5l9 7 9-7`,
  repeat: `m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3`,
  external: `M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6`,
  book: `M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3z`,
  comment: `M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z`,
  heart: `M20.8 4.8a5.1 5.1 0 0 0-7.2 0L12 6.4l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21l8.8-9a5.1 5.1 0 0 0 0-7.2Z`,
} as const;

export type IconName = keyof typeof iconPaths;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

const Icon = ({ name, size = 18, color = `currentColor` }: IconProps) => (
  <Svg
    fill='none'
    width={size}
    height={size}
    stroke={color}
    strokeWidth={1.7}
    strokeLinecap='round'
    strokeLinejoin='round'
    viewBox='0 0 24 24'
    aria-hidden={Platform.OS === `web` ? true : undefined}
    accessible={Platform.OS === `web` ? undefined : false}
  >
    {name === `search` && <Circle r={6.5} cx={10.5} cy={10.5} />}
    {name === `info` && <Circle r={9} cx={12} cy={12} />}
    {name === `sun` && <Circle r={4} cx={12} cy={12} />}
    <Path d={iconPaths[name]} />
  </Svg>
);

export default Icon;
