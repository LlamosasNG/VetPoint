import {Patient} from '@/types/Patient';
import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'vetpoint-appointments',
        channelName: 'Citas de VetPoint',
        channelDescription: 'Recordatorios para citas de pacientes',
        playSound: true,
        soundName: 'default',
        vibrate: true,
      },
      created =>
        console.log(`Canal 'vetpoint-appointments' creado: ${created}`),
    );
  }

  // Programa una notificación para una cita
  scheduleAppointmentNotification(patient: Patient) {
    if (!patient.nextAppointment) return;

    const fireDate = new Date(patient.nextAppointment);
    // Opcional: programarla 1 hora antes
    // fireDate.setHours(fireDate.getHours() - 1);

    // El ID debe ser un número, podemos usar el timestamp de la cita
    const notificationId = fireDate.getTime().toString();

    PushNotification.localNotificationSchedule({
      channelId: 'vetpoint-appointments',
      id: notificationId,
      title: `Recordatorio de Cita: ${patient.name}`,
      message: `La cita de ${patient.name} con ${patient.ownerName} está programada para hoy.`,
      date: fireDate,
      allowWhileIdle: true,
      repeatTime: 1, // Para que no se repita
    });

    console.log(`Notificación programada para ${patient.name} en ${fireDate}`);
  }

  // Cancela una notificación si la cita cambia o se elimina
  cancelNotification(appointmentDate: Date) {
    if (!appointmentDate) return;
    const notificationId = new Date(appointmentDate).getTime().toString();
    PushNotification.cancelLocalNotification(notificationId);
    console.log(`Notificación ${notificationId} cancelada.`);
  }
}

export const notificationService = new NotificationService();
