import Icon from '../Icon';
import { useMemo } from 'react';
import { alphabetLetters } from './data';
import createStyles from './styles.native';
import type { AlphabetFilterProps } from './types';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from '../../shared/themeContext/useTheme';

const AlphabetFilter = ({ id, onClear, onToggle, resultCount, selectedLetters }: AlphabetFilterProps) => {
  const { palette } = useTheme();
  const allSelected = !selectedLetters.length;
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View nativeID={id} style={styles.filter}>
      <View nativeID={`${id}-buttons`} style={styles.buttons}>
        <Pressable
          onPress={onClear}
          nativeID={`${id}-all`}
          accessibilityRole={`button`}
          accessibilityLabel={`Show All Letters`}
          accessibilityState={{ selected: allSelected }}
          style={({ pressed }) => [styles.button, styles.allButton, allSelected && styles.selectedButton, pressed && styles.pressed]}
        >
          <Icon name={`repeat`} size={14} color={allSelected ? palette.searchInk : palette.ink} />
          <Text nativeID={`${id}-all-label`} style={[styles.label, allSelected && styles.selectedLabel]}>All Letters</Text>
        </Pressable>
        {alphabetLetters.map((letter) => {
          const selected = selectedLetters.includes(letter);

          return (
            <Pressable
              key={letter}
              nativeID={`${id}-${letter}`}
              onPress={() => onToggle(letter)}
              accessibilityRole={`button`}
              accessibilityLabel={`Starts With ${letter}`}
              accessibilityState={{ selected }}
              style={({ pressed }) => [styles.button, selected && styles.selectedButton, pressed && styles.pressed]}
            >
              <Text nativeID={`${id}-${letter}-label`} style={[styles.label, selected && styles.selectedLabel]}>{letter}</Text>
            </Pressable>
          );
        })}
        {resultCount !== undefined && (
          <Text nativeID={`${id}-result-count`} accessibilityLiveRegion={`polite`} style={styles.resultCount}>
            <Text nativeID={`${id}-result-number`} style={styles.resultNumber}>{resultCount.toLocaleString()}</Text>{` ${resultCount === 1 ? `palindrome` : `palindromes`} found`}
          </Text>
        )}
      </View>
    </View>
  );
};

export default AlphabetFilter;
