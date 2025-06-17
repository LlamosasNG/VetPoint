import {Button, Card, Input} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {PatientFormScreenProps} from '@navigation/types';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {CreatePatientInput, UpdatePatientInput} from '../../types/Patient';

const {width} = Dimensions.get('window');

// Tipos para los errores de validación
interface FormErrors {
  name?: string;
  species?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  symptoms?: string;
}

export const PatientFormScreen: React.FC<PatientFormScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {selectedPatient, createPatient, updatePatient, loading} =
    usePatients();

  // Estados del formulario
  const [formData, setFormData] = useState<CreatePatientInput>({
    name: '',
    species: '',
    breed: '',
    age: undefined,
    gender: undefined,
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        name: selectedPatient.name,
        species: selectedPatient.species,
        breed: selectedPatient.breed || '',
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        ownerName: selectedPatient.ownerName,
        ownerEmail: selectedPatient.ownerEmail,
        ownerPhone: selectedPatient.ownerPhone || '',
        symptoms: selectedPatient.symptoms,
        diagnosis: selectedPatient.diagnosis || '',
        treatment: selectedPatient.treatment || '',
        notes: selectedPatient.notes || '',
        status: selectedPatient.status,
      });
    }
  }, [selectedPatient]);

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar teléfono
  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim())
      newErrors.name = 'El nombre del paciente es obligatorio';
    if (!formData.species.trim())
      newErrors.species = 'La especie es obligatoria';
    if (!formData.ownerName.trim())
      newErrors.ownerName = 'El nombre del propietario es obligatorio';
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'El email es obligatorio';
    } else if (!isValidEmail(formData.ownerEmail)) {
      newErrors.ownerEmail = 'El email no es válido';
    }
    if (formData.ownerPhone && !isValidPhone(formData.ownerPhone)) {
      newErrors.ownerPhone = 'El teléfono debe tener 10 dígitos';
    }
    if (!formData.symptoms.trim())
      newErrors.symptoms = 'Los síntomas son obligatorios';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: keyof CreatePatientInput, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (selectedPatient) {
        const updateData: UpdatePatientInput = {
          id: selectedPatient.id,
          ...formData,
        };
        await updatePatient(updateData);
        Alert.alert('Éxito', 'Paciente actualizado correctamente', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        await createPatient(formData);
        Alert.alert('Éxito', 'Paciente creado correctamente', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo guardar el paciente. Inténtalo de nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.',
      [
        {text: 'Continuar editando', style: 'cancel'},
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const isEditing = !!selectedPatient;

  // Componente de progreso
  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${(currentStep / 3) * 100}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
      <Text style={[styles.progressText, {color: colors.text}]}>
        Paso {currentStep} de 3
      </Text>
    </View>
  );

  // Renderizar paso 1: Información del paciente
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={[styles.stepIcon, {color: colors.primary}]}>🐾</Text>
        <Text style={[styles.stepTitle, {color: colors.primary}]}>
          Información del Paciente
        </Text>
        <Text style={[styles.stepSubtitle, {color: colors.gray}]}>
          Datos básicos de la mascota
        </Text>
      </View>

      <View style={styles.fieldsContainer}>
        <Input
          label="Nombre del paciente"
          placeholder="Ej: Max, Luna, Rex..."
          value={formData.name}
          onChangeText={text => handleFieldChange('name', text)}
          error={errors.name}
          required
          autoCapitalize="words"
          containerStyle={styles.inputContainer}
        />

        <View style={styles.rowContainer}>
          <Input
            label="Especie"
            placeholder="Perro, Gato, Ave..."
            value={formData.species}
            onChangeText={text => handleFieldChange('species', text)}
            error={errors.species}
            required
            autoCapitalize="words"
            containerStyle={[styles.inputContainer, styles.halfWidth]}
          />
          <Input
            label="Raza"
            placeholder="Labrador, Persa..."
            value={formData.breed}
            onChangeText={text => handleFieldChange('breed', text)}
            autoCapitalize="words"
            containerStyle={[styles.inputContainer, styles.halfWidth]}
          />
        </View>

        <View style={styles.rowContainer}>
          <Input
            label="Edad (años)"
            placeholder="3"
            value={formData.age?.toString() || ''}
            onChangeText={text =>
              handleFieldChange('age', text ? parseInt(text) : undefined)
            }
            keyboardType="numeric"
            containerStyle={[styles.inputContainer, styles.halfWidth]}
          />
          <View style={[styles.halfWidth, styles.inputContainer]}>
            <Text style={[styles.genderLabel, {color: colors.text}]}>
              Género
            </Text>
            <View style={styles.genderContainer}>
              <Button
                text="♂ Macho"
                type={formData.gender === 'male' ? 'primary' : 'secondary'}
                onPress={() => handleFieldChange('gender', 'male')}
                buttonStyle={styles.genderButton}
                textStyle={styles.genderButtonText}
              />
              <Button
                text="♀ Hembra"
                type={formData.gender === 'female' ? 'primary' : 'secondary'}
                onPress={() => handleFieldChange('gender', 'female')}
                buttonStyle={styles.genderButton}
                textStyle={styles.genderButtonText}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Renderizar paso 2: Información del propietario
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={[styles.stepIcon, {color: colors.primary}]}>👤</Text>
        <Text style={[styles.stepTitle, {color: colors.primary}]}>
          Información del Propietario
        </Text>
        <Text style={[styles.stepSubtitle, {color: colors.gray}]}>
          Datos de contacto del dueño
        </Text>
      </View>

      <View style={styles.fieldsContainer}>
        <Input
          label="Nombre completo"
          placeholder="Juan Pérez García"
          value={formData.ownerName}
          onChangeText={text => handleFieldChange('ownerName', text)}
          error={errors.ownerName}
          required
          autoCapitalize="words"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Correo electrónico"
          placeholder="juan.perez@email.com"
          value={formData.ownerEmail}
          onChangeText={text => handleFieldChange('ownerEmail', text)}
          error={errors.ownerEmail}
          required
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Teléfono"
          placeholder="5551234567"
          value={formData.ownerPhone}
          onChangeText={text => handleFieldChange('ownerPhone', text)}
          error={errors.ownerPhone}
          keyboardType="phone-pad"
          maxLength={10}
          containerStyle={styles.inputContainer}
        />
      </View>
    </View>
  );

  // Renderizar paso 3: Información médica
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={[styles.stepIcon, {color: colors.primary}]}>🏥</Text>
        <Text style={[styles.stepTitle, {color: colors.primary}]}>
          Información Médica
        </Text>
        <Text style={[styles.stepSubtitle, {color: colors.gray}]}>
          Síntomas y diagnóstico
        </Text>
      </View>

      <View style={styles.fieldsContainer}>
        <Input
          label="Síntomas"
          placeholder="Describe los síntomas observados en detalle..."
          value={formData.symptoms}
          onChangeText={text => handleFieldChange('symptoms', text)}
          error={errors.symptoms}
          required
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Diagnóstico"
          placeholder="Diagnóstico médico (opcional)"
          value={formData.diagnosis}
          onChangeText={text => handleFieldChange('diagnosis', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Tratamiento"
          placeholder="Tratamiento recomendado (opcional)"
          value={formData.treatment}
          onChangeText={text => handleFieldChange('treatment', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Notas adicionales"
          placeholder="Observaciones importantes (opcional)"
          value={formData.notes}
          onChangeText={text => handleFieldChange('notes', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          containerStyle={styles.inputContainer}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.species.trim();
      case 2:
        return formData.ownerName.trim() && formData.ownerEmail.trim();
      case 3:
        return formData.symptoms.trim();
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.primary}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        {/* Header con gradiente */}
        <View style={[styles.header, {backgroundColor: colors.primary}]}>
          <Text style={styles.title}>
            {isEditing ? 'Editar' : 'Nueva'} {''}
            <Text style={styles.titleBold}>Cita</Text>
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? 'Actualiza la información del paciente'
              : 'Registra un nuevo paciente'}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.formContainer,
              {backgroundColor: colors.background},
            ]}>
            {!isEditing && renderProgress()}

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              <Card style={[styles.formCard, {backgroundColor: colors.card}]}>
                {isEditing ? (
                  <View>
                    {renderStep1()}
                    {renderStep2()}
                    {renderStep3()}
                  </View>
                ) : (
                  renderCurrentStep()
                )}
              </Card>
            </ScrollView>

            {/* Botones de navegación */}
            <View
              style={[
                styles.navigationContainer,
                {backgroundColor: colors.card},
              ]}>
              {!isEditing ? (
                <View style={styles.stepNavigation}>
                  <Button
                    text={currentStep === 1 ? 'Cancelar' : 'Anterior'}
                    type="danger"
                    onPress={
                      currentStep === 1
                        ? handleCancel
                        : () => setCurrentStep(currentStep - 1)
                    }
                    buttonStyle={styles.navButton}
                    disabled={isSubmitting}
                  />

                  {currentStep < 3 ? (
                    <Button
                      text="Siguiente"
                      type="primary"
                      onPress={() => setCurrentStep(currentStep + 1)}
                      buttonStyle={styles.navButton}
                      disabled={!canGoNext()}
                    />
                  ) : (
                    <Button
                      text="Crear Paciente"
                      type="success"
                      onPress={handleSubmit}
                      buttonStyle={styles.navButton}
                      loading={isSubmitting}
                      disabled={isSubmitting || !canGoNext()}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.stepNavigation}>
                  <Button
                    text="Cancelar"
                    type="danger"
                    onPress={handleCancel}
                    buttonStyle={styles.navButton}
                    disabled={isSubmitting}
                  />
                  <Button
                    text="Actualizar"
                    type="success"
                    onPress={handleSubmit}
                    buttonStyle={styles.navButton}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  titleBold: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF90',
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  stepContainer: {
    padding: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
  },
  fieldsContainer: {
    gap: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
  },
  genderButtonText: {
    fontSize: 14,
    textTransform: 'none',
  },
  navigationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
  },
});
