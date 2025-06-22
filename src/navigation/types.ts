import {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Define los parámetros para cada ruta en el Stack Navigator principal
 */
export type RootStackParamList = {
  /**
   * Pantalla de inicio de sesión
   */
  Login: undefined;

  /**
   * Pantalla de registro de usuarios
   */
  Register: undefined;
  RegisterProfessionalInfo: {
    name: string;
    email: string;
    password: string;
  };

  /**
   * Pantalla principal que muestra la lista de pacientes
   */
  Home: undefined;

  /**
   * Formulario para crear o editar pacientes
   */
  PatientForm: undefined;

  /**
   * Pantalla de detalles del paciente
   */
  PatientDetail: undefined;
};

// Tipos para las props de cada pantalla
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type PatientFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PatientForm'
>;
export type PatientDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PatientDetail'
>;

export type RegisterProfessionalInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterProfessionalInfo'
>;

// Tipo genérico para cualquier pantalla
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
