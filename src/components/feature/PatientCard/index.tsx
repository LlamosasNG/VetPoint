import {Patient, PatientStatus} from '@/types/Patient';
import {PatientStatusCard} from '@components/ui';
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
import Icon from 'react-native-vector-icons/Ionicons';

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Pequeño componente para mostrar información con un icono
const InfoPill = ({icon, text, color}) => (
  <View style={[styles.infoPill, {backgroundColor: color + '15'}]}>
    <Icon name={icon} size={14} color={color} />
    <Text style={[styles.infoPillText, {color: color}]}>{text}</Text>
  </View>
);

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onPress,
  onEdit,
  onDelete,
}) => {
  const {colors} = useTheme();

  const handleDelete = (e: GestureResponderEvent) => {
    e.stopPropagation();
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro de eliminar el registro de ${patient.name}?`,
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

  const getStatusInfo = (
    status: PatientStatus,
  ): {label: string; color: string; icon: string} => {
    switch (status) {
      case 'active':
        return {label: 'Activo', color: colors.statusActive, icon: 'paw'};
      case 'in_treatment':
        return {
          label: 'Tratamiento',
          color: colors.statusTreatment,
          icon: 'pulse',
        };
      case 'emergency':
        return {
          label: 'Emergencia',
          color: colors.statusEmergency,
          icon: 'alert-circle',
        };
      case 'recovered':
        return {
          label: 'Recuperado',
          color: colors.statusRecovered,
          icon: 'checkmark-circle',
        };
      default:
        return {label: 'Sin Estado', color: colors.gray, icon: 'help-circle'};
    }
  };

  const statusInfo = getStatusInfo(patient.status);

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.touchable}>
      <PatientStatusCard status={patient.status} style={styles.card}>
        {/* Header de la Tarjeta */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.patientName, {color: colors.text}]}>
              {patient.name}
            </Text>
            <Text style={[styles.species, {color: colors.gray}]}>
              {patient.species} {patient.breed ? `(${patient.breed})` : ''}
            </Text>
          </View>
          <View>
            <InfoPill
              icon={statusInfo.icon}
              text={statusInfo.label}
              color={statusInfo.color}
            />
          </View>
        </View>

        {/* Separador */}
        <View style={[styles.divider, {backgroundColor: colors.border}]} />

        {/* Cuerpo de la Tarjeta */}
        <View style={styles.body}>
          <View style={styles.infoSection}>
            <Icon
              name="person-outline"
              size={16}
              color={colors.gray}
              style={styles.bodyIcon}
            />
            <Text style={[styles.bodyText, {color: colors.text}]}>
              <Text style={{fontWeight: 'bold'}}>Propietario:</Text>{' '}
              {patient.ownerName}
            </Text>
          </View>
          <View style={styles.infoSection}>
            <Icon
              name="document-text-outline"
              size={16}
              color={colors.gray}
              style={styles.bodyIcon}
            />
            <Text
              style={[styles.bodyText, {color: colors.text}]}
              numberOfLines={2}>
              <Text style={{fontWeight: 'bold'}}>Síntomas:</Text>{' '}
              {patient.symptoms}
            </Text>
          </View>
          <View style={styles.infoSection}>
            <Icon
              name="calendar-outline"
              size={16}
              color={colors.gray}
              style={styles.bodyIcon}
            />
            <Text style={[styles.bodyText, {color: colors.text}]}>
              <Text style={{fontWeight: 'bold'}}>Última Visita:</Text>{' '}
              {formatDate(patient.lastVisit)}
            </Text>
          </View>
        </View>

        {/* Footer con Botones de Acción */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Icon name="pencil-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, {color: colors.primary}]}>
              Editar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icon name="trash-outline" size={20} color={colors.error} />
            <Text style={[styles.actionButtonText, {color: colors.error}]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </PatientStatusCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginVertical: 8,
  },
  card: {
    marginVertical: 0,
    padding: 0, // El padding ahora se controla internamente
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  species: {
    fontSize: 14,
    marginTop: 2,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  divider: {
    height: 1,
  },
  body: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  bodyIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', // Un color de borde sutil
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});
