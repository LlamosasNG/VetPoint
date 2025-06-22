import LogoSvg from '@assets/logo.svg';
import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const Logo = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <LogoSvg width={80} height={80} />
      <Text style={[styles.logoText, {color: colors.primary}]}>VetPoint</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'semibold',
    marginTop: 8,
  },
});
