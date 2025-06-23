import {notificationService} from '@/services/NotificationService';
import {Button, Card, VetHeader} from '@components/ui';
import {useAuth} from '@context/AuthContext';
import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const handleTestNotification = () => {
  console.log('Intentando programar notificación de prueba en 5 segundos...');
  notificationService.scheduleTestNotification();
  Alert.alert(
    'Prueba Iniciada',
    'La notificación de prueba se ha programado para dentro de 5 segundos.',
  );
};

// Componente para mostrar cada línea de información
const InfoRow = ({icon, label, value, color}) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={22} color={color} style={styles.infoIcon} />
    <View>
      <Text style={[styles.infoLabel, {color: color}]}>{label}</Text>
      <Text style={[styles.infoValue, {color: color}]}>
        {value || 'No especificado'}
      </Text>
    </View>
  </View>
);

export const AccountScreen = () => {
  const {colors} = useTheme();
  const {userData, logout} = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!userData) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader screenTitle="Mi Perfil" />

      {/* --- BOTÓN DE PRUEBA --- */}
      <Card style={styles.detailsCard}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>
          Herramientas de Depuración
        </Text>
        <Button
          text="Probar Notificación (5 seg)"
          onPress={handleTestNotification}
          type="secondary"
        />
      </Card>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjeta de Perfil Principal */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
              <Icon name="person" size={50} color="#FFFFFF" />
            </View>
            <Text style={[styles.userName, {color: colors.text}]}>
              {userData.name}
            </Text>
            <Text style={[styles.clinicName, {color: colors.primary}]}>
              {userData.clinicName}
            </Text>
          </View>
        </Card>

        {/* Tarjeta de Detalles de Contacto */}
        <Card style={styles.detailsCard}>
          <Text style={[styles.cardTitle, {color: colors.text}]}>
            Detalles de Contacto
          </Text>
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={userData.email}
            color={colors.text}
          />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={userData.phoneNumber}
            color={colors.text}
          />
        </Card>

        {/* Tarjeta de Información Profesional */}
        <Card style={styles.detailsCard}>
          <Text style={[styles.cardTitle, {color: colors.text}]}>
            Información Profesional
          </Text>
          <InfoRow
            icon="ribbon-outline"
            label="Licencia Profesional"
            value={userData.licenseNumber}
            color={colors.text}
          />
          <InfoRow
            icon="star-outline"
            label="Especialidad"
            value={userData.specialty}
            color={colors.text}
          />
        </Card>

        {/* Botón de Cerrar Sesión */}
        <View style={styles.logoutButtonContainer}>
          <Button
            text="Cerrar Sesión"
            type="danger"
            onPress={handleLogout}
            buttonStyle={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  detailsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButtonContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  logoutButton: {
    width: '100%',
  },
});
