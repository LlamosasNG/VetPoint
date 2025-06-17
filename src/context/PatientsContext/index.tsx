import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  CreatePatientInput,
  Patient,
  PatientFilters,
  UpdatePatientInput,
} from '../../types/Patient';

interface PatientsContextProps {
  // Estado
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;

  // Acciones
  createPatient: (patientData: CreatePatientInput) => Promise<void>;
  updatePatient: (patientData: UpdatePatientInput) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  selectPatient: (patient: Patient | null) => void;

  // Búsqueda y filtros
  searchPatients: (query: string) => Patient[];
  filterPatients: (filters: PatientFilters) => Patient[];

  // Multimedia
  addPhoto: (patientId: string, photoUri: string) => Promise<void>;
  removePhoto: (patientId: string, photoIndex: number) => Promise<void>;

  // Persistencia
  loadPatients: () => Promise<void>;
  savePatients: () => Promise<void>;

  // Datos de prueba
  loadMockPatients: (
    mockPatients: Omit<Patient, 'id' | 'dateCreated' | 'lastVisit'>[],
  ) => Promise<void>;
}

const PatientsContext = createContext<PatientsContextProps | undefined>(
  undefined,
);

const STORAGE_KEY = 'vet_app_patients';

export const PatientsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar pacientes al inicializar
  useEffect(() => {
    loadPatients();
  }, []);

  // Generar ID único
  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Cargar pacientes desde AsyncStorage
  const loadPatients = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const storedPatients = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPatients) {
        const parsedPatients = JSON.parse(storedPatients);
        // Convertir fechas string a Date objects
        const patientsWithDates = parsedPatients.map((patient: any) => ({
          ...patient,
          dateCreated: new Date(patient.dateCreated),
          lastVisit: patient.lastVisit
            ? new Date(patient.lastVisit)
            : undefined,
          nextAppointment: patient.nextAppointment
            ? new Date(patient.nextAppointment)
            : undefined,
        }));
        setPatients(patientsWithDates);
      }
    } catch (err) {
      setError('Error al cargar pacientes');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar pacientes en AsyncStorage
  const savePatients = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (err) {
      setError('Error al guardar pacientes');
      console.error('Error saving patients:', err);
    }
  };

  // Crear nuevo paciente
  const createPatient = async (
    patientData: CreatePatientInput,
  ): Promise<void> => {
    try {
      setError(null);

      const newPatient: Patient = {
        ...patientData,
        id: generateId(),
        dateCreated: new Date(),
        lastVisit: new Date(),
        photos: [],
        status: patientData.status || 'active',
      };

      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);

      // Guardar inmediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al crear paciente');
      console.error('Error creating patient:', err);
      throw err;
    }
  };

  // Actualizar paciente existente
  const updatePatient = async (
    patientData: UpdatePatientInput,
  ): Promise<void> => {
    try {
      setError(null);

      const updatedPatients = patients.map(patient =>
        patient.id === patientData.id
          ? {...patient, ...patientData, lastVisit: new Date()}
          : patient,
      );

      setPatients(updatedPatients);

      // Actualizar paciente seleccionado si es el mismo
      if (selectedPatient?.id === patientData.id) {
        const updatedSelected = updatedPatients.find(
          p => p.id === patientData.id,
        );
        setSelectedPatient(updatedSelected || null);
      }

      // Guardar inmediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al actualizar paciente');
      console.error('Error updating patient:', err);
      throw err;
    }
  };

  // Eliminar paciente
  const deletePatient = async (id: string): Promise<void> => {
    try {
      setError(null);

      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);

      // Si el paciente eliminado estaba seleccionado, deseleccionar
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }

      // Guardar inmediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al eliminar paciente');
      console.error('Error deleting patient:', err);
      throw err;
    }
  };

  // Seleccionar paciente
  const selectPatient = (patient: Patient | null): void => {
    setSelectedPatient(patient);
  };

  // Buscar pacientes
  const searchPatients = (query: string): Patient[] => {
    if (!query.trim()) return patients;

    const searchTerm = query.toLowerCase();
    return patients.filter(
      patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.ownerName.toLowerCase().includes(searchTerm) ||
        patient.ownerEmail.toLowerCase().includes(searchTerm) ||
        patient.species.toLowerCase().includes(searchTerm) ||
        (patient.breed && patient.breed.toLowerCase().includes(searchTerm)) ||
        patient.symptoms.toLowerCase().includes(searchTerm),
    );
  };

  // Filtrar pacientes
  const filterPatients = (filters: PatientFilters): Patient[] => {
    return patients.filter(patient => {
      if (filters.species && patient.species !== filters.species) return false;
      if (filters.status && patient.status !== filters.status) return false;
      if (
        filters.ownerName &&
        !patient.ownerName
          .toLowerCase()
          .includes(filters.ownerName.toLowerCase())
      )
        return false;
      if (filters.dateFrom && patient.dateCreated < filters.dateFrom)
        return false;
      if (filters.dateTo && patient.dateCreated > filters.dateTo) return false;
      return true;
    });
  };

  // Agregar foto
  const addPhoto = async (
    patientId: string,
    photoUri: string,
  ): Promise<void> => {
    try {
      setError(null);

      const updatedPatients = patients.map(patient =>
        patient.id === patientId
          ? {...patient, photos: [...(patient.photos || []), photoUri]}
          : patient,
      );

      setPatients(updatedPatients);

      // Actualizar paciente seleccionado si es el mismo
      if (selectedPatient?.id === patientId) {
        const updatedSelected = updatedPatients.find(p => p.id === patientId);
        setSelectedPatient(updatedSelected || null);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al agregar foto');
      console.error('Error adding photo:', err);
      throw err;
    }
  };

  // Remover foto
  const removePhoto = async (
    patientId: string,
    photoIndex: number,
  ): Promise<void> => {
    try {
      setError(null);

      const updatedPatients = patients.map(patient =>
        patient.id === patientId
          ? {
              ...patient,
              photos:
                patient.photos?.filter((_, index) => index !== photoIndex) ||
                [],
            }
          : patient,
      );

      setPatients(updatedPatients);

      // Actualizar paciente seleccionado si es el mismo
      if (selectedPatient?.id === patientId) {
        const updatedSelected = updatedPatients.find(p => p.id === patientId);
        setSelectedPatient(updatedSelected || null);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al remover foto');
      console.error('Error removing photo:', err);
      throw err;
    }
  };

  // Cargar múltiples pacientes (útil para datos de prueba)
  const loadMockPatients = async (
    mockPatients: Omit<Patient, 'id' | 'dateCreated' | 'lastVisit'>[],
  ): Promise<void> => {
    try {
      setError(null);

      const newPatients: Patient[] = mockPatients.map(mockPatient => ({
        ...mockPatient,
        id: generateId(),
        dateCreated: new Date(),
        lastVisit: new Date(),
        photos: mockPatient.photos || [],
      }));

      const updatedPatients = [...patients, ...newPatients];
      setPatients(updatedPatients);

      // Guardar inmediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    } catch (err) {
      setError('Error al cargar datos de prueba');
      console.error('Error loading mock patients:', err);
      throw err;
    }
  };

  return (
    <PatientsContext.Provider
      value={{
        patients,
        selectedPatient,
        loading,
        error,
        createPatient,
        updatePatient,
        deletePatient,
        selectPatient,
        searchPatients,
        filterPatients,
        addPhoto,
        removePhoto,
        loadPatients,
        savePatients,
        loadMockPatients,
      }}>
      {children}
    </PatientsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients debe usarse dentro de un PatientsProvider');
  }
  return context;
};

// Exportar tipos
export type {CreatePatientInput, Patient, PatientFilters, UpdatePatientInput};
