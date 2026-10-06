import { Link } from 'expo-router';
import Icon from '../Icon';
import HalfTurnLogo from '../HalfTurnLogo';
import PageMetadata from '../PageMetadata';
import createStyles from './styles.native';
import { landingLinks } from '../../shared/routes';
import { useTheme } from '../../shared/themeContext/useTheme';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotFoundPage = () => {
  const { palette } = useTheme();
  const styles = createStyles(palette);

  return (
    <SafeAreaView nativeID='not-found-page' style={styles.page}>
      <PageMetadata page='not-found' />
      <ScrollView nativeID='not-found-main' contentContainerStyle={styles.content}>
        <View nativeID='not-found-brand' style={styles.brand}>
          <HalfTurnLogo id='not-found-logo' size={42} />
          <Text nativeID='not-found-brand-name' style={styles.brandName}>Palindrome Lists</Text>
        </View>
        <Text nativeID='not-found-eyebrow' style={styles.eyebrow}>404 · A wrong turn</Text>
        <Text nativeID='not-found-title' style={styles.title} accessibilityRole='header'>Let’s turn that around.</Text>
        <Text nativeID='not-found-description' style={styles.copy}>This page couldn’t be found. There are still plenty of good words to explore.</Text>
        <Link href={landingLinks.home} asChild>
          <Pressable nativeID='not-found-home' style={styles.link} accessibilityRole='link'>
            <Text nativeID='not-found-home-label' style={styles.linkText}>Back to Palindrome Lists</Text>
            <Icon name='right' size={16} color={palette.action} />
          </Pressable>
        </Link>
        <Text nativeID='not-found-copyright' style={styles.copy}>© {new Date().getFullYear()} Palindrome Lists.</Text>
        <Link href='https://piratechs.com/' asChild>
          <Pressable nativeID='not-found-piratechs' style={styles.link} accessibilityRole='link'>
            <Text nativeID='not-found-piratechs-label' style={styles.linkText}>Made by Piratechs</Text>
            <Icon name='external' size={13} color={palette.action} />
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotFoundPage;
