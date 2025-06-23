import {Button, Card, Input, Logo} from '@components/ui';
import {useAuth} from '@context/AuthContext';
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

export const LoginScreen: React.FC<RootStackScreenProps<'Login'>> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Campos incompletos',
        'Por favor, introduce tu email y contraseña.',
      );
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Si el login es exitoso, el listener en AuthContext
      // se encargará de la navegación a la pantalla Home.
    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado.';
      switch (error.message) {
        case 'auth/user-not-found':
          errorMessage =
            'No se encontró ningún usuario con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta. Inténtalo de nuevo.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido.';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      Alert.alert('Error al iniciar sesión', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Lógica para recuperar contraseña
    Alert.alert('Recuperar contraseña', 'Funcionalidad no implementada');
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              editable={!loading}
            />
            <Input
              label="Contraseña"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
              <Text style={[styles.forgotPassword, {color: colors.primary}]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
            <Button
              text="Iniciar Sesión"
              type="primary"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />
          </Card>
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.text}]}>
              ¿No tienes una cuenta?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={loading}>
              <Text style={[styles.link, {color: colors.primary}]}>
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
