export interface ThemeColors {
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
}

export interface ThemeContextProps {
  theme: 'light' | 'dark' | 'system';
  colors: ThemeColors;
  isDarkMode: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export type ThemeType = 'light' | 'dark' | 'system';