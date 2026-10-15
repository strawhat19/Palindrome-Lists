import '../src/styles/global.scss';
import { DeviceLibraryProvider } from '../src/shared/account/DeviceLibrary';
import { AccountProvider } from '../src/shared/account/AccountContext';
import { Slot } from 'expo-router';
import ThemeStatusBar from '../src/components/ThemeStatusBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LandingProvider } from '../src/shared/landing/LandingContext';
import { ThemeProvider } from '../src/shared/themeContext/ThemeContext';

const RootLayout = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <AccountProvider>
        <DeviceLibraryProvider>
          <LandingProvider>
            <ThemeStatusBar />
            <Slot />
          </LandingProvider>
        </DeviceLibraryProvider>
      </AccountProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default RootLayout;
