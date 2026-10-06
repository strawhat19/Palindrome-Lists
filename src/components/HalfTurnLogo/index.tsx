import Svg, { Defs, G, Path, Use } from 'react-native-svg';
import { palette } from '../../styles/theme/theme';

type HalfTurnLogoProps = {
  id: string;
  size?: number;
};

const HalfTurnLogo = ({ id, size = 48 }: HalfTurnLogoProps) => {
  const pairId = `${id}-pair`;

  return (
    <Svg
      width={size}
      height={size}
      nativeID={id}
      viewBox='0 0 320 320'
      accessibilityRole='image'
      accessibilityLabel='Palindrome Lists, pink P letters and lime L letters'
    >
      <Defs>
        <G id={pairId}>
          <Path
            fill={palette.pink}
            fillRule='evenodd'
            d='M58 48H150V118H82V146H58ZM82 72V94H126V72Z'
          />
          <Path
            fill={palette.lime}
            d='M174 48H198V122H262V146H174Z'
          />
        </G>
      </Defs>
      <Use href={`#${pairId}`} />
      <Use
        href={`#${pairId}`}
        transform='matrix(-1 0 0 -1 320 320)'
      />
    </Svg>
  );
};

export default HalfTurnLogo;
