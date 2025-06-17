import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeColors, ThemeContextProps, ThemeType} from './types';

// Definir colores para tema claro
const lightColors: ThemeColors = {
  primary: '#6D28D9',
  secondary: '#F59E0B',
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#374151',
  border: '#E0E0E0',
  notification: '#F87171',
  error: '#EF4444',
  success: '#10B981',
  gray: '#94A3B8',
};

// Definir colores para tema oscuro
const darkColors: ThemeColors = {
  primary: '#8B5CF6',
  secondary: '#FBBF24',
  background: '#121212',
  card: '#1E1E1E',
  text: '#F3F4F6',
  border: '#272727',
  notification: '#F87171',
  error: '#EF4444',
  success: '#10B981',
  gray: '#64748B',
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  // Determinar si es modo oscuro basado en las preferencias
  const isDarkMode =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  // Seleccionar los colores basados en el tema
  const colors = isDarkMode ? darkColors : lightColors;

  // Cargar tema guardado de AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log('Error al cargar el tema:', error);
      }
    };

    loadTheme();
  }, []);

  // Guardar tema en AsyncStorage cuando cambie
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error al guardar el tema:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDarkMode,
        setTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

// Exportar tipos
export type {ThemeColors, ThemeContextProps, ThemeType};