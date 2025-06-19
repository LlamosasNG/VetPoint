import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeColors, ThemeContextProps, ThemeType} from './types';

// COLORES PROFESIONALES PARA VETERINARIA
const lightColors: ThemeColors = {
  // Paleta principal médica/veterinaria
  primary: '#2563EB', // Azul médico profesional
  secondary: '#059669', // Verde saludable
  background: '#F8FAFC', // Gris muy claro, limpio
  card: '#FFFFFF',
  text: '#1E293B', // Gris oscuro para mejor legibilidad
  border: '#E2E8F0', // Gris claro para bordes suaves
  notification: '#DC2626',
  error: '#DC2626', // Rojo más profesional
  success: '#059669', // Verde consistente
  gray: '#64748B', // Gris medio balanceado

  // Colores adicionales para diseño médico
  accent: '#7C3AED', // Púrpura para acentos
  warning: '#D97706', // Naranja para advertencias
  info: '#0891B2', // Azul claro para información
  surface: '#F1F5F9', // Superficie alternativa
  onSurface: '#475569', // Texto sobre superficie
  divider: '#CBD5E1', // Divisores

  // Estados de pacientes con colores más apropiados
  statusActive: '#22C55E', // Verde activo
  statusTreatment: '#F59E0B', // Amarillo tratamiento
  statusRecovered: '#10B981', // Verde recuperado
  statusEmergency: '#EF4444', // Rojo emergencia
};

const darkColors: ThemeColors = {
  primary: '#3B82F6', // Azul más brillante para dark mode
  secondary: '#10B981',
  background: '#0F172A', // Azul muy oscuro profesional
  card: '#1E293B',
  text: '#F1F5F9',
  border: '#334155',
  notification: '#F87171',
  error: '#F87171',
  success: '#34D399',
  gray: '#94A3B8',

  accent: '#A78BFA',
  warning: '#FBBF24',
  info: '#22D3EE',
  surface: '#334155',
  onSurface: '#CBD5E1',
  divider: '#475569',

  statusActive: '#4ADE80',
  statusTreatment: '#FBBF24',
  statusRecovered: '#34D399',
  statusEmergency: '#FB7185',
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  const isDarkMode =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  const colors = isDarkMode ? darkColors : lightColors;

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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export type {ThemeColors, ThemeContextProps, ThemeType};
