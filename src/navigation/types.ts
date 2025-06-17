import {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Define los parámetros para cada ruta en el Stack Navigator principal
 */
export type RootStackParamList = {
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
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type PatientFormScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientForm'>;
export type PatientDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PatientDetail'>;

// Tipo genérico para cualquier pantalla
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;