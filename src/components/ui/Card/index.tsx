import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {StyleProp, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './Card.styles';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  margin?: number;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  onPress?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding,
  margin,
  variant = 'default',
  onPress,
  disabled = false,
}) => {
  const {colors} = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: padding !== undefined ? padding : 20,
      margin: margin !== undefined ? margin : 8,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
          borderWidth: 0,
        };

      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.border,
          shadowOpacity: 0,
          elevation: 0,
        };

      case 'flat':
        return {
          ...baseStyle,
          shadowOpacity: 0,
          elevation: 0,
          borderWidth: 0,
        };

      default: // 'default'
        return {
          ...baseStyle,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: colors.border,
        };
    }
  };

  const cardStyle = [getCardStyle(), disabled && {opacity: 0.6}, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.95}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// Componentes especializados para la app veterinaria
export const PatientStatusCard: React.FC<{
  children: React.ReactNode;
  status: 'active' | 'in_treatment' | 'recovered' | 'emergency';
  style?: StyleProp<ViewStyle>;
}> = ({children, status, style}) => {
  const {colors} = useTheme();

  const getStatusBorder = () => {
    switch (status) {
      case 'active':
        return colors.statusActive;
      case 'in_treatment':
        return colors.statusTreatment;
      case 'recovered':
        return colors.statusRecovered;
      case 'emergency':
        return colors.statusEmergency;
      default:
        return colors.border;
    }
  };

  return (
    <Card
      variant="elevated"
      style={[
        {
          borderLeftWidth: 4,
          borderLeftColor: getStatusBorder(),
        },
        style,
      ]}>
      {children}
    </Card>
  );
};

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  color,
}) => {
  const {colors} = useTheme();

  return (
    <Card
      variant="elevated"
      style={[styles.statsCardContainer, {backgroundColor: colors.card}]}>
      <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statsValue, {color: colors.text}]}>{value}</Text>
      <Text style={[styles.statsLabel, {color: colors.gray}]}>{label}</Text>
    </Card>
  );
};
