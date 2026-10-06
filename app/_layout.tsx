import '../src/styles/global.scss';
import { Slot } from 'expo-router';
import ThemeStatusBar from '../src/components/ThemeStatusBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LandingProvider } from '../src/shared/landing/LandingContext';
import { ThemeProvider } from '../src/shared/themeContext/ThemeContext';

const RootLayout = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <LandingProvider>
        <ThemeStatusBar />
        <Slot />
      </LandingProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default RootLayout;
