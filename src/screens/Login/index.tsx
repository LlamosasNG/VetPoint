import {Button, Card, Input, Logo} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import {RootStackScreenProps} from '@navigation/types';
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const LoginScreen: React.FC<RootStackScreenProps<'Login'>> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de inicio de sesión con Firebase
    Alert.alert('Inicio de sesión', `Email: ${email}, Contraseña: ${password}`);
  };

  const handleForgotPassword = () => {
    // Lógica para recuperar contraseña
    Alert.alert('Recuperar contraseña', 'Funcionalidad no implementada');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Logo />
        <Text style={[styles.title, {color: colors.primary}]}>
          Bienvenido de Nuevo
        </Text>
        <Text style={[styles.subtitle, {color: colors.text}]}>
          Inicia sesión para continuar
        </Text>
        <Card style={styles.card}>
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
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.forgotPassword, {color: colors.primary}]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <Button text="Iniciar Sesión" type="primary" onPress={handleLogin} />
        </Card>
        <View style={styles.footer}>
          <Text style={[styles.footerText, {color: colors.text}]}>
            ¿No tienes una cuenta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.link, {color: colors.primary}]}>
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 16,
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
