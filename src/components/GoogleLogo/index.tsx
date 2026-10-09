import { Image } from 'react-native';

const GoogleLogo = () => (
  <Image
    accessible={false}
    resizeMode='contain'
    style={{ width: 18, height: 18 }}
    source={require('../../../assets/brand/google-g.png')}
  />
);

export default GoogleLogo;
