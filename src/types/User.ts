/**
 * Representa la estructura completa de un usuario
 * tal como se almacena en Firestore.
 */
export interface User {
  id: string; // Corresponde al UID de Firebase Auth
  name: string;
  email: string;
  clinicName: string;
  licenseNumber: string;
  specialty?: string;
  phoneNumber?: string;
  createdAt: Date;
}

/**
 * Define los datos necesarios para crear un nuevo usuario.
 * Es una combinación de los datos de autenticación y los datos profesionales.
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string; // La contraseña solo se usa para el registro, no se almacena en Firestore.
  clinicName: string;
  licenseNumber: string;
  specialty?: string;
  phoneNumber?: string;
}

/**
 * Define los datos necesarios para iniciar sesión.
 * Es una combinación de los datos de autenticación que se envían al iniciar sesión.
 */
export type LoginInput = Pick<CreateUserInput, 'email' | 'password'>;

/**
 * Define los datos profesionales del usuario que se almacenarán
 * en Firestore, excluyendo los datos de autenticación como el email y la contraseña.
 */
export type ProfessionalData = Omit<User, 'id' | 'email' | 'createdAt'>;
