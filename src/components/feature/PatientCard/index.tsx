import {Button, PatientStatusCard} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Patient} from '../../../types/Patient';

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onPress,
  onEdit,
  onDelete,
}) => {
  const {colors} = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro de eliminar el registro de ${patient.name}?\n\nEsta acción no se puede deshacer.`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    );
  };

  const getStatusColor = (status: Patient['status']) => {
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

  const getStatusLabel = (status: Patient['status']) => {
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

  const getStatusIcon = (status: Patient['status']) => {
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={styles.touchable}>
      <PatientStatusCard status={patient.status} style={styles.card}>
        {/* Header con información principal */}
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.patientName, {color: colors.text}]}>
                {patient.name}
              </Text>
              <View style={styles.genderIndicator}>
                <Text style={[styles.genderText, {color: colors.onSurface}]}>
                  {patient.gender === 'male'
                    ? '♂'
                    : patient.gender === 'female'
                    ? '♀'
                    : ''}
                </Text>
              </View>
            </View>
            <Text style={[styles.speciesInfo, {color: colors.onSurface}]}>
              {patient.species}
              {patient.breed && ` • ${patient.breed}`}
              {patient.age && ` • ${patient.age} años`}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(patient.status) + '20'},
              ]}>
              <Text style={styles.statusIcon}>
                {getStatusIcon(patient.status)}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  {color: getStatusColor(patient.status)},
                ]}>
                {getStatusLabel(patient.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Información del propietario */}
        <View style={styles.ownerSection}>
          <View style={styles.ownerInfo}>
            <Text style={[styles.sectionLabel, {color: colors.onSurface}]}>
              PROPIETARIO
            </Text>
            <Text
              style={[styles.ownerName, {color: colors.text}]}
              numberOfLines={1}>
              {patient.ownerName}
            </Text>
            <Text
              style={[styles.ownerContact, {color: colors.onSurface}]}
              numberOfLines={1}>
              {patient.ownerEmail}
            </Text>
          </View>
        </View>

        {/* Síntomas - Vista previa */}
        <View style={styles.symptomsSection}>
          <Text style={[styles.sectionLabel, {color: colors.onSurface}]}>
            SÍNTOMAS
          </Text>
          <Text
            style={[styles.symptomsText, {color: colors.text}]}
            numberOfLines={2}>
            {patient.symptoms}
          </Text>
        </View>

        {/* Información de fechas */}
        <View style={styles.datesSection}>
          <View style={styles.dateItem}>
            <Text style={[styles.dateLabel, {color: colors.onSurface}]}>
              Registro
            </Text>
            <Text style={[styles.dateValue, {color: colors.text}]}>
              {formatDate(patient.dateCreated)}
            </Text>
          </View>

          {patient.nextAppointment && (
            <View style={styles.dateItem}>
              <Text style={[styles.dateLabel, {color: colors.secondary}]}>
                Próxima Cita
              </Text>
              <Text style={[styles.dateValue, {color: colors.secondary}]}>
                {formatDateShort(patient.nextAppointment)}
              </Text>
            </View>
          )}
        </View>

        {/* Divisor */}
        <View style={[styles.divider, {backgroundColor: colors.divider}]} />

        {/* Botones de acción */}
        <View style={styles.actions}>
          <Button
            text="Ver Detalles"
            type="primary"
            buttonStyle={[styles.actionButton, styles.detailsButton]}
            textStyle={styles.actionButtonText}
            onPress={() => {
              onPress?.();
            }}
          />
          <Button
            text="Editar"
            type="secondary"
            buttonStyle={[styles.actionButton, styles.editButton]}
            textStyle={styles.actionButtonText}
            onPress={() => {
              onEdit?.();
            }}
          />
          <TouchableOpacity
            style={[styles.deleteButton, {borderColor: colors.error}]}
            onPress={(e: GestureResponderEvent) => {
              e?.stopPropagation?.();
              handleDelete();
            }}>
            <Text style={[styles.deleteButtonText, {color: colors.error}]}>
              🗑️
            </Text>
          </TouchableOpacity>
        </View>
      </PatientStatusCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 6,
  },
  card: {
    marginVertical: 0,
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  patientInfo: {
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  genderIndicator: {
    marginLeft: 8,
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600',
  },
  speciesInfo: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 100,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerSection: {
    marginBottom: 16,
  },
  ownerInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 12,
    borderRadius: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ownerContact: {
    fontSize: 14,
    fontWeight: '400',
  },
  symptomsSection: {
    marginBottom: 16,
  },
  symptomsText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  datesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsButton: {
    flex: 2,
  },
  editButton: {
    flex: 1.5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'none',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 16,
  },
});
