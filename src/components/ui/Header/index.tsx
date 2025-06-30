import { useTheme } from '@context/ThemeContext';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Usaremos iconos para el botón de regreso

// Un pequeño componente para el logo en el header
const HeaderLogo = () => {
    const { colors } = useTheme();
    return <Icon name="paw" size={24} color={colors.primary} />;
};

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card} // El color del header ahora es 'card'
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
        <View style={[styles.container, { borderBottomColor: colors.border }]}>
          {/* Lado Izquierdo: Botón de Regreso o Logo */}
          <View style={styles.leftContainer}>
            {showBackButton ? (
              <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
                <Icon name="arrow-back-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            ) : (
              <HeaderLogo />
            )}
          </View>

          {/* Contenido Central: Título */}
          <View style={styles.centerContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Lado Derecho: Acciones */}
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

// Componente específico para la app, ahora más simple
export const VetHeader: React.FC<Omit<HeaderProps, 'title'> & { screenTitle: string }> = ({
    screenTitle,
    ...props
}) => {
    return <Header title={screenTitle} {...props} />;
};


const styles = StyleSheet.create({
  safeArea: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  }
});