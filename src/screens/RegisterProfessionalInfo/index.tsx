import {useAuth} from '@/context/AuthContext';
import {CreateUserInput} from '@/types';
import {Button, Card, Input, Logo} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import {AuthScreenProps} from '@navigation/types';
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const RegisterProfessionalInfoScreen: React.FC<
  AuthScreenProps<'RegisterProfessionalInfo'>
> = ({route}) => {
  const {name, email, password} = route.params;
  const {colors} = useTheme();
  const [clinicName, setClinicName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const {register} = useAuth();

  const handleRegister = async () => {
    // Creamos el objeto completo con todos los datos del usuario
    const newUser: CreateUserInput = {
      name,
      email,
      password,
      clinicName,
      licenseNumber,
      specialty,
      phoneNumber,
    };

    try {
      await register(newUser);
      Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada.');
    } catch (error) {
      Alert.alert('Error en el Registro');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView>
        <View style={styles.content}>
          <Logo />
          <Text style={[styles.title, {color: colors.primary}]}>
            Datos Profesionales
          </Text>
          <Text style={[styles.subtitle, {color: colors.text}]}>
            Casi terminamos. Completa tu perfil.
          </Text>
          <Card style={styles.card}>
            <Input
              label="Nombre de la Clínica"
              placeholder="Clínica Veterinaria"
              value={clinicName}
              onChangeText={setClinicName}
              autoCapitalize="words"
            />
            <Input
              label="Número de Licencia Profesional"
              placeholder="Cédula Profesional"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />
            <Input
              label="Especialidad (Opcional)"
              placeholder="Ej. Cirugía General"
              value={specialty}
              onChangeText={setSpecialty}
              autoCapitalize="words"
            />
            <Input
              label="Teléfono (Opcional)"
              placeholder="Tu número de teléfono"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Button
              text="Finalizar Registro"
              type="primary"
              onPress={handleRegister}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    padding: 24,
  },
});
