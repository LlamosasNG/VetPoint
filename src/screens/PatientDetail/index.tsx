// src/screens/PatientDetail/index.tsx - Versión profesional completa

import {Button, Card, VetHeader} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {PatientDetailScreenProps} from '@navigation/types';
import React, {useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');

interface TabInfo {
  key: string;
  title: string;
  icon: string;
  color: string;
}

export const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {selectedPatient, selectPatient, deletePatient} = usePatients();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'medical' | 'history' | 'appointments'
  >('overview');
  const [scrollY] = useState(new Animated.Value(0));

  // Redireccionar si no hay paciente seleccionado
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

  // Configuración de pestañas
  const tabs: TabInfo[] = [
    {key: 'overview', title: 'Resumen', icon: '📋', color: colors.primary},
    {key: 'medical', title: 'Médico', icon: '🏥', color: colors.secondary},
    {key: 'history', title: 'Historial', icon: '📊', color: colors.accent},
    {key: 'appointments', title: 'Citas', icon: '📅', color: colors.info},
  ];

  const handleGoBack = () => {
    selectPatient(null);
    navigation.goBack();
  };

  const handleEdit = () => {
    navigation.navigate('PatientForm');
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro de eliminar permanentemente el registro de ${patient.name}?\n\nEsta acción no se puede deshacer y se perderá toda la información médica asociada.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar Definitivamente',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patient.id);
              selectPatient(null);
              navigation.navigate('Home');
              Alert.alert(
                'Eliminado',
                'El registro del paciente ha sido eliminado correctamente',
              );
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo eliminar el registro del paciente',
              );
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: typeof patient.status) => {
    switch (status) {
      case 'active':
        return colors.statusActive;
      case 'in_treatment':
        return colors.statusTreatment;
      case 'recovered':
        return colors.statusRecovered;
      case 'emergency':
        return colors.statusEmergency;
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
        return 'Sin Estado';
    }
  };

  const getStatusIcon = (status: typeof patient.status) => {
    switch (status) {
      case 'active':
        return '🐾';
      case 'in_treatment':
        return '🏥';
      case 'recovered':
        return '✅';
      case 'emergency':
        return '🚨';
      default:
        return '📋';
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysAgo = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  // Header del paciente con información básica
  const renderPatientHeader = () => (
    <View style={[styles.patientHeader, {backgroundColor: colors.primary}]}>
      <View style={styles.headerContent}>
        {/* Información principal */}
        <View style={styles.patientMainInfo}>
          <View style={styles.nameSection}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <View style={styles.genderAge}>
              <Text style={styles.genderIcon}>
                {patient.gender === 'male'
                  ? '♂'
                  : patient.gender === 'female'
                  ? '♀'
                  : ''}
              </Text>
              {patient.age && (
                <Text style={styles.ageText}>{patient.age} años</Text>
              )}
            </View>
          </View>

          <Text style={styles.speciesBreed}>
            {patient.species}
            {patient.breed && ` • ${patient.breed}`}
          </Text>

          <Text style={styles.ownerInfo}>Propietario: {patient.ownerName}</Text>
        </View>

        {/* Estado del paciente */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: 'rgba(255, 255, 255, 0.2)'},
            ]}>
            <Text style={styles.statusIcon}>
              {getStatusIcon(patient.status)}
            </Text>
            <Text style={styles.statusText}>
              {getStatusLabel(patient.status)}
            </Text>
          </View>

          <Text style={styles.registeredDate}>
            Registrado: {getDaysAgo(patient.dateCreated)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Sistema de pestañas mejorado
  const renderTabNavigation = () => (
    <View style={[styles.tabContainer, {backgroundColor: colors.card}]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabScrollContent}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && [
                  styles.activeTab,
                  {backgroundColor: tab.color + '15'},
                ],
              ]}
              onPress={() => setActiveTab(tab.key as any)}
              activeOpacity={0.7}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab.key ? tab.color : colors.onSurface,
                    fontWeight: activeTab === tab.key ? '700' : '500',
                  },
                ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Pestaña de Resumen General
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Información de contacto */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionIcon, {color: colors.primary}]}>👤</Text>
          <Text style={[styles.sectionTitle, {color: colors.primary}]}>
            Información de Contacto
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, {color: colors.onSurface}]}>
              PROPIETARIO
            </Text>
            <Text style={[styles.infoValue, {color: colors.text}]}>
              {patient.ownerName}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, {color: colors.onSurface}]}>
              EMAIL
            </Text>
            <Text style={[styles.infoValue, {color: colors.text}]}>
              {patient.ownerEmail}
            </Text>
          </View>

          {patient.ownerPhone && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, {color: colors.onSurface}]}>
                TELÉFONO
              </Text>
              <Text style={[styles.infoValue, {color: colors.text}]}>
                {patient.ownerPhone}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Síntomas principales */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionIcon, {color: colors.warning}]}>⚠️</Text>
          <Text style={[styles.sectionTitle, {color: colors.warning}]}>
            Síntomas Reportados
          </Text>
        </View>

        <View
          style={[styles.symptomsContainer, {backgroundColor: colors.surface}]}>
          <Text style={[styles.symptomsText, {color: colors.text}]}>
            {patient.symptoms}
          </Text>
        </View>
      </Card>

      {/* Fechas importantes */}
      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.sectionIcon, {color: colors.info}]}>📅</Text>
          <Text style={[styles.sectionTitle, {color: colors.info}]}>
            Cronología
          </Text>
        </View>

        <View style={styles.timelineContainer}>
          <View style={styles.timelineItem}>
            <View
              style={[styles.timelineDot, {backgroundColor: colors.primary}]}
            />
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineLabel, {color: colors.onSurface}]}>
                FECHA DE REGISTRO
              </Text>
              <Text style={[styles.timelineValue, {color: colors.text}]}>
                {formatDate(patient.dateCreated)}
              </Text>
            </View>
          </View>

          {patient.lastVisit && (
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  {backgroundColor: colors.secondary},
                ]}
              />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, {color: colors.onSurface}]}>
                  ÚLTIMA CONSULTA
                </Text>
                <Text style={[styles.timelineValue, {color: colors.text}]}>
                  {formatDate(patient.lastVisit)}
                </Text>
              </View>
            </View>
          )}

          {patient.nextAppointment && (
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, {backgroundColor: colors.accent}]}
              />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineLabel, {color: colors.onSurface}]}>
                  PRÓXIMA CITA
                </Text>
                <Text style={[styles.timelineValue, {color: colors.accent}]}>
                  {formatDateTime(patient.nextAppointment)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Card>
    </View>
  );

  // Pestaña Médica
  const renderMedicalTab = () => (
    <View style={styles.tabContent}>
      {/* Diagnóstico */}
      {patient.diagnosis && (
        <Card variant="elevated" style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionIcon, {color: colors.secondary}]}>
              🔬
            </Text>
            <Text style={[styles.sectionTitle, {color: colors.secondary}]}>
              Diagnóstico
            </Text>
          </View>

          <View
            style={[styles.medicalContent, {backgroundColor: colors.surface}]}>
            <Text style={[styles.medicalText, {color: colors.text}]}>
              {patient.diagnosis}
            </Text>
          </View>
        </Card>
      )}

      {/* Tratamiento */}
      {patient.treatment && (
        <Card variant="elevated" style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionIcon, {color: colors.success}]}>
              💊
            </Text>
            <Text style={[styles.sectionTitle, {color: colors.success}]}>
              Plan de Tratamiento
            </Text>
          </View>

          <View
            style={[styles.medicalContent, {backgroundColor: colors.surface}]}>
            <Text style={[styles.medicalText, {color: colors.text}]}>
              {patient.treatment}
            </Text>
          </View>
        </Card>
      )}

      {/* Notas médicas */}
      {patient.notes && (
        <Card variant="elevated" style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionIcon, {color: colors.accent}]}>📝</Text>
            <Text style={[styles.sectionTitle, {color: colors.accent}]}>
              Notas Médicas
            </Text>
          </View>

          <View
            style={[styles.medicalContent, {backgroundColor: colors.surface}]}>
            <Text style={[styles.medicalText, {color: colors.text}]}>
              {patient.notes}
            </Text>
          </View>
        </Card>
      )}

      {/* Si no hay información médica */}
      {!patient.diagnosis && !patient.treatment && !patient.notes && (
        <Card variant="outlined" style={styles.emptyCard}>
          <Text style={[styles.emptyIcon, {color: colors.onSurface}]}>🏥</Text>
          <Text style={[styles.emptyTitle, {color: colors.text}]}>
            Información Médica Pendiente
          </Text>
          <Text style={[styles.emptySubtitle, {color: colors.onSurface}]}>
            Complete el diagnóstico y tratamiento editando el registro del
            paciente
          </Text>
          <Button
            text="Completar Información"
            type="primary"
            onPress={handleEdit}
            buttonStyle={styles.emptyButton}
          />
        </Card>
      )}
    </View>
  );

  // Pestaña de Historial
  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Card variant="outlined" style={styles.emptyCard}>
        <Text style={[styles.emptyIcon, {color: colors.onSurface}]}>📊</Text>
        <Text style={[styles.emptyTitle, {color: colors.text}]}>
          Historial Médico Completo
        </Text>
        <Text style={[styles.emptySubtitle, {color: colors.onSurface}]}>
          Próximamente: Seguimiento detallado de visitas, evolución del
          tratamiento, resultados de exámenes y gráficos de progreso del
          paciente.
        </Text>

        <View style={styles.featureList}>
          <Text style={[styles.featureItem, {color: colors.onSurface}]}>
            • 📈 Gráficos de evolución
          </Text>
          <Text style={[styles.featureItem, {color: colors.onSurface}]}>
            • 📋 Historial de consultas
          </Text>
          <Text style={[styles.featureItem, {color: colors.onSurface}]}>
            • 💉 Registro de vacunas
          </Text>
          <Text style={[styles.featureItem, {color: colors.onSurface}]}>
            • 🧪 Resultados de laboratorio
          </Text>
        </View>
      </Card>
    </View>
  );

  // Pestaña de Citas
  const renderAppointmentsTab = () => (
    <View style={styles.tabContent}>
      {patient.nextAppointment && (
        <Card variant="elevated" style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionIcon, {color: colors.accent}]}>📅</Text>
            <Text style={[styles.sectionTitle, {color: colors.accent}]}>
              Próxima Cita Programada
            </Text>
          </View>

          <View
            style={[
              styles.appointmentCard,
              {backgroundColor: colors.accent + '10'},
            ]}>
            <View style={styles.appointmentInfo}>
              <Text style={[styles.appointmentDate, {color: colors.accent}]}>
                {formatDateTime(patient.nextAppointment)}
              </Text>
              <Text style={[styles.appointmentType, {color: colors.text}]}>
                Consulta de seguimiento
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.appointmentAction, {borderColor: colors.accent}]}
              onPress={() =>
                Alert.alert('Función', 'Gestión de citas próximamente')
              }>
              <Text
                style={[styles.appointmentActionText, {color: colors.accent}]}>
                Modificar
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      <Card variant="outlined" style={styles.emptyCard}>
        <Text style={[styles.emptyIcon, {color: colors.onSurface}]}>📅</Text>
        <Text style={[styles.emptyTitle, {color: colors.text}]}>
          Sistema de Citas Médicas
        </Text>
        <Text style={[styles.emptySubtitle, {color: colors.onSurface}]}>
          Próximamente: Calendario completo, recordatorios automáticos,
          historial de citas y sincronización con calendarios externos.
        </Text>
      </Card>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'medical':
        return renderMedicalTab();
      case 'history':
        return renderHistoryTab();
      case 'appointments':
        return renderAppointmentsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader
        screenTitle={`Paciente: ${patient.name}`}
        showBackButton
        onBackPress={handleGoBack}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        {renderPatientHeader()}
        {renderTabNavigation()}
        {renderTabContent()}

        {/* Espaciado para botones flotantes */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Botones de acción flotantes */}
      <View style={[styles.actionBar, {backgroundColor: colors.card}]}>
        <Button
          text="✏️ Editar"
          type="primary"
          onPress={handleEdit}
          buttonStyle={[styles.actionButton, styles.editActionButton]}
          textStyle={styles.actionButtonText}
        />

        <Button
          text="🗑️ Eliminar"
          type="danger"
          onPress={handleDelete}
          buttonStyle={[styles.actionButton, styles.deleteActionButton]}
          textStyle={styles.actionButtonText}
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },

  // Header del paciente
  patientHeader: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientMainInfo: {
    flex: 1,
    marginRight: 16,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  genderAge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  genderIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 6,
  },
  ageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF90',
  },
  speciesBreed: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF90',
    marginBottom: 6,
  },
  ownerInfo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF70',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  registeredDate: {
    fontSize: 12,
    color: '#FFFFFF70',
    fontWeight: '500',
  },

  // Sistema de pestañas
  tabContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
    paddingTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 100,
  },
  activeTab: {
    borderWidth: 1,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Contenido de pestañas
  tabContent: {
    padding: 20,
  },
  sectionCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Información general
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },

  // Síntomas
  symptomsContainer: {
    padding: 16,
    borderRadius: 12,
  },
  symptomsText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  // Timeline
  timelineContainer: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Contenido médico
  medicalContent: {
    padding: 16,
    borderRadius: 12,
  },
  medicalText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  // Citas
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    fontWeight: '500',
  },
  appointmentAction: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  appointmentActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Estados vacíos
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  featureList: {
    alignSelf: 'stretch',
    marginTop: 16,
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },

  // Botones de acción
  bottomSpacing: {
    height: 100,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
  },
  editActionButton: {
    flex: 2,
  },
  deleteActionButton: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'none',
  },
});
