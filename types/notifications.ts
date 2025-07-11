// types/notifications.ts
export interface NotificationSettings {
  // Canales de Notificación
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Tipos de Notificación
  appointmentReminders: boolean;
  appointmentConfirmations: boolean;
  cancellationAlerts: boolean;
  
  // Reportes
  dailyReports: boolean;
  weeklyReports: boolean;
  marketingEmails: boolean;
}

export interface NotificationFormProps {
  initialSettings?: NotificationSettings;
  onSave: (settings: NotificationSettings) => Promise<void>;
  isLoading?: boolean;
}