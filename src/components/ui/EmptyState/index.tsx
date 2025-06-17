import {Button, Card} from '@components/ui';
import {useTheme} from '@context/ThemeContext';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface EmptyStateProps {
  type: 'no_patients' | 'no_search_results';
  searchQuery?: string;
  onAddPatient?: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  onAddPatient,
  onClearSearch,
}) => {
  const {colors} = useTheme();

  const getEmptyStateContent = () => {
    switch (type) {
      case 'no_patients':
        return {
          icon: '🐾',
          title: 'No hay pacientes registrados',
          subtitle:
            'Comienza creando el perfil de tu primer paciente para llevar un registro completo de su atención veterinaria',
          buttonText: 'Agregar Primer Paciente',
          onButtonPress: onAddPatient,
        };
      case 'no_search_results':
        return {
          icon: '🔍',
          title: 'No se encontraron resultados',
          subtitle: `No hay pacientes que coincidan con "${searchQuery}". Intenta con otro término de búsqueda o verifica la ortografía.`,
          buttonText: 'Limpiar Búsqueda',
          onButtonPress: onClearSearch,
        };
      default:
        return {
          icon: '❓',
          title: 'Sin resultados',
          subtitle: 'No hay información disponible',
          buttonText: 'Volver',
          onButtonPress: () => {},
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{content.icon}</Text>
      </View>

      <Text style={[styles.title, {color: colors.text}]}>{content.title}</Text>

      <Text style={[styles.subtitle, {color: colors.gray}]}>
        {content.subtitle}
      </Text>

      {content.onButtonPress && (
        <Button
          text={content.buttonText}
          type="primary"
          onPress={content.onButtonPress}
          buttonStyle={styles.button}
        />
      )}

      {type === 'no_patients' && (
        <View style={styles.tipsContainer}>
          <Text style={[styles.tipsTitle, {color: colors.primary}]}>
            💡 Consejos para empezar:
          </Text>
          <Text style={[styles.tipText, {color: colors.text}]}>
            • Registra información básica del paciente y propietario
          </Text>
          <Text style={[styles.tipText, {color: colors.text}]}>
            • Describe los síntomas detalladamente
          </Text>
          <Text style={[styles.tipText, {color: colors.text}]}>
            • Actualiza el diagnóstico y tratamiento después de la consulta
          </Text>
          <Text style={[styles.tipText, {color: colors.text}]}>
            • Usa la búsqueda para encontrar pacientes rápidamente
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  tipsContainer: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});
