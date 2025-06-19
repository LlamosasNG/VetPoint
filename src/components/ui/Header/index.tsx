import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'transparent';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  variant = 'primary',
}) => {
  const {colors, isDarkMode} = useTheme();

  const getHeaderStyle = () => {
    switch (variant) {
      case 'primary':
        return {backgroundColor: colors.primary};
      case 'secondary':
        return {backgroundColor: colors.surface};
      case 'transparent':
        return {backgroundColor: 'transparent'};
      default:
        return {backgroundColor: colors.primary};
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
      case 'transparent':
        return colors.text;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <>
      <StatusBar
        barStyle={
          variant === 'primary' || isDarkMode ? 'light-content' : 'dark-content'
        }
        backgroundColor={
          variant === 'primary' ? colors.primary : colors.background
        }
      />
      <SafeAreaView style={[styles.safeArea, getHeaderStyle()]}>
        <View style={[styles.container, getHeaderStyle()]}>
          <View style={styles.content}>
            {/* Botón de retroceso */}
            {showBackButton && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}>
                <Text style={[styles.backButtonText, {color: getTextColor()}]}>
                  ←
                </Text>
              </TouchableOpacity>
            )}

            {/* Contenido central */}
            <View
              style={[
                styles.centerContent,
                !showBackButton && styles.centerContentFull,
              ]}>
              <Text
                style={[styles.title, {color: getTextColor()}]}
                numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={[styles.subtitle, {color: getTextColor() + '90'}]}
                  numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>

            {/* Componente derecho */}
            <View style={styles.rightContainer}>{rightComponent}</View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 1000,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '400',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  centerContentFull: {
    marginHorizontal: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
});

// Componente específico para la app veterinaria
export const VetHeader: React.FC<
  Omit<HeaderProps, 'title'> & {
    screenTitle: string;
  }
> = ({screenTitle, ...props}) => {
  return <Header title={`VetPoint`} subtitle={screenTitle} {...props} />;
};
