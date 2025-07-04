import {PatientsProvider} from '@/context';
import {AuthProvider} from '@/context/AuthContext';
import {ThemeProvider} from '@context/ThemeContext';
import {AppNavigator} from '@navigation/AppNavigator';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './src/services/NotificationService';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PatientsProvider>
            <AppNavigator />
          </PatientsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
