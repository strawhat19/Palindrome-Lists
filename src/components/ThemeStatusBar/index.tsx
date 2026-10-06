import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../shared/themeContext/useTheme';

const ThemeStatusBar = () => {
  const { theme } = useTheme();

  return <StatusBar style={theme === `dark` ? `light` : `dark`} />;
};

export default ThemeStatusBar;
