import {CreatePatientInput, PatientStatus} from '@/types/Patient';
import {Button, Card, Input, VetHeader} from '@components/ui';
import {usePatients} from '@context/PatientsContext';
import {useTheme} from '@context/ThemeContext';
import {HomeStackScreenProps} from '@navigation/types';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const PatientFormScreen: React.FC<
  HomeStackScreenProps<'PatientForm'>
> = ({navigation}) => {
  const {colors} = useTheme();
  const {selectedPatient, createPatient, updatePatient, loading} =
    usePatients();

  const [formData, setFormData] = useState<Partial<CreatePatientInput>>({
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

  const [showPicker, setShowPicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        ...selectedPatient,
        age: selectedPatient.age || undefined,
        nextAppointment: selectedPatient.nextAppointment
          ? new Date(selectedPatient.nextAppointment)
          : undefined,
      });
    }
  }, [selectedPatient]);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentDate = selectedDate;
      if (Platform.OS === 'android' && datePickerMode === 'date') {
        setFormData(prev => ({...prev, nextAppointment: currentDate}));
        showMode('time');
      } else {
        setFormData(prev => ({...prev, nextAppointment: currentDate}));
      }
    }
  };

  const showMode = (modeToShow: 'date' | 'time') => {
    setShowPicker(true);
    setDatePickerMode(modeToShow);
  };

  const handleFieldChange = (field: keyof CreatePatientInput, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.species || !formData.ownerName) {
      Alert.alert(
        'Campos Obligatorios',
        'Por favor, completa la información del paciente y propietario.',
      );
      return;
    }
    try {
      if (selectedPatient) {
        await updatePatient({id: selectedPatient.id, ...formData});
      } else {
        await createPatient(formData as CreatePatientInput);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el paciente.');
    }
  };

  const statusOptions: {label: string; value: PatientStatus; icon: string}[] = [
    {label: 'Activo', value: 'active', icon: 'paw'},
    {label: 'En Tratamiento', value: 'in_treatment', icon: 'pulse'},
    {label: 'Emergencia', value: 'emergency', icon: 'alert-circle'},
    {label: 'Recuperado', value: 'recovered', icon: 'checkmark-circle'},
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <VetHeader
        screenTitle={selectedPatient ? 'Editar Ficha' : 'Nueva Ficha'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Información del Paciente */}
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              Información del Paciente
            </Text>
            <Input
              label="Nombre"
              value={formData.name}
              onChangeText={v => handleFieldChange('name', v)}
              required
            />
            <View style={styles.row}>
              <Input
                label="Especie"
                containerStyle={{flex: 1}}
                value={formData.species}
                onChangeText={v => handleFieldChange('species', v)}
                required
              />
              <Input
                label="Raza"
                containerStyle={{flex: 1}}
                value={formData.breed}
                onChangeText={v => handleFieldChange('breed', v)}
              />
            </View>
            <Input
              label="Edad (años)"
              value={formData.age?.toString()}
              onChangeText={v =>
                handleFieldChange('age', v ? parseInt(v) : undefined)
              }
              keyboardType="numeric"
            />
            <Text style={[styles.label, {color: colors.text}]}>Género</Text>
            <View style={styles.row}>
              <Button
                text="Macho ♂"
                type={formData.gender === 'male' ? 'primary' : 'secondary'}
                onPress={() => handleFieldChange('gender', 'male')}
                buttonStyle={{flex: 1}}
              />
              <Button
                text="Hembra ♀"
                type={formData.gender === 'female' ? 'primary' : 'secondary'}
                onPress={() => handleFieldChange('gender', 'female')}
                buttonStyle={{flex: 1}}
              />
            </View>
          </Card>

          {/* Información del Propietario */}
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              Información del Propietario
            </Text>
            <Input
              label="Nombre"
              value={formData.ownerName}
              onChangeText={v => handleFieldChange('ownerName', v)}
              required
            />
            <Input
              label="Email (Opcional)"
              value={formData.ownerEmail}
              onChangeText={v => handleFieldChange('ownerEmail', v)}
              keyboardType="email-address"
            />
            <Input
              label="Teléfono (Opcional)"
              value={formData.ownerPhone}
              onChangeText={v => handleFieldChange('ownerPhone', v)}
              keyboardType="phone-pad"
            />
          </Card>

          {/* Información Médica */}
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              Información Médica
            </Text>
            <Input
              label="Síntomas"
              value={formData.symptoms}
              onChangeText={v => handleFieldChange('symptoms', v)}
              multiline
              required
            />
            <Input
              label="Diagnóstico (Opcional)"
              value={formData.diagnosis}
              onChangeText={v => handleFieldChange('diagnosis', v)}
              multiline
            />
            <Input
              label="Tratamiento (Opcional)"
              value={formData.treatment}
              onChangeText={v => handleFieldChange('treatment', v)}
              multiline
            />
            <Input
              label="Notas (Opcional)"
              value={formData.notes}
              onChangeText={v => handleFieldChange('notes', v)}
              multiline
            />
          </Card>

          {/* Estado y Cita */}
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, {color: colors.text}]}>
              Estado y Próxima Cita
            </Text>
            <Text style={[styles.label, {color: colors.text}]}>
              Estado del Paciente
            </Text>
            <View style={styles.statusContainer}>
              {statusOptions.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        formData.status === opt.value
                          ? colors.primary
                          : colors.surface,
                    },
                  ]}
                  onPress={() => handleFieldChange('status', opt.value)}>
                  <Icon
                    name={opt.icon}
                    size={16}
                    color={formData.status === opt.value ? '#FFF' : colors.text}
                  />
                  <Text
                    style={[
                      styles.statusLabel,
                      {
                        color:
                          formData.status === opt.value ? '#FFF' : colors.text,
                      },
                    ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, {color: colors.text, marginTop: 20}]}>
              Próxima Cita (Opcional)
            </Text>
            <TouchableOpacity
              onPress={() => showMode('date')}
              style={[styles.dateInput, {borderColor: colors.border}]}>
              <Icon name="calendar" size={20} color={colors.gray} />
              <Text style={{color: colors.text, marginLeft: 10}}>
                {formData.nextAppointment
                  ? new Date(formData.nextAppointment).toLocaleString('es-ES')
                  : 'Seleccionar fecha y hora'}
              </Text>
            </TouchableOpacity>
          </Card>

          {showPicker && (
            <DateTimePicker
              value={
                formData.nextAppointment
                  ? new Date(formData.nextAppointment)
                  : new Date()
              }
              mode={datePickerMode}
              is24Hour={true}
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Button
            text={selectedPatient ? 'Actualizar Paciente' : 'Guardar Paciente'}
            type="primary"
            onPress={handleSubmit}
            loading={loading}
            buttonStyle={{margin: 16, paddingVertical: 16}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollContent: {padding: 16},
  card: {marginBottom: 16, padding: 20},
  cardTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 16},
  label: {fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333'},
  row: {flexDirection: 'row', gap: 16},
  statusContainer: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statusLabel: {marginLeft: 6, fontWeight: '500'},
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
});
