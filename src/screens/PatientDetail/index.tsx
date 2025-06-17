import {Button, Card} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {PatientDetailScreenProps} from '@navigation/types';
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {selectedPatient, selectPatient, deletePatient} = usePatients();
  const [activeTab, setActiveTab] = useState<'info' | 'medical' | 'history'>(
    'info',
  );

  // Si no hay paciente seleccionado, volver al home
  React.useEffect(() => {
    if (!selectedPatient) {
      navigation.navigate('Home');
    }
  }, [selectedPatient, navigation]);

  if (!selectedPatient) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: colors.text}]}>
            Cargando información del paciente...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const patient = selectedPatient;

  const handleGoBack = () => {
    selectPatient(null);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('PatientForm');
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Paciente',
      `¿Estás seguro de que deseas eliminar a ${patient.name}? Esta acción no se puede deshacer.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patient.id);
              selectPatient(null);
              navigation.navigate('Home');
              Alert.alert('Éxito', 'Paciente eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el paciente');
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: typeof patient.status) => {
    switch (status) {
      case 'active':
        return colors.primary;
      case 'in_treatment':
        return colors.secondary;
      case 'recovered':
        return colors.success;
      case 'emergency':
        return colors.error;
      default:
        return colors.gray;
    }
  };

  const getStatusLabel = (status: typeof patient.status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'in_treatment':
        return 'En Tratamiento';
      case 'recovered':
        return 'Recuperado';
      case 'emergency':
        return 'Emergencia';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderInfoTab = () => (
    <View>
      <Card style={styles.infoCard}>
        <View style={styles.patientHeader}>
          <View style={styles.patientMainInfo}>
            <Text style={[styles.patientName, {color: colors.primary}]}>
              {patient.name}
            </Text>
            <Text style={[styles.patientSpecies, {color: colors.text}]}>
              {patient.species}
              {patient.breed && ` - ${patient.breed}`}
            </Text>
            {patient.age && (
              <Text style={[styles.patientAge, {color: colors.gray}]}>
                {patient.age} años -{' '}
                {patient.gender === 'male'
                  ? 'Macho'
                  : patient.gender === 'female'
                  ? 'Hembra'
                  : 'No especificado'}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(patient.status) + '20'},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(patient.status)},
              ]}>
              {getStatusLabel(patient.status)}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, {color: colors.primary}]}>
          Información del Propietario
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, {color: colors.gray}]}>Nombre:</Text>
          <Text style={[styles.value, {color: colors.text}]}>
            {patient.ownerName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.label, {color: colors.gray}]}>Email:</Text>
          <Text style={[styles.value, {color: colors.text}]}>
            {patient.ownerEmail}
          </Text>
        </View>
        {patient.ownerPhone && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: colors.gray}]}>Teléfono:</Text>
            <Text style={[styles.value, {color: colors.text}]}>
              {patient.ownerPhone}
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, {color: colors.primary}]}>
          Fechas Importantes
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, {color: colors.gray}]}>Registrado:</Text>
          <Text style={[styles.value, {color: colors.text}]}>
            {formatDate(patient.dateCreated)}
          </Text>
        </View>
        {patient.lastVisit && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: colors.gray}]}>
              Última visita:
            </Text>
            <Text style={[styles.value, {color: colors.text}]}>
              {formatDate(patient.lastVisit)}
            </Text>
          </View>
        )}
        {patient.nextAppointment && (
          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: colors.gray}]}>
              Próxima cita:
            </Text>
            <Text style={[styles.value, {color: colors.secondary}]}>
              {formatDateTime(patient.nextAppointment)}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );

  const renderMedicalTab = () => (
    <View>
      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, {color: colors.primary}]}>
          Síntomas
        </Text>
        <Text style={[styles.medicalText, {color: colors.text}]}>
          {patient.symptoms}
        </Text>
      </Card>

      {patient.diagnosis && (
        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, {color: colors.primary}]}>
            Diagnóstico
          </Text>
          <Text style={[styles.medicalText, {color: colors.text}]}>
            {patient.diagnosis}
          </Text>
        </Card>
      )}

      {patient.treatment && (
        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, {color: colors.primary}]}>
            Tratamiento
          </Text>
          <Text style={[styles.medicalText, {color: colors.text}]}>
            {patient.treatment}
          </Text>
        </Card>
      )}

      {patient.notes && (
        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, {color: colors.primary}]}>
            Notas Adicionales
          </Text>
          <Text style={[styles.medicalText, {color: colors.text}]}>
            {patient.notes}
          </Text>
        </Card>
      )}
    </View>
  );

  const renderHistoryTab = () => (
    <Card style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, {color: colors.primary}]}>
        Historial Médico
      </Text>
      <Text style={[styles.comingSoonText, {color: colors.gray}]}>
        📋 Próximamente: Historial completo de visitas, tratamientos y evolución
        del paciente.
      </Text>
      <Text style={[styles.basicHistoryText, {color: colors.text}]}>
        Por ahora puedes ver la información básica en las otras pestañas.
      </Text>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'medical':
        return renderMedicalTab();
      case 'history':
        return renderHistoryTab();
      default:
        return renderInfoTab();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.secondary}]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Información <Text style={styles.titleBold}>Paciente</Text>
        </Text>
      </View>

      <Button
        text="← Volver"
        buttonStyle={[styles.backButton, {backgroundColor: '#E06900'}]}
        onPress={handleGoBack}
      />

      {/* Pestañas */}
      <View style={[styles.tabsContainer, {backgroundColor: colors.card}]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'info' && [
              styles.activeTab,
              {borderBottomColor: colors.primary},
            ],
          ]}
          onPress={() => setActiveTab('info')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'info' ? colors.primary : colors.text},
            ]}>
            📝 Info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'medical' && [
              styles.activeTab,
              {borderBottomColor: colors.primary},
            ],
          ]}
          onPress={() => setActiveTab('medical')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'medical' ? colors.primary : colors.text},
            ]}>
            🏥 Médico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && [
              styles.activeTab,
              {borderBottomColor: colors.primary},
            ],
          ]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              {color: activeTab === 'history' ? colors.primary : colors.text},
            ]}>
            📋 Historial
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Botones de acción */}
      <View
        style={[styles.actionButtons, {backgroundColor: colors.background}]}>
        <Button
          text="Editar"
          type="primary"
          onPress={handleEdit}
          buttonStyle={styles.actionButton}
        />
        <Button
          text="Eliminar"
          type="danger"
          onPress={handleDelete}
          buttonStyle={styles.actionButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  titleBold: {
    fontWeight: '900',
  },
  backButton: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    marginTop: 0,
    marginBottom: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientMainInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  patientSpecies: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  medicalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  basicHistoryText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
  },
});
