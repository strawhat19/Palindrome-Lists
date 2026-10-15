import { Link, type Href } from 'expo-router';
import { Text, View, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../Icon';
import AccountReports from '../AccountReports';
import createStyles from './styles.native';
import useAccountPage from './useAccountPage';
import { useTheme } from '../../shared/themeContext/useTheme';
import { accountPages, type AccountPageKey } from '../../shared/account/navigation';

const AccountPageView = ({ page }: { page: AccountPageKey }) => {
  const state = useAccountPage(page);
  const { theme, palette, toggleTheme } = useTheme();
  const styles = createStyles(palette);
  const action = (href: Href, label: string) => <Link href={href} asChild><Pressable accessibilityRole='link' style={styles.button}><Text style={styles.buttonText}>{label}</Text></Pressable></Link>;
  return <SafeAreaView style={styles.safe}>
    <ScrollView stickyHeaderIndices={[0]}>
      <View style={styles.header}>{action(`/`, `Palindrome Lists`)}<Pressable onPress={toggleTheme} accessibilityRole='button' accessibilityLabel={`Switch to ${theme === `dark` ? `Light` : `Dark`} Mode`}><Icon name={theme === `dark` ? `sun` : `moon`} color={palette.action} /></Pressable></View>
      <View nativeID={`account-${page}`} style={styles.body}>
        <Text style={styles.eyebrow}>ACCOUNT LAYOUT PREVIEW</Text>
        <View style={styles.nav}>{Object.entries(accountPages).map(([key, item]) => <Link key={key} href={item.path as Href} asChild><Pressable nativeID={`account-nav-${key}`} accessibilityRole='link' accessibilityState={{ selected: page === key }} style={styles.button}><Icon name={item.icon} size={16} color={palette.leaf} /><Text style={styles.buttonText}>{item.label}</Text></Pressable></Link>)}</View>
        <Text accessibilityRole='header' style={styles.title}>{state.page.title}</Text>
        <View style={styles.card}><Text style={styles.subtitle}>Sign in to view this</Text><Text style={styles.text}>Firebase is not connected. No accounts, activity, or reports are loaded. A layout preview does not sign you in or grant an Owner role.</Text><View style={styles.nav}>{action(`/signin`, `Sign In`)}{action(`/signup`, `Sign Up`)}</View><Pressable accessibilityRole='button' accessibilityState={{ expanded: state.preview }} onPress={() => state.setPreview(!state.preview)} style={styles.button}><Text style={styles.buttonText}>{state.preview ? `Hide Layout Preview` : `Preview Layout`}</Text></Pressable></View>
        {state.preview && <View style={styles.card}><Text style={styles.eyebrow}>DESIGN ONLY · NOT CONNECTED</Text>
          {page === `profile` ? <><View style={styles.avatar}><Text style={styles.subtitle}>?</Text></View><Text style={styles.muted}>Your avatar or name initial will appear after sign-in.</Text><Text style={styles.text}>Display name</Text><TextInput editable={false} accessibilityLabel='Display Name, Available After Sign In' placeholder='Available after sign-in' placeholderTextColor={palette.muted} style={styles.field} /><Text style={styles.text}>Email address</Text><TextInput editable={false} accessibilityLabel='Email Address, Available After Sign In' placeholder='Available after sign-in' placeholderTextColor={palette.muted} style={styles.field} /><Text style={styles.text}>Profile: Private by default</Text><Text style={styles.text}>Role: Not assigned</Text><Text style={styles.text}>Joined: Unavailable</Text><Text style={styles.muted}>Saving profile changes is unavailable until connected.</Text><View style={styles.nav}>{[`Export Data`, `Delete Account`].map((label) => <Pressable key={label} disabled accessibilityRole='button' accessibilityState={{ disabled: true }} style={styles.button}><Text style={styles.muted}>{label} · Unavailable</Text></Pressable>)}</View><Text style={styles.muted}>No deletion or export request is sent.</Text></>
          : page === `favorites` ? <><Text style={styles.subtitle}>Saved discoveries</Text><Text style={styles.text}>Favorites cannot load until your account and Firestore are connected.</Text>{action(`/palindromes`, `Browse Palindromes`)}</>
          : page === `submissions` ? <><Text style={styles.subtitle}>Your contributions</Text><Text style={styles.text}>Future submissions will show their moderation status here. No records have been loaded.</Text>{action(`/submit`, `Try Draft Checker`)}</>
          : page === `analytics` ? <AccountReports /> : <>{page === `dashboard` && <AccountReports compact />}<Text style={styles.subtitle}>Collection overview</Text>{[`Users`, `Pending submissions`, `Published entries`].map((label) => <View key={label}><Text style={styles.text}>{label}: —</Text><Text style={styles.muted}>Not connected</Text></View>)}<Text style={styles.text}>No sample records or simulated analytics. Future owner data requires trusted server authorization.</Text><View nativeID='account-moderation-preview' style={styles.card}><Text style={styles.subtitle}>Submission review</Text><Text style={styles.muted}>No records loaded. A future record shows its number, palindrome, category, status, and permitted actions.</Text><TextInput editable={false} accessibilityLabel='Search Submissions, Not Connected' placeholder='Search unavailable' placeholderTextColor={palette.muted} style={styles.field} /><Pressable disabled accessibilityRole='button' accessibilityState={{ disabled: true }} style={styles.button}><Text style={styles.muted}>Review Submissions · Not Connected</Text></Pressable></View></>}
        </View>}
        <Text style={styles.muted}>© {new Date().getFullYear()} Palindrome Lists</Text>{action(`https://piratechs.com/`, `Piratechs`)}
      </View>
    </ScrollView>
  </SafeAreaView>;
};
const AccountPage = ({ page = `profile` }: { page?: AccountPageKey }) => <AccountPageView key={page} page={page} />;
export default AccountPage;
