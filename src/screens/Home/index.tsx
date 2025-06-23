import {Patient} from '@/types/Patient';
import {PatientCard} from '@components/feature/PatientCard';
import {Button, SearchBar, VetHeader} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {HomeStackScreenProps} from '@navigation/types';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const HomeScreen: React.FC<HomeStackScreenProps<'Home'>> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {
    patients,
    loading,
    error,
    selectPatient,
    deletePatient,
    searchPatients,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');

  const handleAddNewPatient = () => {
    selectPatient(null);
    navigation.navigate('PatientForm');
  };

  // Filtra los pacientes basados en la búsqueda
  const filteredPatients = searchQuery.trim()
    ? searchPatients(searchQuery)
    : patients;

  const handlePatientPress = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientDetail');
  };

  const handleEditPatient = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientForm');
  };

  const handleDeletePatient = async (patientId: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar a este paciente? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patientId);
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el paciente.');
            }
          },
        },
      ],
    );
  };

  if (loading && patients.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader screenTitle="Mis Pacientes" />

      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por nombre, propietario..."
              />
              <Button
                text="Nuevo Paciente"
                type="primary"
                onPress={handleAddNewPatient}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </>
        }
        renderItem={({item}) => (
          <PatientCard
            patient={item}
            onPress={() => handlePatientPress(item)}
            onEdit={() => handleEditPatient(item)}
            onDelete={() => handleDeletePatient(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: colors.text}]}>
              No tienes pacientes registrados.
            </Text>
            <Text style={[styles.emptySubText, {color: colors.gray}]}>
              Presiona "Nuevo Paciente" para empezar.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});
