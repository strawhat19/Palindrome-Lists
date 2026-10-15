import { useState } from 'react';
import { Link } from 'expo-router';
import { Alert, Platform, Text, View, Pressable, TextInput } from 'react-native';
import createStyles from '../AccountPage/styles.native';
import { useTheme } from '../../shared/themeContext/useTheme';
import { palindromes } from '../../shared/landing/data';
import { useDeviceLibrary } from '../../shared/account/DeviceLibrary';
import type { AccountPageKey } from '../../shared/account/navigation';

const DeviceCollection = ({ page }: { page: AccountPageKey }) => {
  const local = useDeviceLibrary();
  const { palette } = useTheme();
  const styles = createStyles(palette);
  const [name, setName] = useState(``);
  const [search, setSearch] = useState(``);
  const [selectedList, setSelectedList] = useState(``);
  const [message, setMessage] = useState(``);
  const confirm = (title: string, action: () => void) => {
    if (Platform.OS === `web`) { if (window.confirm(title)) action(); }
    else Alert.alert(title, `This changes only this device.`, [{ text: `Cancel`, style: `cancel` }, { text: `Remove`, style: `destructive`, onPress: action }]);
  };
  const action = (label: string, onPress: () => void, disabled = false) => <Pressable disabled={!local.ready || disabled} accessibilityRole='button' accessibilityState={{ disabled: !local.ready || disabled }} onPress={onPress} style={styles.button}><Text style={styles.buttonText}>{label}</Text></Pressable>;
  const toggleFavorite = (id: string) => {
    if (!local.data.favorites.includes(id) && local.data.favorites.length >= 200) { setMessage(`Device favorite limit reached (200). Remove an entry first.`); return; }
    local.update((data) => ({ ...data, favorites: data.favorites.includes(id) ? data.favorites.filter((value) => value !== id) : [...data.favorites, id] }));
  };
  const list = local.data.lists.find((item) => item.id === selectedList);
  const visibleIds = list?.entries ?? local.data.favorites;
  const visible = palindromes.filter((entry) => visibleIds.includes(entry.id));
  if (![`profile`, `favorites`, `submissions`].includes(page)) return null;
  return <View nativeID={`device-collection-${page}`} style={styles.card}>
    <Text accessibilityRole='header' style={styles.subtitle}>{page === `profile` ? `Device preferences` : page === `submissions` ? `Your device draft` : `Device favorites & lists`}</Text>
    <Text accessibilityLiveRegion='polite' style={styles.muted}>{local.status}</Text>
    <Text style={styles.muted}>No sign-in required. Anyone using this browser profile can see these items. Clearing site storage loses them. Nothing here grants a role, publishes content, or syncs to another device.</Text>
    {page === `profile` ? <>
      <Text style={styles.text}>Device nickname (not your account identity)</Text><TextInput nativeID='device-nickname' accessibilityLabel='Device Nickname' editable={local.ready} maxLength={60} value={local.data.nickname} onChangeText={(nickname) => local.update((data) => ({ ...data, nickname }))} placeholder='Optional nickname' placeholderTextColor={palette.muted} style={styles.field} />
      <Text style={styles.muted}>No email, password, avatar upload, or Owner role is stored.</Text>
      {action(`Clear Device Library`, () => confirm(`Remove this device nickname, favorites, lists, and draft?`, () => local.update(() => ({ version: 1, nickname: ``, draft: ``, favorites: [], lists: [] }))))}
    </> : page === `submissions` ? <><Text style={styles.text}>{local.data.draft || `No device draft yet.`}</Text><Link href='/submit' style={styles.buttonText}>Edit and check draft</Link><Text style={styles.muted}>Draft only. No approval status, reviewer, or public submission exists.</Text></> : <>
      <Text style={styles.text}>Create a local list ({local.data.lists.length}/20)</Text><TextInput nativeID='device-list-name' accessibilityLabel='New Device List Name' editable={local.ready} value={name} onChangeText={setName} maxLength={60} style={styles.field} placeholder='A name for your list' placeholderTextColor={palette.muted} />
      {action(`Create List`, () => {
        if (!name.trim()) { setMessage(`Enter a list name.`); return; }
        if (local.data.lists.length >= 20) { setMessage(`Device list limit reached (20).`); return; }
        const id = `list-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        local.update((data) => ({ ...data, lists: [...data.lists, { id, name: name.trim(), entries: [] }] }));
        setSelectedList(id); setName(``); setMessage(`List created on this device only.`);
      })}
      <View style={styles.nav}>{action(`Favorites (${local.data.favorites.length})`, () => setSelectedList(``))}{local.data.lists.map((item) => <View key={item.id}>{action(`${item.name} (${item.entries.length})`, () => setSelectedList(item.id))}</View>)}</View>
      <Text accessibilityRole='header' style={styles.subtitle}>{list?.name ?? `Favorites`}</Text>
      {list && action(`Delete This List`, () => confirm(`Delete ${list.name} from this device? Favorites are kept.`, () => { local.update((data) => ({ ...data, lists: data.lists.filter((item) => item.id !== list.id) })); setSelectedList(``); }))}
      {visible.length ? visible.map((entry) => <View key={entry.id} nativeID={`device-saved-${entry.id}`} style={styles.nav}><Text style={styles.text}>{entry.text}</Text>{action(`Remove`, () => list ? local.update((data) => ({ ...data, lists: data.lists.map((item) => item.id === list.id ? { ...item, entries: item.entries.filter((id) => id !== entry.id) } : item) })) : toggleFavorite(entry.id))}</View>) : <Text style={styles.muted}>No items saved in this device collection.</Text>}
      <Text style={styles.text}>Find bundled palindromes to save</Text><TextInput nativeID='device-library-search' accessibilityLabel='Search Bundled Palindromes' value={search} onChangeText={setSearch} maxLength={100} placeholder='Search words, names, phrases' placeholderTextColor={palette.muted} style={styles.field} />
      <Text style={styles.muted}>Showing up to 20 matching bundled entries. Each list holds up to 200.</Text>
      {palindromes.filter((entry) => entry.text.toLowerCase().includes(search.toLowerCase())).slice(0, 20).map((entry) => <View key={entry.id} nativeID={`device-search-${entry.id}`} style={styles.nav}><Text style={styles.text}>{entry.text}</Text>{action(local.data.favorites.includes(entry.id) ? `Remove Favorite` : `Save Favorite`, () => toggleFavorite(entry.id))}{list && action(list.entries.includes(entry.id) ? `In List` : `Add to List`, () => {
        if (list.entries.length >= 200) { setMessage(`This list is full (200).`); return; }
        local.update((data) => ({ ...data, lists: data.lists.map((item) => item.id === list.id ? { ...item, entries: [...item.entries, entry.id] } : item) }));
      }, list.entries.includes(entry.id))}</View>)}
      <Text accessibilityLiveRegion='polite' style={styles.muted}>{message}</Text>
    </>}
  </View>;
};
export default DeviceCollection;
