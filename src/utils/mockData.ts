import {CreatePatientInput} from '@/types/Patient';

// Usamos CreatePatientInput porque no tienen 'id' ni fechas de servidor todavía
export const mockPatients: CreatePatientInput[] = [
  {
    name: 'Rocky',
    species: 'Perro',
    breed: 'Bóxer',
    age: 5,
    gender: 'male',
    ownerName: 'Luis Hernández',
    symptoms: 'Ha ingerido un objeto extraño, presenta vómitos y letargo.',
    diagnosis: 'Obstrucción intestinal por cuerpo extraño.',
    treatment: 'Cirugía de emergencia para remover el objeto.',
    status: 'emergency',
    nextAppointment: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
  },
  {
    name: 'Misha',
    species: 'Gato',
    breed: 'Siamés',
    age: 8,
    gender: 'female',
    ownerName: 'Sofía Torres',
    symptoms: 'Aumento de la sed, pérdida de peso y micción frecuente.',
    diagnosis: 'Insuficiencia renal crónica.',
    treatment: 'Dieta renal especializada y fluidoterapia.',
    status: 'in_treatment',
    nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
  },
  {
    name: 'Thor',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'male',
    ownerName: 'Elena Ramírez',
    symptoms: 'Vacunación anual y desparasitación.',
    diagnosis: 'Paciente sano.',
    treatment: 'Aplicación de vacuna séxtuple.',
    status: 'active',
  },
  {
    name: 'Nube',
    species: 'Gato',
    breed: 'Doméstico',
    age: 3,
    gender: 'female',
    ownerName: 'David Jiménez',
    symptoms: 'Presentaba una herida infectada en una pata.',
    diagnosis: 'Absceso por mordedura.',
    treatment: 'Drenaje, cura y antibióticos.',
    status: 'recovered',
  },
];
