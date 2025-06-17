import {useTheme} from '@/context';
import {HomeScreen} from '@/screens/Home';
import {PatientDetailScreen} from '@/screens/PatientDetail';
import {PatientFormScreen} from '@/screens/PatientForm';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

// Tres pantallas
type ThreeStackParamList = {
  Home: undefined;
  PatientForm: undefined;
  PatientDetail: undefined;
};

const Stack = createNativeStackNavigator<ThreeStackParamList>();

export const AppNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PatientForm" component={PatientFormScreen} />
        <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
