import { Link } from 'expo-router';
import { Alert, Text, View, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '../AccountPage/styles.native';
import useSubmissionPage from './useSubmissionPage';
import { useTheme } from '../../shared/themeContext/useTheme';
const SubmissionPage = () => {
  const draft = useSubmissionPage();
  const { palette } = useTheme();
  const styles = createStyles(palette);
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps='handled'>
    <Link href='/' style={styles.buttonText}>Palindrome Lists</Link><Text accessibilityRole='header' style={styles.title}>Check your palindrome.</Text><Text style={styles.text}>Check an English A–Z word, name, or phrase locally. This does not check originality, attribution, or editorial suitability.</Text>
    <View style={styles.card}><Text style={styles.text}>Your palindrome</Text><TextInput nativeID='submission-text' accessibilityLabel='Your Palindrome' multiline maxLength={500} editable={draft.ready} value={draft.text} onChangeText={draft.setText} placeholder='Never odd or even' placeholderTextColor={palette.muted} style={[styles.field, { minHeight: 120 }]} /><Text style={styles.muted}>Spaces, capitalization, and common punctuation are ignored. Device-only draft; not sent to moderation.</Text><Pressable accessibilityRole='button' onPress={draft.check} style={styles.button}><Text style={styles.buttonText}>Check Draft</Text></Pressable><Pressable accessibilityRole='button' onPress={() => Alert.alert(`Clear draft?`, `Remove this device draft?`, [{ text: `Cancel`, style: `cancel` }, { text: `Clear`, style: `destructive`, onPress: draft.clear }])} style={styles.button}><Text style={styles.buttonText}>Clear Draft</Text></Pressable><Text accessibilityLiveRegion='polite' style={styles.text}>{draft.result?.message}</Text><Text style={styles.muted}>{draft.status}</Text></View>
    <Link href='/guidelines' style={styles.buttonText}>Submission Guidelines</Link><Link href='/submissions' style={styles.buttonText}>Your Submissions</Link>
  </ScrollView></SafeAreaView>;
};
export default SubmissionPage;
