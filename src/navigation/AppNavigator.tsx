import {useAuth} from '@/context/AuthContext';
import {useTheme} from '@/context/ThemeContext';
import {LoginScreen} from '@/screens/';
import {HomeScreen} from '@/screens/Home';
import {PatientDetailScreen} from '@/screens/PatientDetail';
import {PatientFormScreen} from '@/screens/PatientForm';
import {RegisterScreen} from '@/screens/Register';
import {RegisterProfessionalInfoScreen} from '@/screens/RegisterProfessionalInfo';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const {colors} = useTheme();
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PatientForm" component={PatientFormScreen} />
            <Stack.Screen
              name="PatientDetail"
              component={PatientDetailScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="RegisterProfessionalInfo"
              component={RegisterProfessionalInfoScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
