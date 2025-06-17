import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {styles} from './Button.styles';

export interface ButtonProps extends PressableProps {
  text: string;
  type?: 'primary' | 'secondary' | 'success' | 'danger';
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  type = 'primary',
  textStyle,
  buttonStyle,
  onPress,
  fullWidth = false,
  loading = false,
  disabled,
  ...rest
}) => {
  const {colors} = useTheme();

  // Obtener los colores según el tipo
  const getTypeStyles = (): ViewStyle => {
    switch (type) {
      case 'primary':
        return {backgroundColor: colors.primary};
      case 'secondary':
        return {backgroundColor: colors.secondary};
      case 'success':
        return {backgroundColor: colors.success};
      case 'danger':
        return {backgroundColor: colors.error};
      default:
        return {backgroundColor: colors.primary};
    }
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        getTypeStyles(),
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      {...rest}>
      <Text style={[styles.text, textStyle]}>
        {loading ? 'Cargando...' : text}
      </Text>
    </Pressable>
  );
};
