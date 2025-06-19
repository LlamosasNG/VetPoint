export interface ThemeColors {
  // Colores base
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  gray: string;

  // Colores adicionales para diseño profesional
  accent: string;
  warning: string;
  info: string;
  surface: string;
  onSurface: string;
  divider: string;

  // Estados específicos para pacientes
  statusActive: string;
  statusTreatment: string;
  statusRecovered: string;
  statusEmergency: string;
}

export interface ThemeContextProps {
  theme: 'light' | 'dark' | 'system';
  colors: ThemeColors;
  isDarkMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export type ThemeType = 'light' | 'dark' | 'system';

// Constantes de diseño para consistencia
export const DESIGN_CONSTANTS = {
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Radio de borde
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 20,
    xxl: 28,
  },

  // Sombras
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // Tipografía
  typography: {
    // Tamaños
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    // Pesos
    weights: {
      light: '300' as const,
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
  },
};
