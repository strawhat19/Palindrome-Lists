import Icon from '../Icon';
import { useMemo } from 'react';
import createStyles from './styles.native';
import type { PalindromeSearchProps } from './types';
import { Text, View, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../shared/themeContext/useTheme';

const PalindromeSearch = ({ id, query, onChange, onSubmit, label = `Search Palindromes`, placeholder = `Find a word, name, or phrase…` }: PalindromeSearchProps) => {
  const { theme, palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View nativeID={id} style={styles.search}>
      <View nativeID={`${id}-icon`}><Icon name={`search`} size={17} color={palette.action} /></View>
      <TextInput
        value={query}
        autoCorrect={false}
        style={styles.input}
        onChangeText={onChange}
        autoCapitalize={`none`}
        returnKeyType={`search`}
        accessibilityLabel={label}
        placeholder={placeholder}
        nativeID={`${id}-input`}
        keyboardAppearance={theme}
        onSubmitEditing={onSubmit}
        selectionColor={palette.pink}
        placeholderTextColor={palette.muted}
      />
      <Pressable
        onPress={onSubmit}
        nativeID={`${id}-button`}
        accessibilityRole={`button`}
        accessibilityLabel={label}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Icon name={`search`} size={14} color={palette.searchInk} />
        <Text nativeID={`${id}-button-label`} style={styles.buttonLabel}>Search</Text>
      </Pressable>
    </View>
  );
};

export default PalindromeSearch;
