import {useAuth} from '@/context/AuthContext';
import {useTheme} from '@/context/ThemeContext';
import {
  AccountScreen,
  HomeScreen,
  LoginScreen,
  PatientDetailScreen,
  PatientFormScreen,
  RegisterProfessionalInfoScreen,
  RegisterScreen,
} from '@/screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// Importamos los tipos de los stacks
import {
  AccountStackParamList,
  AppTabParamList,
  AuthStackParamList,
  HomeStackParamList,
} from './types';

// Creamos los navegadores
const Tab = createBottomTabNavigator<AppTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const AccountStackNav = createNativeStackNavigator<AccountStackParamList>();

// --- Stacks Individuales ---

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen
      name="RegisterProfessionalInfo"
      component={RegisterProfessionalInfoScreen}
    />
  </AuthStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="PatientDetail" component={PatientDetailScreen} />
    <HomeStack.Screen name="PatientForm" component={PatientFormScreen} />
  </HomeStack.Navigator>
);

const AccountStackNavigator = () => (
  <AccountStackNav.Navigator screenOptions={{headerShown: false}}>
    <AccountStackNav.Screen name="Account" component={AccountScreen} />
  </AccountStackNav.Navigator>
);

// --- Navegador Principal con Pestañas ---

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
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          // Función para renderizar el icono
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string;

            if (route.name === 'HomeStack') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AccountStack') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            } else {
              iconName = 'alert-circle'; // Icono por defecto
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}>
        {user ? (
          // --- PESTAÑAS PARA USUARIO AUTENTICADO ---
          <>
            <Tab.Screen
              name="HomeStack"
              component={HomeStackNavigator}
              options={{title: 'Inicio'}}
            />
            <Tab.Screen
              name="AccountStack"
              component={AccountStackNavigator}
              options={{title: 'Mi Cuenta'}}
            />
          </>
        ) : (
          // --- PESTAÑA ÚNICA PARA AUTENTICACIÓN ---
          <Tab.Screen
            name="AccountStack"
            component={AuthStackNavigator}
            options={{
              title: 'Acceder',
              tabBarStyle: {display: 'none'}, // Ocultamos la barra
              tabBarButton: () => null, // Ocultamos el botón del tab
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};
