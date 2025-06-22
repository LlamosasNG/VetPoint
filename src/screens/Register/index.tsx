import {Button, Card, Input, Logo} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import {RootStackScreenProps} from '@navigation/types';
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

export const RegisterScreen: React.FC<RootStackScreenProps<'Register'>> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNextStep = () => {
    // Validar campos antes de continuar
    if (!name || !email || !password) {
      Alert.alert('Campos incompletos', 'Por favor, rellena todos los campos.');
      return;
    }

    navigation.navigate('RegisterProfessionalInfo', {
      name,
      email,
      password,
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView>
        <View style={styles.content}>
          <Logo />
          <Text style={[styles.title, {color: colors.primary}]}>
            Crea una Cuenta (Paso 1 de 2)
          </Text>
          <Text style={[styles.subtitle, {color: colors.text}]}>
            Comienza con tu información básica.
          </Text>
          <Card style={styles.card}>
            <Input
              label="Nombre Completo"
              placeholder="Tu Nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <Input
              label="Correo Electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Contraseña"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button text="Siguiente" type="primary" onPress={handleNextStep} />
          </Card>
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.text}]}>
              ¿Ya tienes una cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, {color: colors.primary}]}>
                Inicia Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (los estilos permanecen igual que en la versión anterior)
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
    fontSize: 28,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
