import {PatientsProvider} from '@/context';
import {ThemeProvider} from '@context/ThemeContext';
import {AppNavigator} from '@navigation/AppNavigator';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PatientsProvider>
          <AppNavigator />
        </PatientsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
