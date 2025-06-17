import {Button, Card} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
      'Eliminar Paciente',
      `¿Estás seguro de que deseas eliminar a ${patient.name}?`,
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
        return 'Desconocido';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.touchable}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, {color: colors.primary}]}>
              {patient.name}
            </Text>
            <Text style={[styles.species, {color: colors.text}]}>
              {patient.species}
              {patient.breed && ` - ${patient.breed}`}
              {patient.age && ` (${patient.age} años)`}
            </Text>
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

        <View style={styles.ownerInfo}>
          <Text style={[styles.label, {color: colors.gray}]}>Propietario:</Text>
          <Text style={[styles.ownerName, {color: colors.text}]}>
            {patient.ownerName}
          </Text>
          <Text style={[styles.ownerEmail, {color: colors.gray}]}>
            {patient.ownerEmail}
          </Text>
        </View>

        <View style={styles.symptomsContainer}>
          <Text style={[styles.label, {color: colors.gray}]}>Síntomas:</Text>
          <Text
            style={[styles.symptoms, {color: colors.text}]}
            numberOfLines={2}>
            {patient.symptoms}
          </Text>
        </View>

        <View style={styles.dateInfo}>
          <Text style={[styles.dateLabel, {color: colors.gray}]}>
            Fecha de registro: {formatDate(patient.dateCreated)}
          </Text>
          {patient.nextAppointment && (
            <Text style={[styles.nextAppointment, {color: colors.secondary}]}>
              Próxima cita: {formatDate(patient.nextAppointment)}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            text="Editar"
            type="secondary"
            buttonStyle={styles.actionButton}
            onPress={e => {
              e?.stopPropagation?.();
              onEdit?.();
            }}
          />
          <Button
            text="Eliminar"
            type="danger"
            buttonStyle={styles.actionButton}
            onPress={e => {
              e?.stopPropagation?.();
              handleDelete();
            }}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 4,
  },
  card: {
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  species: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ownerInfo: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ownerEmail: {
    fontSize: 14,
  },
  symptomsContainer: {
    marginBottom: 12,
  },
  symptoms: {
    fontSize: 14,
    lineHeight: 20,
  },
  dateInfo: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  nextAppointment: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
  },
});
