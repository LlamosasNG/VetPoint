import {
  CreatePatientInput,
  Patient,
  PatientFilters,
  UpdatePatientInput,
} from '@/types/Patient';
import {useAuth} from '@context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';

interface PatientsContextProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  createPatient: (patientData: CreatePatientInput) => Promise<void>;
  updatePatient: (patientData: UpdatePatientInput) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  selectPatient: (patient: Patient | null) => void;
  searchPatients: (query: string) => Patient[];
  filterPatients: (filters: PatientFilters) => Patient[];
}

const PatientsContext = createContext<PatientsContextProps | undefined>(
  undefined,
);

export const PatientsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {user} = useAuth(); // Usamos el hook de autenticación
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referencia a la subcolección de pacientes del usuario actual
  const patientsCollection = user
    ? firestore().collection('users').doc(user.uid).collection('patients')
    : null;

  // Cargar pacientes desde Firestore cuando el usuario cambia
  useEffect(() => {
    if (patientsCollection) {
      setLoading(true);
      const subscriber = patientsCollection.onSnapshot(
        querySnapshot => {
          const patientsData: Patient[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const data = documentSnapshot.data();
            patientsData.push({
              ...data,
              id: documentSnapshot.id,
              // Convertir Timestamps de Firestore a objetos Date de JS
              dateCreated: data.dateCreated?.toDate(),
              lastVisit: data.lastVisit?.toDate(),
              nextAppointment: data.nextAppointment?.toDate(),
            } as Patient);
          });
          setPatients(patientsData);
          setLoading(false);
        },
        err => {
          setError('Error al cargar pacientes');
          console.error(err);
          setLoading(false);
        },
      );

      return () => subscriber(); // Desuscribirse al desmontar
    } else {
      setPatients([]); // Limpiar pacientes si no hay usuario
    }
  }, [user]);

  // Crear nuevo paciente en Firestore
  const createPatient = async (
    patientData: CreatePatientInput,
  ): Promise<void> => {
    if (!patientsCollection) throw new Error('Usuario no autenticado.');

    const newPatientData = {
      ...patientData,
      dateCreated: firestore.FieldValue.serverTimestamp(),
      lastVisit: firestore.FieldValue.serverTimestamp(),
    };
    await patientsCollection.add(newPatientData);
  };

  // Actualizar paciente
  const updatePatient = async (
    patientData: UpdatePatientInput,
  ): Promise<void> => {
    if (!patientsCollection) throw new Error('Usuario no autenticado.');

    const {id, ...dataToUpdate} = patientData;
    await patientsCollection.doc(id).update({
      ...dataToUpdate,
      lastVisit: firestore.FieldValue.serverTimestamp(),
    });
  };

  // Eliminar paciente
  const deletePatient = async (id: string): Promise<void> => {
    if (!patientsCollection) throw new Error('Usuario no autenticado.');
    await patientsCollection.doc(id).delete();
  };

  // Las demás funciones (select, search, filter) pueden permanecer igual
  // ya que operan sobre el estado local 'patients'.

  const selectPatient = (patient: Patient | null): void => {
    setSelectedPatient(patient);
  };

  const searchPatients = (query: string): Patient[] => {
    if (!query.trim()) return patients;
    const searchTerm = query.toLowerCase();
    return patients.filter(
      patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.ownerName.toLowerCase().includes(searchTerm),
    );
  };

  const filterPatients = (filters: PatientFilters): Patient[] => {
    // Implementar lógica de filtro si es necesario
    return patients;
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
      }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients debe usarse dentro de un PatientsProvider');
  }
  return context;
};
