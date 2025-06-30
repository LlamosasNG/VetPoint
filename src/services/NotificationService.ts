import {Patient} from '@/types/Patient';
import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    this.configure();
    this.createChannel();
  }

  configure() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      requestPermissions: true,
    });
  }

  createChannel() {
    PushNotification.createChannel(
      {
        channelId: 'vetpoint-appointments',
        channelName: 'Citas de VetPoint',
        channelDescription: 'Recordatorios para citas de pacientes',
      },
      created =>
        console.log(`Canal 'vetpoint-appointments' creado: ${created}`),
    );
  }

  // --- HEMOS ELIMINADO LA FUNCIÓN scheduleTestNotification ---

  // Tu función de citas, ahora es la única función de programación
  scheduleAppointmentNotification(patient: Patient) {
    if (!patient.id || !patient.nextAppointment) {
      return;
    }

    const fireDate = new Date(patient.nextAppointment);
    const notificationId = this.generateNumericId(patient.id);

    PushNotification.localNotificationSchedule({
      channelId: 'vetpoint-appointments',
      id: notificationId.toString(),
      title: `Recordatorio de Cita`,
      message: `Tu paciente ${patient.name} tiene una cita programada.`,
      date: fireDate,
      allowWhileIdle: true,
      importance: 'high',
      priority: 'high',
      visibility: 'public',
      playSound: true,
      soundName: 'default',
      vibrate: true,
    });
    console.log(
      `Notificación de CITA programada para ${patient.name} con ID ${notificationId}`,
    );
  }

  private generateNumericId(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  cancelNotification(patientId: string) {
    if (!patientId) return;
    const notificationId = this.generateNumericId(patientId);
    PushNotification.cancelLocalNotification(notificationId.toString());
    console.log(`Notificación con ID ${notificationId} cancelada.`);
  }
}

export const notificationService = new NotificationService();
