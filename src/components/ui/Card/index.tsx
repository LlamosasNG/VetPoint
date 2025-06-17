import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {styles} from './Card.styles';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  margin?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding,
  margin,
}) => {
  const {colors} = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    padding !== undefined && {padding},
    margin !== undefined && {margin},
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};
