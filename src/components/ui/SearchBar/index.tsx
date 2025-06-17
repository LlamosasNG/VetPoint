import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Simulamos un ícono de búsqueda simple
const SearchIcon = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.iconContainer}>
      <View style={[styles.searchIconCircle, {borderColor: colors.gray}]} />
      <View style={[styles.searchIconHandle, {backgroundColor: colors.gray}]} />
    </View>
  );
};

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar pacientes...',
  value,
  onChangeText,
  onSubmit,
}) => {
  const {colors, isDarkMode} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
      <TouchableOpacity style={styles.iconWrapper} onPress={onSubmit}>
        <SearchIcon />
      </TouchableOpacity>
      <TextInput
        style={[styles.input, {color: colors.text}]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrapper: {
    marginRight: 10,
  },
  iconContainer: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  searchIconCircle: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderRadius: 7,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchIconHandle: {
    width: 6,
    height: 2,
    position: 'absolute',
    bottom: 2,
    right: 2,
    transform: [{rotate: '45deg'}],
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    height: '100%',
    ...Platform.select({
      ios: {
        paddingVertical: 12,
      },
      android: {
        paddingVertical: 8,
      },
    }),
  },
});
