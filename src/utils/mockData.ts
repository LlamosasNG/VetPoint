import {Patient} from '../types/Patient';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    gender: 'male',
    ownerName: 'Juan Pérez',
    ownerEmail: 'juan.perez@email.com',
    ownerPhone: '5551234567',
    symptoms: 'Cojera en pata trasera derecha, se observa desde hace 3 días',
    diagnosis: 'Posible esguince en articulación',
    treatment: 'Reposo por 1 semana, antiinflamatorio',
    notes: 'Revisar en una semana',
    dateCreated: new Date('2024-01-15'),
    lastVisit: new Date('2024-01-15'),
    nextAppointment: new Date('2024-01-22'),
    status: 'in_treatment',
    photos: [],
  },
  {
    id: '2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Persa',
    age: 2,
    gender: 'female',
    ownerName: 'María García',
    ownerEmail: 'maria.garcia@email.com',
    ownerPhone: '5559876543',
    symptoms: 'Pérdida de apetito, vómitos ocasionales',
    diagnosis: 'Gastritis leve',
    treatment: 'Dieta blanda, probióticos',
    notes: 'Responde bien al tratamiento',
    dateCreated: new Date('2024-01-10'),
    lastVisit: new Date('2024-01-18'),
    status: 'recovered',
    photos: [],
  },
  {
    id: '3',
    name: 'Rocky',
    species: 'Perro',
    breed: 'Bulldog',
    age: 5,
    gender: 'male',
    ownerName: 'Carlos Mendoza',
    ownerEmail: 'carlos.mendoza@email.com',
    ownerPhone: '5555551234',
    symptoms: 'Dificultad para respirar, jadeo excesivo',
    diagnosis: 'Problemas respiratorios característicos de la raza',
    treatment: 'Control de peso, evitar ejercicio intenso',
    notes: 'Monitoreo constante necesario',
    dateCreated: new Date('2024-01-08'),
    lastVisit: new Date('2024-01-20'),
    nextAppointment: new Date('2024-02-01'),
    status: 'active',
    photos: [],
  },
  {
    id: '4',
    name: 'Bella',
    species: 'Gato',
    breed: 'Siamés',
    age: 1,
    gender: 'female',
    ownerName: 'Ana López',
    ownerEmail: 'ana.lopez@email.com',
    symptoms: 'Revisión general, vacunación pendiente',
    diagnosis: 'Paciente sano',
    treatment: 'Vacunación completa',
    notes: 'Primera consulta, excelente estado general',
    dateCreated: new Date('2024-01-20'),
    lastVisit: new Date('2024-01-20'),
    status: 'active',
    photos: [],
  },
  {
    id: '5',
    name: 'Buddy',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 7,
    gender: 'male',
    ownerName: 'Roberto Silva',
    ownerEmail: 'roberto.silva@email.com',
    ownerPhone: '5554567890',
    symptoms: 'Herida profunda en pata, posible infección',
    diagnosis: 'Laceración infectada',
    treatment: 'Antibióticos, curación diaria',
    notes: 'URGENTE - Requiere atención inmediata',
    dateCreated: new Date('2024-01-21'),
    lastVisit: new Date('2024-01-21'),
    nextAppointment: new Date('2024-01-23'),
    status: 'emergency',
    photos: [],
  },
];

// Función para cargar datos de prueba
export const loadMockData = async (): Promise<Patient[]> => {
  return mockPatients;
};
