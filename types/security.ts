export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export interface SecurityFormProps {
  initialData?: Partial<SecurityData>;
  onSave?: (data: SecurityData) => void;
  isLoading?: boolean;
  className?: string;
}
