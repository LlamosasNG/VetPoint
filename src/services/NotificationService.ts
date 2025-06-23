import {Patient} from '@/types/Patient';
import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    this.configure();
    this.createChannel();
  }

  configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('NOTIF_SERVICE: Token registrado:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIF_SERVICE: Notificación recibida:', notification);
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
        console.log(
          `NOTIF_SERVICE: Canal 'vetpoint-appointments' creado: ${created}`,
        ),
    );
  }

  scheduleTestNotification() {
    const fireDate = new Date(Date.now() + 5 * 1000);
    console.log(
      `NOTIF_SERVICE: Programando notificación de PRUEBA para: ${fireDate.toLocaleTimeString()}`,
    );

    PushNotification.localNotificationSchedule({
      // --- AJUSTES DE PRIORIDAD Y VISIBILIDAD ---
      channelId: 'vetpoint-appointments',
      id: '12345',
      title: '¡Notificación de Prueba! 🔔',
      message: 'Si ves esto, la configuración funciona.',
      date: fireDate,
      allowWhileIdle: true, // Permite que se dispare incluso en modo de bajo consumo
      importance: 'high', // Le da prioridad alta (importante)
      priority: 'high', // Prioridad para versiones antiguas de Android
      visibility: 'public', // Asegura que se muestre en la pantalla de bloqueo
      playSound: true,
      soundName: 'default',
      vibrate: true,
    });
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
