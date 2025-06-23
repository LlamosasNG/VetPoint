/**
 * Define los posibles estados de un paciente.
 */
export type PatientStatus =
  | 'active'
  | 'in_treatment'
  | 'recovered'
  | 'emergency';

export interface Patient {
  id: string;
  // Información básica
  name: string;
  species: string; // Perro, Gato, etc.
  breed?: string; // Raza
  age?: number;
  gender?: 'male' | 'female';

  // Información del propietario
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;

  // Información médica
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;

  // Fechas importantes
  dateCreated: Date;
  lastVisit?: Date;
  nextAppointment?: Date;

  // Multimedia
  photos?: string[]; // URLs o paths de fotos

  // Estado
  status: PatientStatus;
}

// Tipo para crear un nuevo paciente (sin ID y fechas)
export interface CreatePatientInput {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  gender?: 'male' | 'female';
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  nextAppointment?: Date;
  status?: PatientStatus;
}

// Tipo para actualizar un paciente
export interface UpdatePatientInput extends Partial<CreatePatientInput> {
  id: string;
}

// Filtros para búsqueda
export interface PatientFilters {
  species?: string;
  status?: string;
  ownerName?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
