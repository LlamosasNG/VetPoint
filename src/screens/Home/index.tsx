import {mockPatients} from '@/utils/mockData';
import {PatientCard} from '@components/feature/PatientCard';
import {Button, Card, EmptyState, SearchBar} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {HomeScreenProps} from '@navigation/types';
import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Patient} from '../../types/Patient';

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {colors, isDarkMode, setTheme, theme} = useTheme();
  const {
    patients,
    loading,
    error,
    createPatient,
    selectPatient,
    deletePatient,
    searchPatients,
    loadPatients,
    loadMockPatients,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar pacientes basado en la búsqueda
  const filteredPatients = searchQuery.trim()
    ? searchPatients(searchQuery)
    : patients;

  const handleNavigateToForm = () => {
    selectPatient(null); // Limpiar selección para crear nuevo paciente
    navigation.navigate('PatientForm');
  };

  const handlePatientPress = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientDetail');
  };

  const handleEditPatient = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientForm');
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      await deletePatient(patientId);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el paciente');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPatients();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    } finally {
      setRefreshing(false);
    }
  }, [loadPatients]);

  const toggleTheme = () => {
    if (isDarkMode) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const handleLoadMockData = async () => {
    try {
      await loadMockPatients(mockPatients);
      Alert.alert(
        'Éxito',
        `${mockPatients.length} pacientes de prueba cargados correctamente`,
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de prueba');
    }
  };

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      return (
        <EmptyState
          type="no_search_results"
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      );
    }

    return (
      <EmptyState type="no_patients" onAddPatient={handleNavigateToForm} />
    );
  };

  const renderPatient = ({item}: {item: Patient}) => (
    <PatientCard
      patient={item}
      onPress={() => handlePatientPress(item)}
      onEdit={() => handleEditPatient(item)}
      onDelete={() => handleDeletePatient(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, {color: colors.text}]}>
        Administrador de citas {''}
        <Text style={[styles.titleBold, {color: colors.primary}]}>
          Veterinaria
        </Text>
      </Text>

      <Button
        text="Nueva Cita"
        type="primary"
        buttonStyle={styles.newPatientButton}
        onPress={handleNavigateToForm}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por nombre, propietario, email..."
        onSubmit={() => {}}
      />

      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: colors.primary}]}>
              {patients.length}
            </Text>
            <Text style={[styles.statLabel, {color: colors.text}]}>
              Total Pacientes
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: colors.secondary}]}>
              {patients.filter(p => p.status === 'in_treatment').length}
            </Text>
            <Text style={[styles.statLabel, {color: colors.text}]}>
              En Tratamiento
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, {color: colors.success}]}>
              {patients.filter(p => p.status === 'recovered').length}
            </Text>
            <Text style={[styles.statLabel, {color: colors.text}]}>
              Recuperados
            </Text>
          </View>
        </View>
      </Card>

      {error && (
        <Card
          style={[styles.errorCard, {backgroundColor: colors.error + '20'}]}>
          <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
        </Card>
      )}

      {filteredPatients.length > 0 && (
        <Text style={[styles.listTitle, {color: colors.text}]}>
          {searchQuery.trim()
            ? `Resultados de búsqueda (${filteredPatients.length})`
            : `Pacientes registrados (${filteredPatients.length})`}
        </Text>
      )}

      {/* Botón temporal para cargar datos de prueba */}
      {patients.length === 0 && (
        <Card style={styles.mockDataCard}>
          <Text style={[styles.mockDataTitle, {color: colors.primary}]}>
            🧪 Modo Desarrollo
          </Text>
          <Text style={[styles.mockDataText, {color: colors.text}]}>
            Carga algunos pacientes de ejemplo para probar la aplicación
          </Text>
          <Button
            text="Cargar Datos de Prueba"
            type="secondary"
            onPress={handleLoadMockData}
            buttonStyle={styles.mockDataButton}
          />
        </Card>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderPatient}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* Botón flotante para agregar paciente */}
      <View style={[styles.fab, {backgroundColor: colors.primary}]}>
        <Button
          text="+"
          type="primary"
          textStyle={styles.fabText}
          onPress={handleNavigateToForm}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Espacio para el FAB
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleBold: {
    fontWeight: '900',
  },
  newPatientButton: {
    marginBottom: 10,
  },
  statsCard: {
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  errorCard: {
    marginVertical: 10,
    padding: 12,
  },
  errorText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCard: {
    marginTop: 40,
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
  },
  fabText: {
    fontSize: 24,
    fontWeight: '300',
  },
  mockDataCard: {
    marginVertical: 10,
    backgroundColor: 'purple',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  mockDataTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  mockDataText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  mockDataButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
});
