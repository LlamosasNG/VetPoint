import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {styles} from './Input.styles';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  required = false,
  ...rest
}) => {
  const {colors, isDarkMode} = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, {color: colors.text}]}>
        {label}
        {required && (
          <Text style={[styles.required, {color: colors.error}]}> *</Text>
        )}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      ) : null}
    </View>
  );
};
