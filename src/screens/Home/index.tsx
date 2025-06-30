import {Patient, PatientStatus} from '@/types/Patient';
import {PatientCard} from '@components/feature/PatientCard';
import {Button, SearchBar, StatsCard, VetHeader} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {HomeStackScreenProps} from '@navigation/types';
import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type StatusFilter = 'all' | PatientStatus;

// Se saca el componente FilterButton para evitar que se re-cree en cada render
const FilterButton = ({label, filter, activeFilter, onPress, colors}) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      {
        backgroundColor:
          activeFilter === filter ? colors.primary : colors.surface,
        borderColor: activeFilter === filter ? colors.primary : colors.border,
      },
    ]}
    onPress={() => onPress(filter)}>
    <Text
      style={{
        color: activeFilter === filter ? '#FFF' : colors.text,
        fontWeight: '600',
      }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const HomeScreen: React.FC<HomeStackScreenProps<'Home'>> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {patients, loading, error, selectPatient, deletePatient, loadMockData} =
    usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients;

    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(lowercasedQuery) ||
          p.ownerName.toLowerCase().includes(lowercasedQuery) ||
          p.species.toLowerCase().includes(lowercasedQuery),
      );
    }

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.status === activeFilter);
    }

    return filtered.sort((a, b) => {
      if (a.status === 'emergency' && b.status !== 'emergency') return -1;
      if (b.status === 'emergency' && a.status !== 'emergency') return 1;
      return (
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
    });
  }, [patients, searchQuery, activeFilter]);

  const stats = useMemo(
    () => ({
      total: patients.length,
      active: patients.filter(p => p.status === 'active').length,
      inTreatment: patients.filter(p => p.status === 'in_treatment').length,
      emergency: patients.filter(p => p.status === 'emergency').length,
    }),
    [patients],
  );

  const handleAddNewPatient = () => {
    selectPatient(null);
    navigation.navigate('PatientForm');
  };

  const handleLoadMockData = async () => {
    try {
      await loadMockData();
      Alert.alert('Éxito', 'Los pacientes de prueba han sido cargados.');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de prueba.');
    }
  };

  const handlePatientPress = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientDetail');
  };

  const handleEditPatient = (patient: Patient) => {
    selectPatient(patient);
    navigation.navigate('PatientForm');
  };

  const handleDeletePatient = (patientId: string) => {
    Alert.alert('Confirmar', '¿Seguro que quieres eliminar este paciente?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deletePatient(patientId),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader screenTitle="Dashboard" />

      {/* --- EL HEADER AHORA ES ESTÁTICO Y ESTÁ FUERA DE LA LISTA --- */}
      <View style={styles.staticHeader}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Resumen General
        </Text>
        <View style={styles.statsRow}>
          <StatsCard
            label="Total"
            value={stats.total}
            icon="paw"
            color={colors.primary}
          />
          <StatsCard
            label="Tratamiento"
            value={stats.inTreatment}
            icon="pulse"
            color={colors.warning}
          />
          <StatsCard
            label="Emergencias"
            value={stats.emergency}
            icon="alert-circle"
            color={colors.error}
          />
        </View>

        <Text
          style={[styles.sectionTitle, {color: colors.text, marginTop: 20}]}>
          Filtros de Pacientes
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollView}>
          <FilterButton
            label="Todos"
            filter="all"
            activeFilter={activeFilter}
            onPress={setActiveFilter}
            colors={colors}
          />
          <FilterButton
            label="Activos"
            filter="active"
            activeFilter={activeFilter}
            onPress={setActiveFilter}
            colors={colors}
          />
          <FilterButton
            label="Tratamiento"
            filter="in_treatment"
            activeFilter={activeFilter}
            onPress={setActiveFilter}
            colors={colors}
          />
          <FilterButton
            label="Emergencia"
            filter="emergency"
            activeFilter={activeFilter}
            onPress={setActiveFilter}
            colors={colors}
          />
          <FilterButton
            label="Recuperados"
            filter="recovered"
            activeFilter={activeFilter}
            onPress={setActiveFilter}
            colors={colors}
          />
        </ScrollView>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar por nombre, especie..."
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{marginVertical: 10}}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={filteredAndSortedPatients}
        keyExtractor={item => item.id}
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
            <Text style={[styles.emptyTitle, {color: colors.text}]}>
              No se encontraron pacientes
            </Text>
            <Text style={[styles.emptySubtitle, {color: colors.gray}]}>
              {patients.length === 0
                ? 'Aún no has registrado ningún paciente.'
                : 'Intenta con otros filtros o términos de búsqueda.'}
            </Text>
            <Button
              text="Añadir Primer Paciente"
              onPress={handleAddNewPatient}
              buttonStyle={{marginTop: 10}}
            />
            {__DEV__ && (
              <Button
                text="Cargar Datos de Prueba"
                type="secondary"
                onPress={handleLoadMockData}
                buttonStyle={{marginTop: 20}}
              />
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.primary}]}
        onPress={handleAddNewPatient}
        activeOpacity={0.8}>
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  staticHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  filtersScrollView: {
    paddingBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  }, // Más padding inferior para el FAB
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
