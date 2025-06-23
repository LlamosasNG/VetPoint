import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- STACKS INDIVIDUALES ---

// Stack para las pantallas de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RegisterProfessionalInfo: { name: string; email: string; password: string };
};

// Stack para las pantallas principales (cuando estás logueado)
export type HomeStackParamList = {
  Home: undefined;
  PatientDetail: undefined;
  PatientForm: undefined;
};

// Stack para la pestaña de la cuenta
export type AccountStackParamList = {
  Account: undefined;
};

// --- TAB NAVIGATOR PRINCIPAL ---

export type AppTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  AccountStack: NavigatorScreenParams<AccountStackParamList | AuthStackParamList>;
};

// --- TIPOS DE PROPS PARA CADA PANTALLA ---

// Tipos para el Stack de Autenticación 
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Tipos para las pantallas dentro del HomeStack
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    BottomTabScreenProps<AppTabParamList>
  >;

// Tipos para las pantallas dentro del AccountStack
export type AccountStackScreenProps<T extends keyof AccountStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AccountStackParamList, T>,
    BottomTabScreenProps<AppTabParamList>
  >;