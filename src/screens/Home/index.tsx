// src/screens/Home/index.tsx - Versión profesional

import {mockPatients} from '@/utils/mockData';
import {PatientCard} from '@components/feature/PatientCard';
import {Button, Card, SearchBar, StatsCard, VetHeader} from '@components/ui';
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
  TouchableOpacity,
  View,
} from 'react-native';
import {Patient} from '../../types/Patient';

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {colors, isDarkMode, setTheme, theme} = useTheme();
  const {
    patients,
    loading,
    error,
    selectPatient,
    deletePatient,
    searchPatients,
    loadPatients,
    loadMockPatients,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'active' | 'in_treatment' | 'emergency'
  >('all');

  // Filtrar pacientes basado en la búsqueda y filtros
  const getFilteredPatients = () => {
    let filtered = searchQuery.trim() ? searchPatients(searchQuery) : patients;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === selectedFilter);
    }

    return filtered.sort((a, b) => {
      // Emergencias primero, luego por fecha de creación
      if (a.status === 'emergency' && b.status !== 'emergency') return -1;
      if (b.status === 'emergency' && a.status !== 'emergency') return 1;
      return (
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
    });
  };

  const filteredPatients = getFilteredPatients();

  // Estadísticas
  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    inTreatment: patients.filter(p => p.status === 'in_treatment').length,
    recovered: patients.filter(p => p.status === 'recovered').length,
    emergency: patients.filter(p => p.status === 'emergency').length,
  };

  const handleNavigateToForm = () => {
    selectPatient(null);
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

  const handleLoadMockData = async () => {
    try {
      await loadMockPatients(mockPatients);
      Alert.alert(
        'Datos Cargados',
        `${mockPatients.length} pacientes de ejemplo agregados correctamente`,
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de prueba');
    }
  };

  const renderStatsHeader = () => (
    <View style={styles.statsContainer}>
      <Text style={[styles.statsTitle, {color: colors.text}]}>
        Resumen de Pacientes
      </Text>

      <View style={styles.statsGrid}>
        <StatsCard
          style={[styles.statCard, {backgroundColor: colors.primary + '15'}]}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>
            {stats.total}
          </Text>
          <Text style={[styles.statLabel, {color: colors.text}]}>Total</Text>
        </StatsCard>

        <StatsCard
          style={[
            styles.statCard,
            {backgroundColor: colors.statusActive + '15'},
          ]}>
          <Text style={[styles.statNumber, {color: colors.statusActive}]}>
            {stats.active}
          </Text>
          <Text style={[styles.statLabel, {color: colors.text}]}>Activos</Text>
        </StatsCard>

        <StatsCard
          style={[
            styles.statCard,
            {backgroundColor: colors.statusTreatment + '15'},
          ]}>
          <Text style={[styles.statNumber, {color: colors.statusTreatment}]}>
            {stats.inTreatment}
          </Text>
          <Text style={[styles.statLabel, {color: colors.text}]}>
            Tratamiento
          </Text>
        </StatsCard>

        <StatsCard
          style={[
            styles.statCard,
            {backgroundColor: colors.statusEmergency + '15'},
          ]}>
          <Text style={[styles.statNumber, {color: colors.statusEmergency}]}>
            {stats.emergency}
          </Text>
          <Text style={[styles.statLabel, {color: colors.text}]}>
            Emergencias
          </Text>
        </StatsCard>
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <Text style={[styles.filtersTitle, {color: colors.text}]}>
        Filtrar por Estado
      </Text>

      <View style={styles.filterButtons}>
        {[
          {key: 'all', label: 'Todos', icon: '📋'},
          {key: 'active', label: 'Activos', icon: '🐾'},
          {key: 'in_treatment', label: 'Tratamiento', icon: '🏥'},
          {key: 'emergency', label: 'Emergencias', icon: '🚨'},
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === filter.key
                    ? colors.primary
                    : colors.surface,
                borderColor:
                  selectedFilter === filter.key
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}>
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === filter.key ? '#FFFFFF' : colors.text,
                },
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSearchAndActions = () => (
    <View style={styles.searchSection}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por nombre, propietario, síntomas..."
      />

      <Button
        text="+ Nueva Consulta"
        type="primary"
        buttonStyle={styles.newPatientButton}
        onPress={handleNavigateToForm}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (searchQuery.trim() || selectedFilter !== 'all') {
      return (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyIcon, {color: colors.onSurface}]}>🔍</Text>
          <Text style={[styles.emptyTitle, {color: colors.text}]}>
            No se encontraron resultados
          </Text>
          <Text style={[styles.emptySubtitle, {color: colors.onSurface}]}>
            {searchQuery.trim()
              ? `No hay pacientes que coincidan con "${searchQuery}"`
              : `No hay pacientes con estado "${selectedFilter}"`}
          </Text>
          <Button
            text="Limpiar Filtros"
            type="secondary"
            onPress={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            buttonStyle={styles.clearButton}
          />
        </Card>
      );
    }

    return (
      <Card style={styles.emptyCard}>
        <Text style={[styles.emptyIcon, {color: colors.onSurface}]}>🏥</Text>
        <Text style={[styles.emptyTitle, {color: colors.text}]}>
          Bienvenido a VetCare Pro
        </Text>
        <Text style={[styles.emptySubtitle, {color: colors.onSurface}]}>
          Comience registrando el primer paciente para gestionar consultas
          veterinarias de manera profesional
        </Text>
        <Button
          text="Registrar Primer Paciente"
          type="primary"
          onPress={handleNavigateToForm}
          buttonStyle={styles.firstPatientButton}
        />

        {/* Botón para datos de prueba solo en desarrollo */}
        <View style={styles.devSection}>
          <Text style={[styles.devTitle, {color: colors.accent}]}>
            Modo Desarrollo
          </Text>
          <Button
            text="Cargar Pacientes de Ejemplo"
            type="secondary"
            onPress={handleLoadMockData}
            buttonStyle={styles.mockButton}
          />
        </View>
      </Card>
    );
  };

  const renderPatientsList = () => {
    if (filteredPatients.length === 0) {
      return renderEmptyState();
    }

    return (
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, {color: colors.text}]}>
            Pacientes Registrados
          </Text>
          <Text style={[styles.listCount, {color: colors.onSurface}]}>
            {filteredPatients.length}{' '}
            {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}
          </Text>
        </View>

        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <PatientCard
              patient={item}
              onPress={() => handlePatientPress(item)}
              onEdit={() => handleEditPatient(item)}
              onDelete={() => handleDeletePatient(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {renderStatsHeader()}
      {renderFilters()}
      {renderSearchAndActions()}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader
        screenTitle="Panel de Control"
        rightComponent={
          <TouchableOpacity
            onPress={() => setTheme(isDarkMode ? 'light' : 'dark')}
            style={styles.themeButton}>
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        }
      />

      {error && (
        <View
          style={[styles.errorBanner, {backgroundColor: colors.error + '20'}]}>
          <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
        </View>
      )}

      <FlatList
        data={[]}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderPatientsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.primary}]}
        onPress={handleNavigateToForm}
        activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeIcon: {
    fontSize: 18,
  },
  errorBanner: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchSection: {
    marginBottom: 24,
  },
  newPatientButton: {
    marginTop: 12,
  },
  listSection: {
    paddingHorizontal: 20,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyCard: {
    marginHorizontal: 20,
    marginTop: 40,
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  clearButton: {
    paddingHorizontal: 32,
  },
  firstPatientButton: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  devSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    width: '100%',
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  mockButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
});
